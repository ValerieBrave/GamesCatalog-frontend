import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn:'root'
})
export class MessageService {
    constructor(private snack: MatSnackBar) {}
    public ShowMessage(message: string): void {
        this.snack.open(message, '', {duration: 4000})
    }
}