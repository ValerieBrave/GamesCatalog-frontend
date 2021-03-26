import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class FilterService {

  constructor(private http: HttpClient){   }

  public constructQuery(values: any, limit: number, offset? :number): string {
      let rc = 'fields cover, first_release_date, name, rating, summary; sort first_release_date desc; '
      let add = ''
      let where_set = false
      let need_and = false
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
          add+= `where game_mods = (${values['mode']}) `
          where_set = true
        }
      }
      //todo
      //дописать для рейтинга, даты выпуска и пеги рейтинга
      // дату конвертим в ютиси, пеги рейтинг собираем через запятую
      // рейтинг ищем в [r-1; r+1]
      rc+=add+';'
      return rc
  }
}