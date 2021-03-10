import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router";
import { AuthPageComponent } from "./auth-page/auth-page.component";
import { ExplorePageComponent } from "./explore-page/explore-page.component";
import { GamesPageComponent } from "./games-page/games-page.component";
import { ExploreLayoutComponent } from "./shared/layouts/explore-layout/explore-layout.component";
import { UserPageComponent } from "./user-page/user-page.component";


const routes: Routes = [
    {path: 'auth', component: AuthPageComponent},
    {
        path:'', component: ExploreLayoutComponent, children: [
           {path: '', component: ExplorePageComponent},
           {path: 'explore', component: ExplorePageComponent},
           {path:'games', component: GamesPageComponent}
        ]
    },
    {path:'user/:id', component: UserPageComponent}
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