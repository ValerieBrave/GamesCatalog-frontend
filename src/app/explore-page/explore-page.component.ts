import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Game } from '../shared/interfaces/game';
import { getRatingStringValue } from '../shared/models/filter/rating';
import { FillFilterService } from '../shared/services/fill-filter.service';
import { GameService } from '../shared/services/game.service';
import { formSliderParams, exploreScrollParams, ngxSpinnerParams, user1 } from '../shared/constants'
import { atLeastOneValidator } from '../shared/validators/at-least-one-validator';
import { FormOption } from '../shared/interfaces/form_option';
import { MessageService } from '../shared/services/message.service';
import { ComingSoonService } from '../shared/services/coming-soon.service';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.scss']
})
export class ExplorePageComponent implements OnInit, AfterViewInit {
  constructor(private filterService: FillFilterService,
              private gameService: GameService, 
              private userService: UserService,
              private authService: AuthService,
              private comingSoonService: ComingSoonService,
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
  //users favourites
  private favourites = []

  //for infinite scroll
  private limit: number = 20
  private currentOffset: number = this.limit
  
  //coming soon switch state
  public comingSoonChecked: boolean = false
  
  //rating sorting checkboxes states
  public ratingAsc: boolean = false
  public ratingDesc: boolean = false 
  private currentSort: string = ''


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
    localStorage.setItem('auth-token', this.authService.getToken())
    this.userService.getLikes()
    .subscribe(resp => {
      localStorage.setItem('liked', resp.body.likes.toString())
      this.favourites = resp.body.likes
    })
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
    this.gameService.getGames(this.limit, null, null, null, this.currentSort).
    then(games => {
      this.gamesList = []; 
      games.forEach(element => {
        if(this.favourites.find(e => e == element.id.toString())) element.liked = true
        this.gamesList.push(element)
      })
    })
    .then(()=> {
      let ids = []  //cover ids
      this.gamesList.map(e => ids.push(e.cover))
      this.gameService.getGameCover(ids).subscribe(covers => {
        covers.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url = e.url)
      })
    })
  }

  fillComingSoonList(): void {
    this.comingSoonService.getAnnouncedGames(this.limit)
    .then(games => {
      this.gamesList = []
      games.forEach(element => {
        if(this.favourites.find(e => e == element.id.toString())) element.liked = true
        this.gamesList.push(element)
      })
    })
    .then(()=> {
      let ids = []  //cover ids
      this.gamesList.map(e => ids.push(e.cover))
      this.gameService.getGameCover(ids).subscribe(covers => {
        covers.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url = e.url)
      })
    })
  }
  
  onScroll(): void {
    this.spinner.show()
    if(!this.comingSoonChecked) { // load released games
      this.gameService.getGames(this.limit, 
        this.searchForm.get('gameName').value != null && this.searchForm.get('gameName').value != ''? this.searchForm.get('gameName').value: null,
        this.filterForm.invalid? null : this.filterForm.value,
        this.currentOffset,
        this.currentSort)
      .then(games => {
      if(games.length != 0) {
        let ids = []
        games.map(e => {
        if(this.favourites.find(el => el == e.id.toString())) e.liked = true
        ids.push(e.cover)
        })
        this.gameService.getGameCover(ids).subscribe(data2 => data2.forEach(e => games.find(g => g.id == e.game).cover_url = e.url))
      }
      this.gamesList = this.gamesList.concat(games)
      this.spinner.hide()
      this.currentOffset+=this.limit
      })
    } else {  //load announced games
      this.comingSoonService.getAnnouncedGames(this.limit,
        this.searchForm.get('gameName').value != null && this.searchForm.get('gameName').value != ''? this.searchForm.get('gameName').value: null,
                                                this.filterForm.invalid? null : this.filterForm.value,
                                                this.currentOffset)
      .then(games => {
        if(games.length != 0) {
          let ids = []
          games.map(e => {
          if(this.favourites.find(el => el == e.id.toString())) e.liked = true
          ids.push(e.cover)
          })
          this.gameService.getGameCover(ids).subscribe(data2 => data2.forEach(e => games.find(g => g.id == e.game).cover_url = e.url))
        }
        this.gamesList = this.gamesList.concat(games)
        this.spinner.hide()
        this.currentOffset+=this.limit
      })
    }
  }
  
  public searchGamesByName(): void {
    this.currentOffset = this.limit //new search - results from the beginning
    let name = this.searchForm.get('gameName').value
    if(name == '' || name == null) {
      if(!this.comingSoonChecked) this.fillGamesList()
      else this.fillComingSoonList()
    } else {  //not empty field
      if(!this.comingSoonChecked) {
        this.gameService.getGames(this.limit, name).then(
          games => {
            this.gamesList = []
            this.gamesList = games
            let ids = []
            this.gamesList.map(e => {
              if(this.favourites.find(el => el == e.id.toString())) e.liked = true
              ids.push(e.cover)
            })
            this.gameService.getGameCover(ids).subscribe(data => {
              data.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url=e.url)
            })
          }
        )
      } else {
        this.comingSoonService.getAnnouncedGames(this.limit, name).then(
          games => {
            this.gamesList = []
            this.gamesList = games
            let ids = []
            this.gamesList.map(e => {
              if(this.favourites.find(el => el == e.id.toString())) e.liked = true
              ids.push(e.cover)
            })
            this.gameService.getGameCover(ids).subscribe(data => {
              data.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url=e.url)
            })
          }
        )
      }
    }
  }

  public filterSearch(): void {
    if(!this.filterForm.invalid) {  // invalid = none of the fields is filled
      this.currentOffset = this.limit //new search - results from the beginning
      if(!this.comingSoonChecked) {
        this.gameService.getGames(this.limit, null, this.filterForm.value)
        .then(games => {
          this.gamesList = []
          this.gamesList = games
          let ids = []
          this.gamesList.map(e => {
            if(this.favourites.find(el => el == e.id.toString())) e.liked = true
            ids.push(e.cover)
          })
          this.gameService.getGameCover(ids).subscribe(covers => {
            covers.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url=e.url)
          })
        })
      } else {
        this.comingSoonService.getAnnouncedGames(this.limit, null, this.filterForm.value)
        .then(games => {
          this.gamesList = []
          this.gamesList = games
          let ids = []
          this.gamesList.map(e => {
            if(this.favourites.find(el => el == e.id.toString())) e.liked = true
            ids.push(e.cover)
          })
          this.gameService.getGameCover(ids).subscribe(covers => {
            covers.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url=e.url)
          })
        })
      }
    }
  }

  public comingSoonChanged(): void {
    this.currentOffset = this.limit
    if(this.comingSoonChecked) this.fillComingSoonList()
    else this.fillGamesList()
  }

  public sortingChanged(event): void {
    this.currentSort = event.source['id']
    this.currentOffset = this.limit
    if(this.ratingDesc && this.ratingAsc) { //two checked
      if(event.source['id'] == 'asc') this.ratingDesc = false
      else this.ratingAsc = false
     } else if(!this.ratingDesc && !this.ratingAsc) this.currentSort = null   // no sorting
    this.fillGamesList()
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
}

