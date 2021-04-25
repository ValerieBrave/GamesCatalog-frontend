import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { Cover } from "../interfaces/cover";
import { Game } from "../interfaces/game";
import { FilterForm } from "../models/filter/form";
import { getRatingNumber } from "../models/filter/rating";

@Injectable({
    providedIn:'root'
})
export class GameService {
    constructor(private http: HttpClient){   }
    
    getGameCover(ids: number[]): Observable<Cover[]> {
        ids = ids.filter(e => {return e!= null})
        if(ids.length > 0)
            return this.http.post<Cover[]>(
            'http://localhost:3000/covers',
            'fields game, url; where id = ('+ids.toString()+'); limit '+ids.length.toString()+';')
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
        else return new Observable<Cover[]>()
    }

    private getPegiIdsByRating(rating: number): Promise<number[]> {
        return this.http.post<number[]>(
        'http://localhost:3000/age_ratings',
        `where category = 2 & rating = ${rating}; limit 100;`).toPromise()   
      }
    
    private async constructQuery(values: FilterForm, limit: number, offset? :number): Promise<string> {
        let basicBody = 'fields cover, first_release_date, name, rating, summary; sort first_release_date desc; where rating != null & aggregated_rating != null & first_release_date != null;'
        let add = ''
        let where_set = false
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
        basicBody+=add+`; limit ${limit}; `
        if(offset) basicBody += `offset ${offset};`
        return basicBody
    }

    async getGames(limit: number, name?: string, form?: FilterForm, offset?: number): Promise<Game[]> {
        let body = ''
        // searching by name
        if(name) {
            body = 'fields cover, first_release_date,'+ 
            ' name, rating, summary; limit '+limit.toString()+'; search "'+name+'"; where rating != null & aggregated_rating != null & first_release_date != null;'
            if(offset) body +=` offset ${offset};`
        }
        //searching with filter
        else if(form) {
            body = await this.constructQuery(form, limit, offset)
        }
        //no search
        else {
            body = 'fields cover, first_release_date,'+ 
            ' name, rating, summary; sort first_release_date desc; where rating != null & aggregated_rating != null & first_release_date != null; limit '+
            limit.toString() +';'
            if(offset) body += ` offset ${offset};`
        }
        
        return this.http.post<Game[]>('http://localhost:3000/games', body).toPromise()
    }
    
    public getGamesById(ids: number[], limit: number, offset?: number): Observable<Game[]> {
        if(!ids || !ids.length) return of(null)
        let search = []
        if(offset)  search = ids.slice(offset, offset+limit) 
        else  search = ids.slice(0, limit)
        if(search.length > 0) {
            let body = `fields cover, first_release_date,'+ 
            ' name, rating, summary; where rating != null & aggregated_rating != null & first_release_date != null; where id = (${search}); limit ${limit};`
            return this.http.post<Game[]>('http://localhost:3000/games', body)
        } else return of(null)
    }
}