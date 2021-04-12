import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'app-explore-layout',
  templateUrl: './explore-layout.component.html',
  styleUrls: ['./explore-layout.component.scss']
})
export class ExploreLayoutComponent implements OnInit, AfterViewInit {
  public userID: number = 4
  constructor(private authService: AuthService,
              private snackBar: MessageService,
              private router: Router) { }
  ngAfterViewInit(): void { }
  ngOnInit(): void { }
  public logout(): void {
    this.authService.logout()
    this.snackBar.ShowMessage('You logged out!')
    this.router.navigate(['/auth/login'])
  }
}
