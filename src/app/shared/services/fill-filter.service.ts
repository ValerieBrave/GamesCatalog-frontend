import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import {client_id, api_token} from "../../../assets/creds"

@Injectable({
    providedIn:'root'
})
export class FillFilterService {

  constructor(private http: HttpClient){   }

  getRatings(): Observable<[{id: number, rating: number}]> {
    const headerDict = {
        'Client-ID': client_id,
        'Authorization': api_token
      }
    return this.http.post<[{id: number, rating: number}]>(
    'http://localhost:3000/age_ratings', 
    'fields  rating; where category = 2; limit 20;', {headers: headerDict})
  }

  getEngines(): Observable<[{id: number, name: string}]> {
    const headerDict = {
      'Client-ID': client_id,
      'Authorization': api_token
    }
    return this.http.post<[{id: number, name: string}]>(
      'http://localhost:3000/game_engines',
      'fields name;', {headers: headerDict})
  }

  getModes(): Observable<[{id: number, name: string}]> {
    const headerDict = {
      'Client-ID': client_id,
      'Authorization': api_token
    }
    return this.http.post<[{id: number, name: string}]>(
      'http://localhost:3000/game_modes',
      'fields name;', {headers: headerDict})
  }

  getPlatforms(): Observable<[{id: number, name: string}]> {
    const headerDict = {
      'Client-ID': client_id,
      'Authorization': api_token
    }
    return this.http.post<[{id: number, name: string}]>(
      'http://localhost:3000/platforms',
      'fields name;', {headers: headerDict})
  }

  getGenres():Observable<[{id: number, name: string}]> {
    const headerDict = {
      'Client-ID': client_id,
      'Authorization': api_token
    }
    return this.http.post<[{id: number, name: string}]>(
      'http://localhost:3000/genres',
      'fields name;', {headers: headerDict})
  }
}