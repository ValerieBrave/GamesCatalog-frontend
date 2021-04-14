import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameInfo } from '../shared/interfaces/game-info';
import { getRatingStringValue } from '../shared/models/filter/rating';
import { GameInfoService } from '../shared/services/game-info.service';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-gameinfo-page',
  templateUrl: './gameinfo-page.component.html',
  styleUrls: ['./gameinfo-page.component.scss']
})
export class GameinfoPageComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute, 
              private gameService: GameService,
              private gameInfoService: GameInfoService) { }

  private gameId
  public gameInfo: GameInfo
  //users favourites
  private favourites = []
  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id')
    this.favourites = localStorage.getItem('liked').split(',')
  }

  ngAfterViewInit(): void {
    this.fillGameInfo()
    
  }
  private fillGameInfo() {
    this.gameInfoService.getGameInfo(this.gameId).toPromise()
    .then(async data => {
      this.gameInfo = data[0]
      //get cover
      this.gameService.getGameCover([this.gameInfo.cover]).subscribe(data => this.gameInfo.cover_url =data[0].url)
      //get screens
      if(this.gameInfo.screenshots!=undefined) {
        this.gameInfoService.getGameScreenshots(this.gameInfo.screenshots)
        .subscribe(data => {
          this.gameInfo.screenshots_urls = []
          data.forEach(e => this.gameInfo.screenshots_urls.push(e.url))
        })
      }
      //get companies
      if(this.gameInfo.involved_companies != undefined) {
        //this.gameInfo.companies_names = []
        let companies = await this.gameInfoService.getGameCompanies(this.gameInfo.involved_companies)
        this.gameInfo.companies_names = companies.map(e => e.name)
      }
      //get pegi ratings
      if(this.gameInfo.age_ratings != undefined) {
        this.gameInfoService.getGamePegiRating(this.gameInfo.age_ratings)
        .subscribe(data => {
          this.gameInfo.age_rating_name = getRatingStringValue(data[0]?.rating)
        })
      }
      //get engines
      if(this.gameInfo.game_engines != undefined) {
        this.gameInfoService.getGameEngines(this.gameInfo.game_engines)
        .subscribe(data => {
          this.gameInfo.game_engines_names = data.map(e => e.name)
        })
      }
      //get modes
      if(this.gameInfo.game_modes != undefined) {
        this.gameInfoService.getGameModes(this.gameInfo.game_modes)
        .subscribe(data => {
          this.gameInfo.game_modes_names = data.map(e => e.name)
        })
      }
      //get genres
      if(this.gameInfo.genres != undefined) {
        this.gameInfoService.getGameGenres(this.gameInfo.genres)
        .subscribe(data => {
          this.gameInfo.genres_names = data.map(e => e.name)
        })
      }
      //get platforms
      if(this.gameInfo.platforms != undefined) {
        this.gameInfoService.getGamePlatforms(this.gameInfo.platforms)
        .subscribe(data => {
          this.gameInfo.platforms_names = data.map(e => e.name)
        })
      }
      if(this.favourites.find(e => e == this.gameInfo.id.toString())) this.gameInfo.liked = true
    })
  }
}
