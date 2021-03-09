import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router";
import { AuthPageComponent } from "./auth-page/auth-page.component";
import { ExploreLayoutComponent } from "./shared/layouts/explore-layout/explore-layout.component";


const routes: Routes = [
    {path: 'auth', component: AuthPageComponent},
    {
        path:'', component: ExploreLayoutComponent, children: [
            
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