import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Game } from '../shared/interfaces/game';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.scss']
})
export class ExplorePageComponent implements OnInit, AfterViewInit {
  gamesList: Game[] = []
  constructor(private gameserv: GameService) { }
  ngAfterViewInit(): void {
    this.gameserv.getAllGames().subscribe(data => {
      data.forEach(element => this.gamesList.push(element))
    })
    console.log(this.gamesList)
  }
  
  ngOnInit(): void {
  }
  
}
