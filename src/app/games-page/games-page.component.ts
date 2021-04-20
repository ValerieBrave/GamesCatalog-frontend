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

  constructor(private gameserv: GameService,
              private spinner: NgxSpinnerService) { }
  //ui component parameters
  public formSliderParams = formSliderParams
  public exploreScrollParams = exploreScrollParams
  public ngxSpinnerParams = ngxSpinnerParams
  //list of games displayed
  public gamesList: Game[] = []
  private liked_ids = []

  //for infinite scroll
  private limit: number = 20
  private curOffset: number = this.limit

  ngOnInit(): void {
    if(localStorage.getItem('liked') != null) {
      localStorage.getItem('liked').split(',').forEach(e => {if(e != "") this.liked_ids.push(parseInt(e))})
    } else {
      localStorage.setItem('liked', user1.liked.toString())
      this.liked_ids = user1.liked
    }
  }

  ngAfterViewInit(): void {
    this.fillFavouritesList()
  }

  private fillFavouritesList(): void {
    this.gameserv.getGamesById(this.liked_ids, this.limit).subscribe(
      data => {
        this.gamesList = []; 
        data?.forEach(element => {
          element.liked = true
          this.gamesList.push(element)
        })
      },
      (err) => {console.log(err)},
      () => {
        let ids = []  //cover ids
        this.gamesList.map(e => ids.push(e.cover))
        this.gameserv.getGameCover(ids).subscribe(data => {
          data.forEach(e => this.gamesList.find(g => g.id == e.game).cover_url = e.url)
        })
      }
    )
  }

  onScroll(): void {
    this.spinner.show()
    this.gameserv.getGamesById(this.liked_ids, this.limit, this.curOffset)
    .subscribe( data => {
      if(data != null && data.length !=0) {
        let ids = []
        data.map(e => ids.push(e.cover))
        this.gameserv.getGameCover(ids).subscribe(data2 => data2.forEach(e => data.find(g => g.id == e.game).cover_url = e.url))
        data.forEach(element => element.liked = true)
        this.gamesList = this.gamesList.concat(data)
      }
      this.spinner.hide()
      this.curOffset+=this.limit
    })
  }

  
}
