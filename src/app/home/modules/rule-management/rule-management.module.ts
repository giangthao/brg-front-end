import { NgModule } from "@angular/core";
import { RuleManagementComponent } from "./rule-management.component";
import { ShareModule } from "src/app/share/share.module";



@NgModule({
    declarations: [
        RuleManagementComponent
    ],
    imports: [
        ShareModule
    ],
    exports: [
        RuleManagementComponent,
        ShareModule
    ]
})
export class RuleManagementModule{

}