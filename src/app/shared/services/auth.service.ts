import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {api_url, backend_url, user1, user_token} from "../constants"
import { User } from "../interfaces/user"
import {tap} from "rxjs/operators"

@Injectable({
    providedIn:'root'
})
export class AuthService {
    private token = null
    constructor(private http: HttpClient){   }

    login(user: User): Observable<{token: string, likes: number[]}> {
        return this.http.post<{token: string, likes: number[]}>(`${backend_url}/auth/login`, user)
        .pipe( tap( ({token, likes}) => {
            localStorage.setItem('liked', likes.toString())
            this.setToken(token)
        }))
    }
    public setToken(token: string) {
        this.token = token
        localStorage.setItem('auth-token', token)
    }
    public getToken(): string {
        if(this.token) return this.token
        return localStorage.getItem('auth-token')
    }
    public isAuthenticated(): boolean {
        return !!this.token || !!localStorage.getItem('auth-token')
    }
    public logout() {
        this.setToken(null)
        localStorage.clear()
    }

    register(user: User): Observable<HttpResponse<{message: string}>> {
        return this.http.post<{message: string}>(`${backend_url}/auth/register`, user, {observe: 'response'})
    }
}


