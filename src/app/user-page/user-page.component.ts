import { HttpClient } from '@angular/common/http';
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
  private fileData: File = null
  public previewUrl: any = null
  constructor(private http: HttpClient,
              private authService: AuthService,
              private snackBar: MessageService,
              private router: Router) { }

  ngOnInit(): void {
  }

  public avatarSelected(event): void {
    this.fileData = <File>event.target.files[0]
    this.avatarPreview()
  }

  private avatarPreview() :void {
    let mimeType = this.fileData.type
    if (mimeType.match(/image\/*/)) {
      let reader = new FileReader()    
      reader.readAsDataURL(this.fileData)
      reader.onload = (_event) => { 
        this.previewUrl = reader.result
      }
    }
  }
}
