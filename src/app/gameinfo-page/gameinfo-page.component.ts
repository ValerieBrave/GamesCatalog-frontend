import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameInfo } from '../shared/interfaces/game-info';
import { getRatingStringValue } from '../shared/models/filter/rating';
import { GameInfoService } from '../shared/services/game-info.service';
import { GameService } from '../shared/services/game.service';
import { user1 } from '../shared/constants'

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
  public companies = []
  //users favourites
  private favourites = []
  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id')
    if(localStorage.getItem('liked') != null) {
      localStorage.getItem('liked').split(',').forEach(e => {if(e != "") this.favourites.push(parseInt(e))})
    } else {
      localStorage.setItem('liked', user1.liked.toString())
      this.favourites = user1.liked
    }
  }

  ngAfterViewInit(): void {
    this.fillGameInfo()
    
  }
  private fillGameInfo() {
    this.gameInfoService.getGameInfo(this.gameId)
    .subscribe(async info => {
      this.gameInfo = info[0]
      //get cover
      this.gameService.getGameCover([this.gameInfo.cover]).subscribe(cover => this.gameInfo.cover_url =cover[0].url)
      //get screens
      if(this.gameInfo.screenshots && this.gameInfo.screenshots.length) {
        this.gameInfoService.getGameScreenshots(this.gameInfo.screenshots)
        .subscribe(screens => {
          this.gameInfo.screenshots_urls = []
          screens.forEach(e => this.gameInfo.screenshots_urls.push(e.url))
        })
      }
      //get companies
      if(this.gameInfo.involved_companies != undefined) {
        let companies = await this.gameInfoService.getGameCompanies(this.gameInfo.involved_companies)
        this.companies = companies.map(e => new Object({id:e.id, name:e.name}))
      }
      //get pegi ratings
      if(this.gameInfo.age_ratings != undefined) {
        this.gameInfoService.getGamePegiRating(this.gameInfo.age_ratings)
        .subscribe(ratings => {
          this.gameInfo.age_rating_name = getRatingStringValue(ratings[0]?.rating)
        })
      }
      //get engines
      if(this.gameInfo.game_engines != undefined) {
        this.gameInfoService.getGameEngines(this.gameInfo.game_engines)
        .subscribe(engines => {
          this.gameInfo.game_engines_names = engines.map(e => e.name)
        })
      }
      //get modes
      if(this.gameInfo.game_modes != undefined) {
        this.gameInfoService.getGameModes(this.gameInfo.game_modes)
        .subscribe(modes => {
          this.gameInfo.game_modes_names = modes.map(e => e.name)
        })
      }
      //get genres
      if(this.gameInfo.genres != undefined) {
        this.gameInfoService.getGameGenres(this.gameInfo.genres)
        .subscribe(genres => {
          this.gameInfo.genres_names = genres.map(e => e.name)
        })
      }
      //get platforms
      if(this.gameInfo.platforms != undefined) {
        this.gameInfoService.getGamePlatforms(this.gameInfo.platforms)
        .subscribe(platforms => {
          this.gameInfo.platforms_names = platforms.map(e => e.name)
        })
      }
      if(this.favourites.find(e => e == this.gameInfo.id.toString())) this.gameInfo.liked = true
    })
  }
}
