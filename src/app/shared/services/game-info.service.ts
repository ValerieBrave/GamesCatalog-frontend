import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Company } from "../interfaces/company";
import { Cover } from "../interfaces/cover";
import { FormOption } from "../interfaces/form_option";
import { GameInfo } from "../interfaces/game-info";
import { Rating } from "../interfaces/rating";

@Injectable({
    providedIn:'root'
})
export class GameInfoService {
    constructor(private http: HttpClient){   }
    getGameInfo(id: string): Observable<GameInfo> {
        let body = `fields age_ratings, first_release_date, cover, game_engines, game_modes, genres, '+
        'name, platforms, rating, rating_count, aggregated_rating, aggregated_rating_count, summary, storyline, screenshots, involved_companies; where id = ${id};`
        return this.http.post<GameInfo>('http://localhost:3000/games', body)
    }

    getGameScreenshots(ids: number[]) : Observable<Cover[]> {
        return this.http.post<Cover[]>('http://localhost:3000/screenshots',
        `fields url; where id = (${ids.toString()});`)
        .pipe(
            tap(
                data => {
                    data.forEach(e => {
                        let url = e.url.split('/')
                        url[6]='t_logo_med'
                        e.url = url.join('/')
                    })
                }
            )
        )
    }

    getGameInvolvedCompanies(involved_ids: number[]) : Promise<Company[]> {
        return this.http.post<Company[]>('http://localhost:3000/involved_companies',
        `fields company; where id = (${involved_ids.toString()});`).toPromise()
    }

    async getGameCompanies(involved_ids: number[]): Promise<Company[]> {
        let involved = await this.getGameInvolvedCompanies(involved_ids)
        let ids = involved.map(e => e.company)
        return this.http.post<Company[]>('http://localhost:3000/companies',
        `fields name; where id = (${ids});`).toPromise()
    }

    getGamePegiRating(pegiIds: number[]): Observable<Rating> {
        return this.http.post<Rating>('http://localhost:3000/age_ratings',
        `fields rating; where category = 2 & id = (${pegiIds.toString()});`)
    }
    
    getGameEngines(engIds: number[]): Observable<FormOption[]> {
        return this.http.post<FormOption[]>('http://localhost:3000/game_engines',
        `fields name; where id = (${engIds.toString()});`)
    }

    getGameModes(modesIds: number[]): Observable<FormOption[]> {
        return this.http.post<FormOption[]>('http://localhost:3000/game_modes',
        `fields name; where id = (${modesIds.toString()});`)
    }

    getGameGenres(genIds: number[]): Observable<FormOption[]> {
        return this.http.post<FormOption[]>('http://localhost:3000/genres',
        `fields name; where id = (${genIds.toString()});`)
    }

    getGamePlatforms(platIds: number[]): Observable<FormOption[]> {
        return this.http.post<FormOption[]>('http://localhost:3000/platforms',
        `fields name; where id = (${platIds.toString()});`)
    }
}