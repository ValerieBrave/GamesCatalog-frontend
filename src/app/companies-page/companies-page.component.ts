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
  
  
  ngOnInit(): void {this.companiesList = []}

  ngAfterViewInit(): void {
    this.loadCompanies()
  }

  loadCompanies() : void {
    this.compService.getCompanies(this.limit).subscribe(companies => {
      let ids = companies.map(e => e.logo)
      this.compService.getCompanyLogo(ids, this.limit).subscribe(logos => {
        companies.forEach(e => {
          e.logo_url = logos.find(el => el.id == e.logo).url
          this.companiesList.push(e)
        })
      })
    })
  }

  onScroll(): void {
    this.spinner.show()
    this.compService.getCompanies(this.limit, this.curOffset)
    .subscribe(companies => {
      if(companies != null && companies.length != 0) {
        let ids = companies.map(e => e.logo)
        this.compService.getCompanyLogo(ids, this.limit).subscribe(logos => {
          companies.forEach(e => {
            e.logo_url = logos.find(el => el.id == e.logo).url
          })
        })
        this.companiesList = this.companiesList.concat(companies)
      }
      this.spinner.hide()
      this.curOffset+=this.limit
    })
  }
}
