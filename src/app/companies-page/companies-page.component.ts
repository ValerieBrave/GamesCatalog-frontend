import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { formSliderParams, exploreScrollParams, ngxSpinnerParams } from '../shared/constants';
import { Company } from '../shared/interfaces/company';
import { CompanyService } from '../shared/services/company.service';

@Component({
  selector: 'app-companies-page',
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.scss']
})
export class CompaniesPageComponent implements OnInit, AfterViewInit {

  constructor(private compService: CompanyService,
              private spinner: NgxSpinnerService) { }
  
  public companiesList: Company[] = []
  private limit: number = 20
  private curOffset: number = this.limit
  //ui
  public formSliderParams = formSliderParams
  public exploreScrollParams = exploreScrollParams
  public ngxSpinnerParams = ngxSpinnerParams
  //for infinite scroll
  public notEmptyResp: boolean = true
  public notScrolly: boolean = true
  
  ngOnInit(): void {this.companiesList = []}

  ngAfterViewInit(): void {
    this.loadCompanies()
  }

  loadCompanies() : void {
    this.compService.getCompanies(this.limit).subscribe(data => {
      let ids = data.map(e => e.logo)
      this.compService.getCompanyLogo(ids, this.limit).subscribe(data2 => {
        data.forEach(e => {
          e.logo_url = data2.find(el => el.id == e.logo).url
          this.companiesList.push(e)
        })
      })
    })
  }

  onScroll(): void {
    if(this.notScrolly && this.notEmptyResp) {
      this.spinner.show()
      this.notScrolly = false
      this.compService.getCompanies(this.limit, this.curOffset)
      .subscribe(data => {
        if(data.length == 0) this.notEmptyResp = false
        if(this.notEmptyResp) {
          //get company logo
          let ids = data.map(e => e.logo)
          this.compService.getCompanyLogo(ids, this.limit).subscribe(data2 => {
            data.forEach(e => {
              e.logo_url = data2.find(el => el.id == e.logo).url
            })
          })
        }
        this.companiesList = this.companiesList.concat(data)
          this.spinner.hide()
          this.curOffset+=this.limit
          this.notScrolly = true;
          if(this.notEmptyResp == false) this.notEmptyResp = true //if scrolled to the end
      })
    }
  }
}