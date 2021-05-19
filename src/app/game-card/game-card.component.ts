import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Game } from '../shared/interfaces/game';
import { MessageService } from '../shared/services/message.service';
import { UserService } from '../shared/services/user.service';

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

  constructor(private snackBar: MessageService, private userService: UserService) { }

  ngOnInit(): void {
  }
  public like(id?: number) {
    if(id) {
      this.userService.like(id)
      .subscribe(resp => {
        this.userService.getLikes().subscribe(resp => {localStorage.setItem('liked', resp.body.likes.toString())})
        if(resp.body.liked) {
          this.game.liked = true;
          this.snackBar.showMessage('Game added to favourites list!')
          
        } else {
          this.snackBar.showMessage('Game deleted from favourites!')
          this.game.liked = false;
          if(this.onFavsPage) {
            this.list = this.list.filter( e=> e.id != id)
            this.dislikeEvent.emit(this.list)
          }
        }
      }, err => {
        this.snackBar.showMessage(err.message)
      })
    }
  }

}
