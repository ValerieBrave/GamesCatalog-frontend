import { AfterViewInit} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Game } from '../shared/interfaces/game';
import { GameService } from '../shared/services/game.service';
//import { NgxSpinnerService } from 'ngx-spinner';
export interface InfiniteScrollOptions {
  [key: string]: any;
  root: any;
}


@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.scss']
})
export class ExplorePageComponent implements OnInit, AfterViewInit {
  public gamesList: Game[] = []
  public notEmptyResp = true
  public notScrolly = true
  private limit = 20
  private curOffset = this.limit
  constructor(private gameserv: GameService, private spinner: NgxSpinnerService) { }
  ngAfterViewInit(): void {
    
    //-------------------------------------
    this.gameserv.getAllGames().subscribe({
      next: (data)=>{data.forEach(element => this.gamesList.push(element))},
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
  
  ngOnInit(): void {
  }
  
  onScroll(): void {
    
    if(this.notScrolly && this.notEmptyResp) {
      console.log('scroll --- request')
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
            this.gameserv.getGameCover([e[0].cover, e[1].cover, e[2].cover, e[3].cover]).subscribe(data2 => {
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
      })
    }
  }
  
}
