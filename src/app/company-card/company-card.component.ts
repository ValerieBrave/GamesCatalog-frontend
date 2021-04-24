import { Component, Input, OnInit } from '@angular/core';
import { Company } from '../shared/interfaces/company';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent {
  @Input() company: Company

}
