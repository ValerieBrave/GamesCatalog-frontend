import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Company } from "../interfaces/company";
import { Cover } from "../interfaces/cover";

@Injectable({
    providedIn:'root'
})
export class CompanyService {
    constructor(private http: HttpClient){   }

    getCompanies(limit: number, offset?: number): Observable<Company[]> {
        let body = `fields name, description, developed, logo, start_date; where logo != null & start_date != null; sort start_date desc; limit ${limit};`
        if(offset) body += `offset ${offset};`
        return this.http.post<Company[]>('http://localhost:3000/companies', body)
    }
    getCompanyLogo(ids: number[], limit?: number): Observable<Cover[]> {
        let body = `fields url; where id = (${ids.toString()});`
        if(limit) body += `limit ${limit.toString()};`;
        return this.http.post<Cover[]>('http://localhost:3000/company_logos', body)
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

    getCompanyInfoByID(id: string): Observable<Company> {
        let body = `fields name, description, developed, published, start_date, logo; where id = ${id};`
        return this.http.post<Company>('http://localhost:3000/companies', body)
    }
}