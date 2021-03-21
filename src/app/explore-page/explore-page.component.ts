import { AfterViewInit} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Game } from '../shared/interfaces/game';
import { getRatingStringValue } from '../shared/models/filter/rating';
import { FillFilterService } from '../shared/services/fill-filter.service';
import { GameService } from '../shared/services/game.service';



@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.scss']
})
export class ExplorePageComponent implements OnInit, AfterViewInit {
  constructor(private filterService: FillFilterService, 
              private gameserv: GameService, 
              private spinner: NgxSpinnerService) { }
  //for filter
  panelOpenState = false
  filterForm: FormGroup
  searchForm: FormGroup
  genres = []
  platforms = []
  pegiRatings = []
  gameEngines = []
  gameModes =[]

  //list of games displayed
  public gamesList: Game[] = []

  //for infinite scroll
  public notEmptyResp = true
  public notScrolly = true
  private limit = 20
  private curOffset = this.limit
  
  
  ngOnInit(): void {
    this.filterForm = new FormGroup({
      releaseDate: new FormControl(),
      genre: new FormControl(),
      platform: new FormControl(),
      engine: new FormControl(),
      pegiRating: new FormControl(),
      mode: new FormControl(),
      rating: new FormControl()
    })
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
      data.forEach(element => this.pegiRatings.push(getRatingStringValue(element['rating'])))
      this.pegiRatings = [...new Set(this.pegiRatings)].sort((n1,n2) => n1-n2)
    })
    this.filterService.getEngines().subscribe(data =>{
      data.forEach(element => this.gameEngines.push(element['name']))
    })
    this.filterService.getModes().subscribe(data => {
      data.forEach(element => this.gameModes.push(element['name']))
    })
    this.filterService.getPlatforms().subscribe(data => {
      data.forEach(element => this.platforms.push(element['name']))
    })
    this.filterService.getGenres().subscribe(data => {
      data.forEach(element => this.genres.push(element['name']))
    })
  }

  private fillGamesList(): void {
    this.gameserv.getAllGames(this.limit).subscribe({
      next: (data)=>{this.gamesList = []; data.forEach(element => this.gamesList.push(element))},
      error: (err)=>{console.log(err)},
      complete: ()=> {
        let copy = this.gamesList
        let by_two = copy.reduce((a, c, i) => {
          return i % 2 === 0 ? a.concat([copy.slice(i, i + 2)]) : a;
        }, [])
        by_two.forEach(e => {
          this.gameserv.getGameCover([e[0].cover, e[1].cover]).subscribe(data => {
            data.forEach(e => {
              this.gamesList.find(g => g.id==e.game).cover_url=e.url
            })
          })
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
          let copy = data
          let by_four =  copy.reduce((a, c, i) => {
            return i % 4 === 0 ? a.concat([copy.slice(i, i + 4)]) : a;
          }, [])
          by_four.forEach(e => {
            this.gameserv.getGameCover([e[0].cover, e[1]?.cover, e[2]?.cover, e[3]?.cover]).subscribe(data2 => {
              data2.forEach(e => {
                data.find(g => g.id==e.game).cover_url=e.url
              })
            })
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
          let copy = data
          let by_four =  copy.reduce((a, c, i) => {
            return i % 4 === 0 ? a.concat([copy.slice(i, i + 4)]) : a;
          }, [])
          by_four.forEach(e => {
            this.gameserv.getGameCover([e[0].cover, e[1]?.cover, e[2]?.cover, e[3]?.cover]).subscribe(data2 => {
              data2.forEach(e => {
                data.find(g => g.id==e.game).cover_url=e.url
              })
            })
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
    let name = this.searchForm.get('gameName').value
    if(name == '' || name == null) {
      this.fillGamesList()
    } else {  //not empty field
      this.gameserv.getGamesByName(name, this.limit).subscribe({
        next: (data) => {this.gamesList = []; this.gamesList = data},
        error: (err)=>{console.log(err)},
        complete: ()=>{
          let copy = this.gamesList
          let by_four =  copy.reduce((a, c, i) => {
            return i % 4 === 0 ? a.concat([copy.slice(i, i + 4)]) : a;
          }, [])
          by_four.forEach(e => {
            this.gameserv.getGameCover([e[0].cover, e[1]?.cover, e[2]?.cover, e[3]?.cover]).subscribe(data2 => {
              data2.forEach(e => {
                this.gamesList.find(g => g.id==e.game).cover_url=e.url
              })
            })
          })
        }
      })
    }
    
  }

}

