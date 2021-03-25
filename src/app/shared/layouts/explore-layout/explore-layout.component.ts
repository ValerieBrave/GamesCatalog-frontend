import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-explore-layout',
  templateUrl: './explore-layout.component.html',
  styleUrls: ['./explore-layout.component.scss']
})
export class ExploreLayoutComponent implements OnInit, AfterViewInit {
  public userID: number = 4
  constructor() { }
  ngAfterViewInit(): void { }
  ngOnInit(): void { }
}
