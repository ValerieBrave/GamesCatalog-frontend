import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MessageService } from '../shared/services/message.service'


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  constructor(private authService: AuthService,
              private snackBar: MessageService,
              private router: Router) { }

  ngOnInit(): void {
  }


}
