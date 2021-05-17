import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  public registerForm: FormGroup
  constructor(private authService: AuthService, private snack: MessageService, private router: Router) { }

  ngOnInit(): void {
    
    this.registerForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email : new FormControl(null, [Validators.required, Validators.email]),
      password : new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  public onRegister(): void{
    this.authService.register(this.registerForm.value)
    .subscribe(resp => {
      this.snack.showMessage(resp.body.message)
      this.router.navigate(['/auth/login'], { queryParams: {'registered': true }})
    })
  }

}
