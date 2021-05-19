import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { MessageService } from "../services/message.service";

const HTTP_ERROR_STATUS = {
    401: 'Unathourized',
    500: 'Internal server error'
}

@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private messageService: MessageService, private authService: AuthService, private router: Router) {}
   
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                this.handleHttpError(error)
                return throwError(new Error(error.error.message))
            })
        )
    }
    
    private async handleHttpError(errorRes: HttpErrorResponse) {
        const {url, error, status} = errorRes
        if(url && error && (status == 401 || status == 500)) {
            this.messageService.showMessage(HTTP_ERROR_STATUS[status])
            this.authService.logout()
            this.router.navigate(['/auth/login'])
            return
        } else if(url && error && status == 403) {
            this.authService.setToken(errorRes.headers.get('clienttoken'))
            return
        }
    }
}