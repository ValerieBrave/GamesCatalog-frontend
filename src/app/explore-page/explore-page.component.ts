import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Game } from '../shared/interfaces/game';
import { getRatingStringValue } from '../shared/models/filter/rating';
import { FillFilterService } from '../shared/services/fill-filter.service';
import { GameService } from '../shared/services/game.service';
import { formSliderParams, exploreScrollParams, ngxSpinnerParams } from '../shared/constants'
import { DatePipe } from '@angular/common';
import { atLeastOneValidator } from '../shared/validators/at-least-one-validator';
import { FormOption } from '../shared/interfaces/form_option';


@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.scss'],
  providers: [DatePipe]
})
export class ExplorePageComponent implements OnInit, AfterViewInit {
  constructor(private filterService: FillFilterService,
              private gameserv: GameService, 
              private spinner: NgxSpinnerService) { }
  //for filter
  public filterForm: FormGroup
  public searchForm: FormGroup
  public genres: FormOption[] = []
  public platforms: FormOption[] = []
  public pegiRatings = []
  public gameEngines: FormOption[] = []
  public gameModes: FormOption[] = []

  //ui component parameters
  public formSliderParams = formSliderParams
  public exploreScrollParams = exploreScrollParams
  public ngxSpinnerParams = ngxSpinnerParams

  //list of games displayed
  public gamesList: Game[] = []

  //for infinite scroll
  public notEmptyResp: boolean = true
  public notScrolly: boolean = true
  private limit: number = 20
  private curOffset: number = this.limit
  
  
  ngOnInit(): void {
    this.filterForm = new FormGroup({
      releaseDate: new FormControl(),
      genre: new FormControl(),
      platform: new FormControl(),
      engine: new FormControl(),
      pegiRating: new FormControl(),
      mode: new FormControl(),
      rating: new FormControl()
    }, {validators: atLeastOneValidator})
    this.searchForm = new FormGroup({
      gameName: new FormControl()
    })
  }

  ngAfterViewInit(): void {
    this.fillForm()
    this.fillGamesList()
  }
  
  private fillForm(): void {
    this.filterService.getRatings().subscribe(data => {
      data.forEach(element => {
        this.pegiRatings.push(getRatingStringValue(element['rating']))
      })
      this.pegiRatings = [...new Set(this.pegiRatings)].sort((n1,n2) => n1-n2)
    })
    this.filterService.getEngines().subscribe(data =>{
      data.forEach(element => this.gameEngines.push(element))
    })
    this.filterService.getModes().subscribe(data => {
      data.forEach(element => this.gameModes.push(element))
    })
    this.filterService.getPlatforms().subscribe(data => {
      data.forEach(element => this.platforms.push(element))
    })
    this.filterService.getGenres().subscribe(data => {
      data.forEach(element => this.genres.push(element))
    })
  }

  public fillGamesList(): void {
    this.gameserv.getGames(this.limit).
    then(data => {this.gamesList = []; data.forEach(element => this.gamesList.push(element))})
    .then(()=> {
      let ids = []  //cover ids
      this.gamesList.map(e => ids.push(e.cover))
      this.gameserv.getGameCover(ids).subscribe(data => {
        data.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url = e.url)
      })
    })
  }
  
  onScroll(): void {
    if(this.notScrolly && this.notEmptyResp) {
      this.spinner.show()
      this.notScrolly = false
      this.gameserv.getGames(
        this.limit, 
        this.searchForm.get('gameName').value != null && this.searchForm.get('gameName').value != ''? this.searchForm.get('gameName').value: null,
        this.filterForm.invalid? null : this.filterForm.value,
        this.curOffset)
        .then(data => {
          if(data.length == 0) this.notEmptyResp = false
          if(this.notEmptyResp) {
            let ids = []
            data.map(e => ids.push(e.cover))
            this.gameserv.getGameCover(ids).subscribe(data2 => data2.forEach(e => data.find(g => g.id == e.game).cover_url = e.url))
          }
          this.gamesList = this.gamesList.concat(data)
          this.spinner.hide()
          this.curOffset+=this.limit
          this.notScrolly = true;
          if(this.notEmptyResp == false) this.notEmptyResp = true //if scrolled to the end
        })
    }
  }
  
  public searchGamesByName(): void {
    this.curOffset = this.limit //new search - results from the beginning
    let name = this.searchForm.get('gameName').value
    if(name == '' || name == null) {
      this.fillGamesList()
    } else {  //not empty field
      this.gameserv.getGames(this.limit, name).then(
        data => {
          this.gamesList = []
          this.gamesList = data
          let ids = []
          this.gamesList.map(e => ids.push(e.cover))
          this.gameserv.getGameCover(ids).subscribe(data => {
            data.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url=e.url)
          })
        }
      )
    }
  }

  public cancelSearch(): void {
    //cleaning form
    this.filterForm.get('releaseDate').setValue(null)
    this.filterForm.get('genre').setValue(null)
    this.filterForm.get('platform').setValue(null)
    this.filterForm.get('engine').setValue(null)
    this.filterForm.get('pegiRating').setValue(null)
    this.filterForm.get('mode').setValue(null)
    this.filterForm.get('rating').setValue(null)
    //standart list
    this.fillGamesList()
  }

  public filterSearch(): void {
    if(!this.filterForm.invalid) {  // invalid = none of the fields is filled
      this.curOffset = this.limit //new search - results from the beginning
      this.gameserv.getGames(this.limit, null, this.filterForm.value)
      .then(data => {
        this.gamesList = []
        this.gamesList = data
        let ids = []
        this.gamesList.map(e => ids.push(e.cover))
        this.gameserv.getGameCover(ids).subscribe(data => {
          data.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url=e.url)
        })
      })
    }
  }
}

