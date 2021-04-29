import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../shared/interfaces/company';
import { Game } from '../shared/interfaces/game';
import { CompanyService } from '../shared/services/company.service';
import { GameService } from '../shared/services/game.service'
import { formSliderParams, exploreScrollParams, ngxSpinnerParams, user1 } from '../shared/constants'
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-companyinfo-page',
  templateUrl: './companyinfo-page.component.html',
  styleUrls: ['./companyinfo-page.component.scss']
})
export class CompanyinfoPageComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute,
              private compService: CompanyService,
              private gameService: GameService,
              private spinner: NgxSpinnerService ) { }

  private companyId
  public companyInfo: Company
  private favourites = []

  //for infinite scroll
  private limit: number = 3
  private devCurrentOffset: number = this.limit
  private pubCurrentOffset: number = this.limit
  //
  public developedLoaded$: Observable<Game[]>
  public publishedLoaded$: Observable<Game[]>
  public developed: Game[] = []
  public published: Game[] = []

  //ui component parameters
  public formSliderParams = formSliderParams
  public exploreScrollParams = exploreScrollParams
  public ngxSpinnerParams = ngxSpinnerParams
  public selectedTab = 0

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id')
    if(localStorage.getItem('liked') != null) {
      localStorage.getItem('liked').split(',').forEach(e => {if(e != "") this.favourites.push(parseInt(e))})
    } else {
      localStorage.setItem('liked', user1.liked.toString())
      this.favourites = user1.liked
    }
  }

  ngAfterViewInit(): void {
    this.fillCompanyInfo()
  }

  async fillCompanyInfo() {
    this.compService.getCompanyInfoByID(this.companyId)
    .subscribe(info => {
      this.companyInfo = info[0]
      if(this.companyInfo.logo) this.compService.getCompanyLogo([this.companyInfo.logo]).subscribe(logo => this.companyInfo.logo_url = logo[0].url)
      //filling games lists initial values
      if(this.companyInfo.developed) this.developedLoaded$ = this.loadConnectedGames(this.companyInfo.developed, this.developed)
      if(this.companyInfo.published) this.publishedLoaded$ = this.loadConnectedGames(this.companyInfo.published, this.published)
    })    
  }

  loadConnectedGames(ids: number[], list: Game[]): Observable<Game[]> {
    let sub: Observable<Game[]> = this.gameService.getGamesById(ids, this.limit)
    sub.subscribe(games => {
      let coverIds = games.map(e => e.cover)
      this.gameService.getGameCover(coverIds).subscribe(covers => covers.forEach(e => games.find(el => el.cover == e.id).cover_url = e.url))
      games.forEach(e=> {
        if(this.favourites.find(el => el == e.id.toString())) e.liked = true
          list.push(e)
      })
    })
    return sub
  }

  onScroll(): void {
    this.spinner.show()
    let passedIds = []
    let passedOffset
    if(this.selectedTab == 0) {
      passedOffset = this.devCurrentOffset
      this.devCurrentOffset += this.limit
      passedIds = this.companyInfo.developed
    } else {
      passedOffset = this.pubCurrentOffset
      this.pubCurrentOffset += this.limit
      passedIds = this.companyInfo.published
    }
    this.gameService.getGamesById(passedIds, this.limit, passedOffset).subscribe(games => {
      if(games != null && games.length != 0) {
        let ids = []
        games.map(e => {
          if(this.favourites.find(el => el == e.id.toString())) e.liked = true
          ids.push(e.cover)
        })
        this.gameService.getGameCover(ids).subscribe(covers => covers.forEach(e => games.find(g => g.id == e.game).cover_url = e.url))
        if(this.selectedTab == 0) {
          
          this.developed = this.developed.concat(games)
        }
        else {
          
          this.published = this.published.concat(games)
        }
      }
      this.spinner.hide()
    })
  }

}
