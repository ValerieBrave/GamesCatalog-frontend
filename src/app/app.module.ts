import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExploreLayoutComponent } from './shared/layouts/explore-layout/explore-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExplorePageComponent } from './explore-page/explore-page.component';
import { GamesPageComponent } from './games-page/games-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { StringList } from './shared/pipes/string-list.pipe'
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { GameinfoPageComponent } from './gameinfo-page/gameinfo-page.component';
import { GameCardComponent } from './game-card/game-card.component';
import { CompaniesPageComponent } from './companies-page/companies-page.component';
import { CompanyCardComponent } from './company-card/company-card.component';
import { CompanyinfoPageComponent } from './companyinfo-page/companyinfo-page.component';



@NgModule({
  declarations: [
    AppComponent,
    ExploreLayoutComponent,
    ExplorePageComponent,
    GamesPageComponent,
    UserPageComponent,
    AuthLayoutComponent,
    LoginPageComponent,
    RegisterPageComponent,
    GameinfoPageComponent,
    StringList,
    GameCardComponent,
    CompaniesPageComponent,
    CompanyCardComponent,
    CompanyinfoPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatSliderModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
