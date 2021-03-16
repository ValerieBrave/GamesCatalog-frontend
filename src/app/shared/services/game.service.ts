import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import {client_id, api_token} from "../../../assets/creds"
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
        'fields age_ratings, cover, first_release_date,'+ 
        'game_engines, game_modes, genres, multiplayer_modes,'+
        ' name, platforms, rating, summary;', {headers: headerDict})
    }
}