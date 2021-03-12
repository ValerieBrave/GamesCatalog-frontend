import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FillFilterService } from '../../services/fill-filter.service';

@Component({
  selector: 'app-explore-layout',
  templateUrl: './explore-layout.component.html',
  styleUrls: ['./explore-layout.component.scss']
})
export class ExploreLayoutComponent implements OnInit {
  panelOpenState = false
  filterForm: FormGroup
  constructor(private filler: FillFilterService) { }

  ngOnInit(): void {

    this.filler.getRatings().subscribe(
      (data) => {
        console.log(data)
      },                                   //CORS!!!!!!!!
      err=> {
        console.log(err)
      }
    )

    this.filterForm = new FormGroup({
      releaseDate: new FormControl(),
      genre: new FormControl(),
      platform: new FormControl(),
      engine: new FormControl(),
      rating: new FormControl()
    })
  }

}
