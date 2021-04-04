import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import {creds} from "../constants"

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(this.authService.isAuthenticated()) {
            request = request.clone({
                setHeaders:{    //headers for API
                    
                    "Client-ID": `${creds.client_id}`,
                    Authorization: creds.api_token,
                    "Client-Token": `${this.authService.getToken()}`  //token client got after authentication
                }
            })
        }
        return next.handle(request)
    }
}