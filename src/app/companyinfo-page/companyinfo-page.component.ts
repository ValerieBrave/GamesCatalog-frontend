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
  public notEmptyResp: boolean = true
  public notScrolly: boolean = true
  private limit: number = 3
  private devcurOffset: number = this.limit
  private pubcurOffset: number = this.limit
  //
  public dev_loaded: Observable<Game[]>
  public pub_loaded: Observable<Game[]>
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
    this.companyInfo = await this.compService.getCompanyInfoByID(this.companyId)
    this.companyInfo = this.companyInfo[0]
    if(this.companyInfo.logo) this.compService.getCompanyLogo([this.companyInfo.logo]).subscribe(data2 => this.companyInfo.logo_url = data2[0].url)
      
    //filling games lists initial values
    if(this.companyInfo.developed) {
      this.dev_loaded = this.gameService.getGamesById(this.companyInfo.developed, this.limit)
      this.dev_loaded.subscribe(data2 => {
      let ids = data2.map(e => e.cover)
      this.gameService.getGameCover(ids).subscribe(data3 => data3.forEach(e => data2.find(el => el.cover == e.id).cover_url = e.url))
      data2.forEach(e=> this.developed.push(e))
    })
    }
    
    if(this.companyInfo.published) {
      this.pub_loaded = this.gameService.getGamesById(this.companyInfo.published, this.limit)
      this.pub_loaded.subscribe(data2 => {
      let ids = data2.map(e => e.cover)
      this.gameService.getGameCover(ids).subscribe(data3 => data3.forEach(e => data2.find(el => el.cover == e.id).cover_url = e.url))
      data2.forEach(e=> this.published.push(e))
    })
    }
  }

  onScroll(): void {
    this.spinner.show()
    let passed_ids = []
    let passed_offset
    if(this.selectedTab == 0) {
      passed_offset = this.devcurOffset
      this.devcurOffset += this.limit
      passed_ids = this.companyInfo.developed
    } else {
      passed_offset = this.pubcurOffset
      this.pubcurOffset += this.limit
      passed_ids = this.companyInfo.published
    }
    this.gameService.getGamesById(passed_ids, this.limit, passed_offset).subscribe(data => {
      if(data != null && data.length != 0) {
        let ids = []
        data.map(e => {
          if(this.favourites.find(el => el == e.id.toString())) e.liked = true
          ids.push(e.cover)
        })
        this.gameService.getGameCover(ids).subscribe(data2 => data2.forEach(e => data.find(g => g.id == e.game).cover_url = e.url))
        if(this.selectedTab == 0) {
          
          this.developed = this.developed.concat(data)
        }
        else {
          
          this.published = this.published.concat(data)
        }
      }
      this.spinner.hide()
    })
  }

}
