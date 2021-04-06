import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router";
import { ExplorePageComponent } from "./explore-page/explore-page.component";
import { GameinfoPageComponent } from "./gameinfo-page/gameinfo-page.component";
import { GamesPageComponent } from "./games-page/games-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { AuthGuard } from "./shared/guards/auth.guard";
import { AuthLayoutComponent } from "./shared/layouts/auth-layout/auth-layout.component";
import { ExploreLayoutComponent } from "./shared/layouts/explore-layout/explore-layout.component";
import { UserPageComponent } from "./user-page/user-page.component";


const routes: Routes = [
    {path: 'auth', component: AuthLayoutComponent, children: [
        {path:'login', component: LoginPageComponent},
        {path:'register', component: RegisterPageComponent}
    ]},
    {
        path:'explore', component: ExploreLayoutComponent, canActivate:[AuthGuard], children: [
           {path: '', component: ExplorePageComponent},
           {path: 'game/:id', component: GameinfoPageComponent},
           {path:'games', component: GamesPageComponent},
           {path:'user/:id', component: UserPageComponent}
        ]
    }
]

@NgModule({
    imports:[
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}