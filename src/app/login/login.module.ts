import { NgModule } from "@angular/core";
import { ShareModule } from "../share/share.module";
import { LoginComponent } from "./login.component";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
    declarations: [
        LoginComponent

    ],
    imports: [
        ShareModule,
       

    ],
    exports: [
        ShareModule, 
        LoginComponent

    ]
})

export class LoginModule{

}