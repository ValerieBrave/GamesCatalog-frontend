import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../shared/interfaces/company';
import { Game } from '../shared/interfaces/game';
import { CompanyService } from '../shared/services/company.service';
import { GameService } from '../shared/services/game.service'
import { formSliderParams, exploreScrollParams, ngxSpinnerParams } from '../shared/constants'
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
    this.favourites = localStorage.getItem('liked').split(',')
  }

  ngAfterViewInit(): void {
    this.compService.getCompanyInfoByID(this.companyId)
    .then(data => {
      this.companyInfo = data[0]
      this.compService.getCompanyLogo([this.companyInfo.logo]).subscribe(data2 => this.companyInfo.logo_url = data2[0].url)

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
      
    })
  }

  dropOffset(): void {
    //this.curOffset = this.limit
    console.log(this.selectedTab)
  }

  onScroll(): void {
    if(this.notScrolly && this.notEmptyResp) {
      this.spinner.show()
      this.notScrolly = false
      let passed_ids = []
      let passed_offset
      if(this.selectedTab == 0) {
        passed_offset = this.devcurOffset
        passed_ids = this.companyInfo.developed
      }
      else {
        passed_offset = this.pubcurOffset
        passed_ids = this.companyInfo.published
      }
      this.gameService.getGamesById(passed_ids, this.limit, passed_offset).subscribe(data => {
        this.notEmptyResp = data == null? false: (data.length == 0?false:true)
        if(this.notEmptyResp) {
          let ids = []
          data.map(e => {
            if(this.favourites.find(el => el == e.id.toString())) e.liked = true
            ids.push(e.cover)
          })
          this.gameService.getGameCover(ids).subscribe(data2 => data2.forEach(e => data.find(g => g.id == e.game).cover_url = e.url))
          if(this.selectedTab == 0) {
            this.devcurOffset += this.limit
            this.developed = this.developed.concat(data)
          }
          else {
            this.pubcurOffset += this.limit
            this.published = this.published.concat(data)
          }
        }
        
        this.spinner.hide()
        
        this.notScrolly = true
        if(this.notEmptyResp == false) this.notEmptyResp = true
      })
      
    }
  }

}
