import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import {creds} from "../constants"
import { getRatingNumber } from "../models/filter/rating"
import { Observable } from "rxjs"
import { Game } from "../interfaces/game"


@Injectable({
    providedIn:'root'
})
export class FormService {

  constructor(private http: HttpClient){   }

  private getPegiIdsByRating(rating: number): Promise<number[]> {
    const headerDict = {
      'Client-ID': creds.client_id,
      'Authorization': creds.api_token
    }
    return this.http.post<number[]>(
    'http://localhost:3000/age_ratings',
    `where category = 2 & rating = ${rating}; limit 100;`, {headers: headerDict}).toPromise()   
  }

  public async constructQuery(values: any, limit: number, offset? :number): Promise<string> {
      let rc = 'fields cover, first_release_date, name, rating, summary; sort first_release_date desc; '
      let add = ''
      let where_set = false
      let ready = false
      if(values['engine']) {
        add+=`where game_engines = (${values['engine']}) `
        where_set = true
      }
      if(values['genre']) {
        if(where_set) add+= `& genres = (${values['genre']}) `
        else {
          add+= `where genres = (${values['genre']}) `
          where_set = true
        }
      }
      if(values['platform']) {
        if(where_set) add+= `& platforms = (${values['platform']}) `
        else {
          add+= `where platforms = (${values['platform']}) `
          where_set = true
        }
      }
      if(values['mode']) {
        if(where_set) add+= `& game_modes = (${values['mode']}) `
        else {
          add+= `where game_modes = (${values['mode']}) `
          where_set = true
        }
      }
      if(values['rating']) {
        if(where_set) add+= `& rating > ${values['rating']-1} & rating < ${values['rating']+1} `
        else {
          add+= `where rating > ${values['rating']-1} & rating < ${values['rating']+1} `
          where_set = true
        }
      }
      if(values['releaseDate']) {
        let offset = new Date().getTimezoneOffset()*60  //my timezone offset in seconds
        let date_search = Date.parse(values['releaseDate'])/1000  //epoch time with timezone
        date_search -= offset // gmt as in api
        if(where_set) {
          add+= `& first_release_date = ${date_search} `
        } else {
          add+=`where first_release_date = ${date_search} `
          where_set = true
        }
      }
      if(values['pegiRating']) {
        let rating_number = getRatingNumber(values['pegiRating'])
        let ids = []
        ids = await this.getPegiIdsByRating(getRatingNumber(values['pegiRating']))
        ids = ids.map(e => e['id'])
        if(where_set) {
          add += `& age_ratings = (${ids.toString()}) `
        } else {
          add += `where age_ratings = (${ids.toString()}) `
          where_set = true
        }
      }
      rc+=add+`; limit ${limit}; `
      if(offset) rc += `offset ${offset};`
      return rc
  }

  public SearchGames(query: string): Observable<Game[]> {
    const headerDict = {
      'Client-ID': creds.client_id,
      'Authorization': creds.api_token
    }
    return this.http.post<Game[]>(
      'http://localhost:3000/games',
      query, {headers: headerDict}
    )
  }
}