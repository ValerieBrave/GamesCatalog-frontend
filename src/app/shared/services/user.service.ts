import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { backend_url } from "../constants";
import { Profile } from "../interfaces/profile";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn:'root'
})
export class UserService {
    constructor(private http: HttpClient, private authService: AuthService){   }

    getLikes(): Observable<HttpResponse<{likes: number[]}>> {
        return this.http.get<{likes: number[]}>(`${backend_url}/user/profile/liked`, {observe:'response'})
        .pipe( tap(resp => {
            this.authService.setToken(resp.headers.get('clienttoken'))
        }))
    }

    like(id: number): Observable<HttpResponse<{liked: boolean}>> {
        return this.http.post<{liked: boolean}>(`${backend_url}/game/like/${id}`, null, {observe: 'response'})
        .pipe( tap(resp => {
            this.authService.setToken(resp.headers.get('clienttoken'))
        }))
    }

    getProfile(): Observable<HttpResponse<Profile>> {
        return this.http.get<Profile>(`${backend_url}/user/profile`, {observe:'response'})
        .pipe( tap(resp => {
            this.authService.setToken(resp.headers.get('clienttoken'))
        }))
    }

    sendAvatar(file: FormData): Observable<HttpResponse<{message: string, url: string}>> {
        return this.http.post<{message:string, url: string}>(`${backend_url}/user/profile/avatar`, 
        file, { observe: 'response'})
        .pipe( tap(resp => {
            this.authService.setToken(resp.headers.get('clienttoken'))
        }))
    }

    updateInfo(name: string, birthday: number): Observable<HttpResponse<{message: string}>> {
        //make MySQL date format string 
        let offset = new Date().getTimezoneOffset()*60  //my timezone offset in seconds
        let epoch_dob = Date.parse(birthday.toString())/1000  //epoch time with timezone
        epoch_dob -= offset // gmt
        let dob = new Date(epoch_dob*1000)
        return this.http.put<{message: string}>(`${backend_url}/user/profile/info`, 
        {newName: name, newBD: `${dob.toISOString().slice(0, 10)}`},
        {observe: 'response'})
        .pipe( tap(resp => {
            this.authService.setToken(resp.headers.get('clienttoken'))
        }))
    }

    updatePassword(oldPass: string, newPass: string, newPassConfirm: string): Observable<HttpResponse<{message: string}>> {
        return this.http.put<{message: string}>(`${backend_url}/user/profile/password`, 
        {oldPass: oldPass, newPass: newPass, newPassConfirm: newPassConfirm}, {observe: 'response'})
        .pipe( tap(resp => {
            this.authService.setToken(resp.headers.get('clienttoken'))
        }))
    }
}