import { NgModule } from "@angular/core";
import { ShareModule } from "../share/share.module";
import { HomeComponent } from "./home.component";
import { RouterModule } from "@angular/router";


@NgModule({
    declarations: [
        HomeComponent

    ],
    imports: [
        ShareModule,
        RouterModule

    ],
    exports: [
        ShareModule,
        HomeComponent,
        RouterModule

    ]
})
export class HomeModule{

}