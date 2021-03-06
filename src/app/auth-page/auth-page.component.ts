import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {

  loginForm = new FormGroup({
    email : new FormControl(''),
    password : new FormControl('')
  })

  registerForm = new FormGroup({
    name: new FormControl(''),
    email:new FormControl(''),
    password: new FormControl('')
  })
  
  constructor() { }

  ngOnInit(): void {
  }

}
