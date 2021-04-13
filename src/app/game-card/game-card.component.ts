import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../shared/interfaces/game';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit {
  @Input() game: Game
  @Input() show: boolean
  @Input() onFavsPage: boolean
  constructor(private snackBar: MessageService) { }

  ngOnInit(): void {
  }

  public like(id?: number) {
    if(id) {
        if(!this.game.liked) {  //like
          let ids = []
        if(localStorage.getItem('liked') != "") ids = localStorage.getItem('liked').split(',')
        if(ids.find(e => e == id.toString())) this.snackBar.ShowMessage('Game is already in favourites list!')
        else {
          ids.push(id.toString())
          localStorage.setItem('liked', ids.toString())
          this.game.liked = true
          this.snackBar.ShowMessage('Game added to favourites list!')
        }
      } else {  //dislike
        let ids = localStorage.getItem('liked').split(',').filter(e => e !=id.toString())
        localStorage.setItem('liked', ids.toString())
        this.snackBar.ShowMessage('Game deleted from favourites!')
        if(this.onFavsPage) this.show = false
      }
    }
  }

}
