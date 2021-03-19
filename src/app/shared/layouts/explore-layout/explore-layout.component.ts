import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Game } from '../../interfaces/game';
import { getRatingStringValue } from '../../models/filter/rating';
import { FillFilterService } from '../../services/fill-filter.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-explore-layout',
  templateUrl: './explore-layout.component.html',
  styleUrls: ['./explore-layout.component.scss']
})
export class ExploreLayoutComponent implements OnInit, AfterViewInit {
  panelOpenState = false
  filterForm: FormGroup
  selectedInputs={
    selectedDate: '',
    selectedGenre: '',
    selectedPlatform: '',
    selectedPegiRating:'',
    selectedEngine:'',
    selectedMode: '',
    selectedRating:''
  }
  genres = []
  platforms = []
  pegiRatings = []
  gameEngines = []
  gameModes =[]
  
  constructor(private filler: FillFilterService) { }
  ngAfterViewInit(): void {
    this.filler.getRatings().subscribe(data => {
      data.forEach(element => this.pegiRatings.push(getRatingStringValue(element['rating'])))
      this.pegiRatings = [...new Set(this.pegiRatings)].sort((n1,n2) => n1-n2)
    })
    this.filler.getEngines().subscribe(data =>{
      data.forEach(element => this.gameEngines.push(element['name']))
    })
    this.filler.getModes().subscribe(data => {
      data.forEach(element => this.gameModes.push(element['name']))
    })
    this.filler.getPlatforms().subscribe(data => {
      data.forEach(element => this.platforms.push(element['name']))
    })
    this.filler.getGenres().subscribe(data => {
      data.forEach(element => this.genres.push(element['name']))
    })
    
  }
  ngOnInit(): void {
    this.filterForm = new FormGroup({
      releaseDate: new FormControl(),
      genre: new FormControl(),
      platform: new FormControl(),
      engine: new FormControl(),
      pegirating: new FormControl(),
      mode: new FormControl(),
      rating: new FormControl()
    })
  }

  
  ngOnDestroy() {}

}
