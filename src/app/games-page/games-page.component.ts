import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { formSliderParams, exploreScrollParams, ngxSpinnerParams } from '../shared/constants'
import { Game } from '../shared/interfaces/game';
import { GameService } from '../shared/services/game.service';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  styleUrls: ['./games-page.component.scss']
})
export class GamesPageComponent implements OnInit, AfterViewInit {

  constructor(private gameserv: GameService,
              private snackBar: MessageService,
              private spinner: NgxSpinnerService) { }
  //ui component parameters
  public formSliderParams = formSliderParams
  public exploreScrollParams = exploreScrollParams
  public ngxSpinnerParams = ngxSpinnerParams
  //list of games displayed
  public gamesList: Game[] = []
  private liked_ids = []

  //for infinite scroll
  public notEmptyResp: boolean = true
  public notScrolly: boolean = true
  private limit: number = 20
  private curOffset: number = this.limit

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.liked_ids = localStorage.getItem('liked').split(',')
    this.fillFavouritesList()
  }

  private fillFavouritesList(): void {
    this.gameserv.getGamesById(this.liked_ids, this.limit).subscribe(
      data => {
        this.gamesList = []; 
        data.forEach(element => this.gamesList.push(element))
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
    if(this.notScrolly && this.notEmptyResp) {
      this.spinner.show()
      this.notScrolly = false
      this.gameserv.getGamesById(this.liked_ids, this.limit, this.curOffset)
      .subscribe(
        (data) => {
          this.notEmptyResp = data == null? false: (data.length == 0?false:true)
          if(this.notEmptyResp) {
            let ids = []
            data.map(e => ids.push(e.cover))
            this.gameserv.getGameCover(ids).subscribe(data2 => data2.forEach(e => data.find(g => g.id == e.game).cover_url = e.url))
            this.gamesList = this.gamesList.concat(data)
          }
          
          this.spinner.hide()
          this.curOffset+=this.limit
          this.notScrolly = true;
          if(this.notEmptyResp == false) this.notEmptyResp = true
        })
    }
  }

  dislike(id?: number): void {
    if(id) {
      this.gamesList = this.gamesList.filter(e => e.id != id)
      let ids = localStorage.getItem('liked').split(',').filter(e => e !=id.toString())
      localStorage.setItem('liked', ids.toString())
      this.snackBar.ShowMessage('Game deleted from favourites!')
    }
  }
}
