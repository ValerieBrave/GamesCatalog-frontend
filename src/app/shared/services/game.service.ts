import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import {client_id, api_token} from "../../../assets/creds"
import { Cover } from "../interfaces/cover";
import { Game } from "../interfaces/game";

@Injectable({
    providedIn:'root'
})
export class GameService {
    constructor(private http: HttpClient){   }
    getAllGames(): Observable<Game[]> {
        const headerDict = {
            'Client-ID': client_id,
            'Authorization': api_token
          }
        return this.http.post<Game[]>(
        'http://localhost:3000/games', 
        'fields cover, first_release_date,'+ 
        ' name, rating, summary; limit 20;', {headers: headerDict})
    }

    getNextGames(limit: number, offset: number): Observable<Game[]> {
        const headerDict = {
            'Client-ID': client_id,
            'Authorization': api_token
          }
        return this.http.post<Game[]>(
            'http://localhost:3000/games', 
            'fields cover, first_release_date,'+
            ' name, rating, summary; limit '+limit.toString()+'; offset '+offset.toString()+';', 
            {headers: headerDict})
    }

    getGameCover(ids: number[]): Observable<Cover[]> {
        const headerDict = {
            'Client-ID': client_id,
            'Authorization': api_token
          }
        ids = ids.filter(e => {return e!= null})
        if(ids.length > 0)
            return this.http.post<Cover[]>(
            'http://localhost:3000/covers',
            'fields game, url; where id = ('+ids.toString()+');',
            {headers: headerDict})
        else return new Observable<Cover[]>()
    }
}