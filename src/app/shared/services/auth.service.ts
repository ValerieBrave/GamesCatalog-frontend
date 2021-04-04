import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {user1, user_token} from "../constants"
import { User } from "../interfaces/user"
import {tap} from "rxjs/operators"

@Injectable({
    providedIn:'root'
})
export class AuthService {
    private token = null
    constructor(private http: HttpClient){   }

    login(user: User): Observable<{}> {
        //returning token as if was returned from backend or error message object
        let rc
        if(user.email != user1.email)
            rc = new Observable<{message: string}>(subscriber => subscriber.next({message: 'User not found'}))
        else if(user.password != user1.password)
            rc = new Observable<{message: string}>(subscriber => subscriber.next({message: 'Password is not correct'}))
        else 
            rc = new Observable<{token: string}>(subscriber => subscriber.next(user_token))
            .pipe(
                tap(
                    ({token}) => {
                        localStorage.setItem('auth-token', token)
                        this.setToken(token)
                    }
                )
            )
        return rc
    }
    private setToken(token: string) {
        this.token = token
    }
    public getToken(): string {
        return this.token
    }
    public isAuthenticated(): boolean {
        return !!this.token || !!localStorage.getItem('auth-token')
    }
    public logout() {
        this.setToken(null)
        localStorage.clear()
    }

    register() {}
}


