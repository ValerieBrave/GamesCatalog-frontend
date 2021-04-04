import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup
  private aSub: Subscription
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
        // now you can log into system with your credentials
      } else if(params['accessDenied']) {
        this.snackBar.ShowMessage('Authenticate first!')
      }
    })
  }
  ngOnDestroy(): void {
    if(this.aSub) this.aSub.unsubscribe()
  }

  public onLogin(){
    
    this.loginForm.disable()
    this.aSub = this.authService.login(this.loginForm.value).subscribe(
      (data) => {
        if(data['message'] != undefined) {
          this.snackBar.ShowMessage(data['message'])
          this.loginForm.enable()
        }
        else {
          this.router.navigate(['/explore'])
          this.snackBar.ShowMessage('You logged in!')
        }
      },
      (err) => {this.loginForm.enable()}
    )
  }
}
