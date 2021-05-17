import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Announce } from "../interfaces/announce";
import { Game } from "../interfaces/game";
import { FilterForm } from "../models/filter/form";
import { getRatingNumber } from "../models/filter/rating";
import { api_url } from '../../shared/constants';
@Injectable({
    providedIn:'root'
})
export class ComingSoonService {
    constructor(private http: HttpClient){   }

    getAnnouncesIds(limit: number, offset?: number) : Promise<Announce[]> {
        let body = `fields game; where date > ${Math.floor(new Date().getTime() / 1000)}; limit ${limit};`
        if(offset) body += ` offset ${offset};`
        return this.http.post<Announce[]>(`${api_url}/release_dates`, body).toPromise()
    }
    private getPegiIdsByRating(rating: number): Promise<number[]> {
        return this.http.post<number[]>(
            `${api_url}/age_ratings`,
        `where category = 2 & rating = ${rating}; limit 100;`).toPromise()   
    }
    async constructQuery(values: FilterForm, limit: number, offset? :number): Promise<string> {
        let basicBody = 'fields cover, first_release_date, name, summary; '+`where first_release_date > ${Math.floor(new Date().getTime() / 1000)} `
        let add = ''
        if(values['engine']) {
            add+=`& game_engines = (${values['engine']}) `
        }
        if(values['genre']) {
            add+= `& genres = (${values['genre']}) `
        }
        if(values['platform']) {
            add+= `& platforms = (${values['platform']}) `
        }
        if(values['mode']) {
            add+= `& game_modes = (${values['mode']}) `
        }
        if(values['releaseDate']) {
            let offset = new Date().getTimezoneOffset()*60  //my timezone offset in seconds
            let date_search = Date.parse(values['releaseDate'])/1000  //epoch time with timezone
            date_search -= offset // gmt as in api
            add+= `& first_release_date = ${date_search} `
            
        }
        if(values['pegiRating']) {
            let ids = []
            ids = await this.getPegiIdsByRating(getRatingNumber(values['pegiRating']))
            ids = ids.map(e => e['id'])
            add += `& age_ratings = (${ids.toString()}) `
            
        }
        basicBody+=add+`; limit ${limit}; `
        if(offset) basicBody += `offset ${offset};`
        return basicBody
    }

    async getAnnouncedGames(limit: number, name?: string, form?: FilterForm, offset?: number): Promise<Game[]> {
        let announces = await this.getAnnouncesIds(limit, offset)
        let ids = announces.map(e=> e.game)
        let body = ''
        if(!ids || !ids.length) return of(null).toPromise()
        if(name) {
            body = 'fields cover, first_release_date,'+ 
            ' name, summary; limit '+limit.toString()+'; search "'+name+`"; where first_release_date > ${Math.floor(new Date().getTime() / 1000)};`
            if(offset) body +=` offset ${offset};`
        } else if(form) {
            body = await this.constructQuery(form, limit, offset)
        } else {
            body = `fields cover, first_release_date,'+ 
            ' name, summary; where id = (${ids}); limit ${limit};`
            
        }
        
        return this.http.post<Game[]>(`${api_url}/games`, body).toPromise()
    }
}