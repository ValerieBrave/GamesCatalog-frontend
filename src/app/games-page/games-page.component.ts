import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { formSliderParams, exploreScrollParams, ngxSpinnerParams, user1 } from '../shared/constants'
import { Game } from '../shared/interfaces/game';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  styleUrls: ['./games-page.component.scss']
})
export class GamesPageComponent implements OnInit, AfterViewInit {

  constructor(private gameServ: GameService,
              private spinner: NgxSpinnerService) { }
  //ui component parameters
  public formSliderParams = formSliderParams
  public exploreScrollParams = exploreScrollParams
  public ngxSpinnerParams = ngxSpinnerParams
  //list of games displayed
  public gamesList: Game[] = []
  private likedIds = []

  //for infinite scroll
  private limit: number = 20
  private currentOffset: number = this.limit

  ngOnInit(): void {
    if(localStorage.getItem('liked') != null) {
      localStorage.getItem('liked').split(',').forEach(e => {if(e != "") this.likedIds.push(parseInt(e))})
    } else {
      localStorage.setItem('liked', user1.liked.toString())
      this.likedIds = user1.liked
    }
  }

  ngAfterViewInit(): void {
    this.fillFavouritesList()
  }

  private fillFavouritesList(): void {
    this.gameServ.getGamesById(this.likedIds, this.limit).subscribe(
      games => {
        this.gamesList = []; 
        games?.forEach(element => {
          element.liked = true
          this.gamesList.push(element)
        })
      },
      (err) => console.log(err),
      () => {
        let ids = []  //cover ids
        this.gamesList.map(e => ids.push(e.cover))
        this.gameServ.getGameCover(ids).subscribe(covers => {
          covers.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url = e.url)
        })
      }
    )
  }

  onScroll(): void {
    this.spinner.show()
    this.gameServ.getGamesById(this.likedIds, this.limit, this.currentOffset)
    .subscribe( games => {
      if(games != null && games.length !=0) {
        let ids = []
        games.map(e => ids.push(e.cover))
        this.gameServ.getGameCover(ids).subscribe(data2 => data2.forEach(e => games.find(g => g.id == e.game).cover_url = e.url))
        games.forEach(element => element.liked = true)
        this.gamesList = this.gamesList.concat(games)
      }
      this.spinner.hide()
      this.currentOffset+=this.limit
    })
  }

  dislike(event) {
    this.gamesList = event
  }
}
