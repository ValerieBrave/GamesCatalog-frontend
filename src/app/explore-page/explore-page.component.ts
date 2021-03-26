import { AfterViewInit} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Game } from '../shared/interfaces/game';
import { getRatingStringValue, getRatingNumber } from '../shared/models/filter/rating';
import { FillFilterService } from '../shared/services/fill-filter.service';
import { GameService } from '../shared/services/game.service';
import {formSliderParams, exploreScrollParams, ngxSpinnerParams} from '../shared/constants'
import { DatePipe } from '@angular/common';
import { atLeastOneValidator } from '../shared/validators/at-least-one-validator';
import { Rating } from '../shared/interfaces/rating';
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
  public pegiWithIds: Rating[] = []
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
        this.pegiWithIds.push(element)
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
    this.gameserv.getAllGames(this.limit).subscribe({
      next: (data)=>{this.gamesList = []; data.forEach(element => this.gamesList.push(element))},
      error: (err)=>{console.log(err)},
      complete: ()=> {
        let ids = []  //cover ids
        this.gamesList.map(e => ids.push(e.cover))
        this.gameserv.getGameCover(ids).subscribe(data => {
          data.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url = e.url)
        })
      }
    }) 
  }
  
  onScroll(): void {
    let is_searching: boolean = 
    this.searchForm.get('gameName').value != null && this.searchForm.get('gameName').value != ''
    if(this.notScrolly && this.notEmptyResp && !is_searching) {
      this.spinner.show()
      this.notScrolly = false
      this.gameserv.getNextGames(this.limit, this.curOffset).subscribe(data => {
        if(data.length == 0) this.notEmptyResp = false
        if(this.notEmptyResp) {
          let ids = []
          data.map(e => ids.push(e.cover))
          this.gameserv.getGameCover(ids).subscribe(data2 => {
            data2.forEach(e => data.find(g => g.id == e.game).cover_url = e.url)
          })
        }
        this.gamesList = this.gamesList.concat(data)
        this.spinner.hide()
        this.curOffset+=this.limit
        this.notScrolly = true;
        if(this.notEmptyResp == false) this.notEmptyResp = true //if scrolled to the end
      })
    } else if(this.notScrolly && this.notEmptyResp && is_searching) {
      this.spinner.show()
      this.notScrolly = false
      this.gameserv.getNextGamesByName(this.searchForm.get('gameName').value, this.limit, this.curOffset).subscribe(data => {
        if(data.length == 0) this.notEmptyResp = false
        if(this.notEmptyResp) {
          let ids = []
          data.map(e => ids.push(e.cover))
          this.gameserv.getGameCover(ids).subscribe(data2 => {
            data2.forEach(e => data.find(g => g.id == e.game).cover_url = e.url)
          })
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
      this.gameserv.getGamesByName(name, this.limit).subscribe({
        next: (data) => {this.gamesList = []; this.gamesList = data},
        error: (err)=>{console.log(err)},
        complete: ()=>{
          let ids = []
          this.gamesList.map(e => ids.push(e.cover))
          this.gameserv.getGameCover(ids).subscribe(data => {
            data.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url=e.url)
          })
        }
      })
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
      let pegi_ids = this.pegiWithIds.filter(e => 
        e.rating == getRatingNumber(this.filterForm.get('pegiRating').value).toString())
      console.log(this.pegiWithIds)
      console.log(pegi_ids)
      
    }
    
    // if(this.filterForm.dirty) {console.log('dirty')}
    // if(this.filterForm.touched) {console.log('touched')}
    // if(this.filterForm.pristine) {console.log('pristine')}
    // if(this.filterForm) {console.log('dirty')}
    // console.log(this.filterForm.value)
    // console.log(this.gameEngines)
    // let offset = new Date().getTimezoneOffset()*60  //my timezone offset in seconds
    // let date_search = Date.parse(this.filterForm.value['releaseDate'])/1000 // seconds in epoch time
    // console.log(date_search-offset) //GMT date for search
  }
}

