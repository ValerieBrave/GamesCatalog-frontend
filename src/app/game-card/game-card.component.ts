import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Game } from '../shared/interfaces/game';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit {
  @Input() game: Game
  @Input() list?: Game[]
  @Input() onFavsPage?: boolean = false
  @Output() dislikeEvent = new EventEmitter<Game[]>()

  constructor(private snackBar: MessageService) { }

  ngOnInit(): void {
  }
  public like(id?: number) {
    if(id) {
        if(!this.game.liked) {  //like
          let ids = []
        if(localStorage.getItem('liked') != "") ids = localStorage.getItem('liked').split(',')
        if(ids.find(e => e == id.toString())) this.snackBar.showMessage('Game is already in favourites list!')
        else {
          //this.list.push
          ids.push(id.toString())
          localStorage.setItem('liked', ids.toString())
          this.game.liked = true
          this.snackBar.showMessage('Game added to favourites list!')
        }
      } else {  //dislike
        let ids = localStorage.getItem('liked').split(',').filter(e => e !=id.toString())
        localStorage.setItem('liked', ids.toString())
        if(this.onFavsPage) {
          this.list = this.list.filter( e=> e.id != id)
          this.dislikeEvent.emit(this.list)
        }
        this.game.liked = false
        this.snackBar.showMessage('Game deleted from favourites!')
      }
    }
  }

}
