import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {creds} from "../constants"
import { Cover } from "../interfaces/cover";
import { Game } from "../interfaces/game";

@Injectable({
    providedIn:'root'
})
export class GameService {
    constructor(private http: HttpClient){   }
    getAllGames(limit: number): Observable<Game[]> {
        const headerDict = {
            'Client-ID': creds.client_id,
            'Authorization': creds.api_token
          }
        return this.http.post<Game[]>(
        'http://localhost:3000/games', 
        'fields cover, first_release_date,'+ 
        ' name, rating, summary; sort first_release_date asc; limit '+limit.toString() +';',
        {headers: headerDict})
    }
    getNextGames(limit: number, offset: number): Observable<Game[]> {
        const headerDict = {
            'Client-ID': creds.client_id,
            'Authorization': creds.api_token
          }
        return this.http.post<Game[]>(
        'http://localhost:3000/games', 
        'fields cover, first_release_date,'+
        ' name, rating, summary; sort first_release_date asc; limit '+limit.toString()+'; offset '+offset.toString()+';', 
        {headers: headerDict})
    }

    getGameCover(ids: number[]): Observable<Cover[]> {
        const headerDict = {
            'Client-ID': creds.client_id,
            'Authorization': creds.api_token
          }
        ids = ids.filter(e => {return e!= null})
        if(ids.length > 0)
            return this.http.post<Cover[]>(
            'http://localhost:3000/covers',
            'fields game, url; where id = ('+ids.toString()+');',
            {headers: headerDict})
        else return new Observable<Cover[]>()
    }

    getGamesByName(name: string, limit: number): Observable<Game[]> {
        const headerDict = {
            'Client-ID': creds.client_id,
            'Authorization': creds.api_token
        }
        return this.http.post<Game[]>(
        'http://localhost:3000/games',
        'fields cover, first_release_date,'+ 
        ' name, rating, summary; limit '+limit.toString()+'; search "'+name+'";', 
        {headers: headerDict})
    }

    getNextGamesByName(name: string, limit: number, offset: number):Observable<Game[]>{
        const headerDict = {
            'Client-ID': creds.client_id,
            'Authorization': creds.api_token
        }
        return this.http.post<Game[]>(
        'http://localhost:3000/games', 
        'fields cover, first_release_date,'+
        ' name, rating, summary; search "'+name+'"; limit '+limit.toString()
        +'; offset '+offset.toString()+';', 
        {headers: headerDict})
    }
}