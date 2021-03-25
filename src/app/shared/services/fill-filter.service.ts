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
    const headerDict = {
        'Client-ID': creds.client_id,
        'Authorization': creds.api_token
      }
    return this.http.post<Rating[]>(
    'http://localhost:3000/age_ratings', 
    'fields  rating; where category = 2; limit 20;', {headers: headerDict})
  }

  getEngines(): Observable<FormOption[]> {
    const headerDict = {
      'Client-ID': creds.client_id,
      'Authorization': creds.api_token
    }
    return this.http.post<FormOption[]>(
      'http://localhost:3000/game_engines',
      'fields name;', {headers: headerDict})
  }

  getModes(): Observable<FormOption[]> {
    const headerDict = {
      'Client-ID': creds.client_id,
      'Authorization': creds.api_token
    }
    return this.http.post<FormOption[]>(
      'http://localhost:3000/game_modes',
      'fields name;', {headers: headerDict})
  }

  getPlatforms(): Observable<FormOption[]> {
    const headerDict = {
      'Client-ID': creds.client_id,
      'Authorization': creds.api_token
    }
    return this.http.post<FormOption[]>(
      'http://localhost:3000/platforms',
      'fields name;', {headers: headerDict})
  }

  getGenres():Observable<FormOption[]> {
    const headerDict = {
      'Client-ID': creds.client_id,
      'Authorization': creds.api_token
    }
    return this.http.post<FormOption[]>(
      'http://localhost:3000/genres',
      'fields name;', {headers: headerDict})
  }
}