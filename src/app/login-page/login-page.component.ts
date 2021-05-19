import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { MessageService } from '../shared/services/message.service';
import { user1 } from '../shared/constants'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup
  private subscription: Subscription
  constructor(private authService: AuthService,
              private snackBar: MessageService,
              private router: Router,
              private route: ActivatedRoute) { }
  

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email : new FormControl(null, [Validators.required, Validators.email]),
      password : new FormControl(null, [Validators.required, Validators.minLength(6)]) 
    })
    this.route.queryParams.subscribe((params: Params) => {
      if(params['registered']) {
        this.snackBar.showMessage('You can login now with your credentials')
      } else if(params['accessDenied']) {
        this.snackBar.showMessage('Authenticate first!')
      }
    })
  }
  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe()
  }

  public onLogin(){
    
    this.loginForm.disable()
    this.subscription = this.authService.login(this.loginForm.value).subscribe(
      (data) => {
        if(data['message'] != undefined) {
          this.snackBar.showMessage(data['message'])
          this.loginForm.enable()
        }
        else {
          this.router.navigate(['/explore'])
          this.snackBar.showMessage('You logged in!')
        }
      },
      (err) => {
        this.snackBar.showMessage(err.message);
        this.loginForm.enable()
      }
    )
  }
}
