import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Profile } from '../shared/interfaces/profile';
import { User } from '../shared/interfaces/user';
import { AuthService } from '../shared/services/auth.service';
import { MessageService } from '../shared/services/message.service'
import { UserService } from '../shared/services/user.service';
import { passwordsMatch } from '../shared/validators/passwords-match-validator';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit, AfterViewInit {
  private fileData: File = null
  public previewUrl: any = null
  public userInfo: Profile

  public avatarForm: FormGroup
  public infoForm: FormGroup
  public passwordForm: FormGroup

  constructor(private userService: UserService,
              private authService: AuthService,
              private snackBar: MessageService,
              private router: Router,
              private el: ElementRef) { }


  ngOnInit(): void {
    this.avatarForm = new FormGroup({
      avatar: new FormControl()
    })
    this.infoForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      birthday: new FormControl(null, [Validators.required])
    })
    this.passwordForm = new FormGroup({
      oldPass: new FormControl(null,[Validators.required, Validators.minLength(6)]),
      newPass: new FormControl(null,[Validators.required, Validators.minLength(6)]),
      newPassConfirm: new FormControl(null,[Validators.required, Validators.minLength(6)])
    }, {validators: passwordsMatch})
  }

  ngAfterViewInit(): void {
    localStorage.setItem('auth-token', this.authService.getToken())
    this.userService.getProfile().subscribe(resp => {
      this.userInfo = resp.body
      if(this.userInfo.birthday) {
        let date_parts = this.userInfo?.birthday.toString().split('-')
        this.infoForm.setValue({name: this.userInfo.name, birthday: new Date(parseInt(date_parts[0]), parseInt(date_parts[1])-1, parseInt(date_parts[2]))})
      }
    }, err => {
      this.snackBar.showMessage(err.message)
    })
  }

  public avatarSelected(): void {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#avatar');
    let formData = new FormData();
    formData.append('avatar', inputEl.files.item(0));
    this.userService.sendAvatar(formData)
    .subscribe(resp => {
      this.userInfo.avatar = resp.body.url
      this.snackBar.showMessage(resp.body.message)
    }, err => {
      this.snackBar.showMessage(err.message)
    })
  }

  public editInfo(): void {
    this.userService.updateInfo(this.infoForm.get('name').value, this.infoForm.get('birthday').value)
    .subscribe(resp => {
      this.userInfo.name =this.infoForm.get('name').value
      this.userInfo.birthday = this.infoForm.get('birthday').value
      this.snackBar.showMessage(resp.body.message)
    }, err => {
      this.snackBar.showMessage(err.message)
    })
  }

  public editPassword(): void {
    this.userService.updatePassword(this.passwordForm.get('oldPass').value,
                                this.passwordForm.get('newPass').value,
                                this.passwordForm.get('newPassConfirm').value)
    .subscribe(resp => {
      this.snackBar.showMessage(resp.body.message)
    }, err => {
      this.snackBar.showMessage(err.message)
    })
  }
}
