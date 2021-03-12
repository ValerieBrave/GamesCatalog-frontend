import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Rating } from "../models/filter/rating";

@Injectable({
    providedIn:'root'
})
export class FillFilterService {

    constructor(private http: HttpClient){

    }

    getRatings(): Observable<[{id: number, rating: number}]> {
        // const myHeaders = new HttpHeaders()
        // myHeaders.set('Client-ID', '1n5qiztc3254ful7r5h1lvkxeyzqgh')
        // myHeaders.set('Authorization', 'Bearer 82hnvv44xw3pfidzc1qcvgp5gymtzs')
        // myHeaders.set('test', 'test headers setting')
        const headerDict = {
            'Client-ID': '1n5qiztc3254ful7r5h1lvkxeyzqgh',
            'Authorization': 'Bearer 82hnvv44xw3pfidzc1qcvgp5gymtzs',
            'test': 'test headers setting'
          }
          
          const requestOptions = {                                                                                                                                                                                 
            headers: new Headers(headerDict), 
          };

        return this.http.post<[{id: number, rating: number}]>
        ('https://1zfyytvbzc.execute-api.us-west-2.amazonaws.com/production/v4/age_ratings', 
        'fields  rating; where category = 2;', {headers: headerDict})
    }
}