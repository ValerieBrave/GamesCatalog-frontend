import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cover } from "../interfaces/cover";
import { Game } from "../interfaces/game";

@Injectable({
    providedIn:'root'
})
export class GameService {
    constructor(private http: HttpClient){   }
    getAllGames(limit: number): Observable<Game[]> {
        return this.http.post<Game[]>(
        'http://localhost:3000/games', 
        'fields cover, first_release_date,'+ 
        ' name, rating, summary; sort first_release_date desc; limit '+limit.toString() +';')
    }
    getNextGames(limit: number, offset: number): Observable<Game[]> {
        return this.http.post<Game[]>(
        'http://localhost:3000/games', 
        'fields cover, first_release_date,'+
        ' name, rating, summary; sort first_release_date desc; limit '+limit.toString()+'; offset '+offset.toString()+';')
    }

    getGameCover(ids: number[]): Observable<Cover[]> {
        ids = ids.filter(e => {return e!= null})
        if(ids.length > 0)
            return this.http.post<Cover[]>(
            'http://localhost:3000/covers',
            'fields game, url; where id = ('+ids.toString()+');')
        else return new Observable<Cover[]>()
    }

    getGamesByName(name: string, limit: number): Observable<Game[]> {
        return this.http.post<Game[]>(
        'http://localhost:3000/games',
        'fields cover, first_release_date,'+ 
        ' name, rating, summary; limit '+limit.toString()+'; search "'+name+'";')
    }

    getNextGamesByName(name: string, limit: number, offset: number):Observable<Game[]>{
        return this.http.post<Game[]>(
        'http://localhost:3000/games', 
        'fields cover, first_release_date,'+
        ' name, rating, summary; search "'+name+'"; limit '+limit.toString()
        +'; offset '+offset.toString()+';')
    }
}