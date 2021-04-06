import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {creds} from "../constants"
import { FormOption } from "../interfaces/form_option";
import { Rating } from "../interfaces/rating";

@Injectable({
    providedIn:'root'
})
export class FillFilterService {

  constructor(private http: HttpClient){   }

  getRatings(): Observable<Rating[]> {
    return this.http.post<Rating[]>(
    'http://localhost:3000/age_ratings', 
    'fields  rating; where category = 2; limit 30;')
  }
  getEngines(): Observable<FormOption[]> {
    return this.http.post<FormOption[]>(
      'http://localhost:3000/game_engines',
      'fields name; limit 40;')
  }
  getModes(): Observable<FormOption[]> {
    return this.http.post<FormOption[]>(
      'http://localhost:3000/game_modes',
      'fields name; limit 30;')
  }
  getPlatforms(): Observable<FormOption[]> {
    return this.http.post<FormOption[]>(
      'http://localhost:3000/platforms',
      'fields name; limit 40;')
  }
  getGenres():Observable<FormOption[]> {
    return this.http.post<FormOption[]>(
      'http://localhost:3000/genres',
      'fields name; limit 30;')
  }
}