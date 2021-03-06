import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  public registerForm: FormGroup
  constructor() { }

  ngOnInit(): void {
    
    this.registerForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email : new FormControl(null, [Validators.required, Validators.email]),
      password : new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  public onRegister(): void{}

}
