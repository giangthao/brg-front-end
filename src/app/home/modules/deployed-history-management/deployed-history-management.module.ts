import { NgModule } from "@angular/core";
import { DeployedHistoryManagementComponent } from "./deployed-history-management.component";
import { ShareModule } from "src/app/share/share.module";



@NgModule({
    declarations: [
        DeployedHistoryManagementComponent
    ],
    imports: [
        ShareModule
    ],
    exports: [
        DeployedHistoryManagementComponent,
        ShareModule
    ]
})
export class DeployedHistoryModule{

}