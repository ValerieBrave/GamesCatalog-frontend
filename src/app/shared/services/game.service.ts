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
    getGames(limit: number, offset?: number): Observable<Game[]> {
        let body = 'fields cover, first_release_date,'+ 
        ' name, rating, summary; sort first_release_date desc; limit '+limit.toString() +';'
        if(offset) body += ` offset ${offset};`
        return this.http.post<Game[]>(
        'http://localhost:3000/games', body)
    }
    
    getGameCover(ids: number[]): Observable<Cover[]> {
        ids = ids.filter(e => {return e!= null})
        if(ids.length > 0)
            return this.http.post<Cover[]>(
            'http://localhost:3000/covers',
            'fields game, url; where id = ('+ids.toString()+');')
        else return new Observable<Cover[]>()
    }

    getGamesByName(name: string, limit: number, offset?: number): Observable<Game[]> {
        let body = 'fields cover, first_release_date,'+ 
        ' name, rating, summary; limit '+limit.toString()+'; search "'+name+'";'
        if(offset) body +=` offset ${offset};`
        return this.http.post<Game[]>(
        'http://localhost:3000/games', body)
    }
}