import { NgModule } from "@angular/core";
import { DatasetManagementComponent } from "./dataset-management.component";
import { ShareModule } from "src/app/share/share.module";



@NgModule({
    declarations: [
        DatasetManagementComponent
    ],
    imports: [
        ShareModule
    ],
    exports: [
        DatasetManagementComponent, 
        ShareModule
    ]
})
export class DatasetManagementModule{

}