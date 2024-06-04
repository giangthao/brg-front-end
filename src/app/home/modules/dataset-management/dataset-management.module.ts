import { NgModule } from "@angular/core";
import { DatasetManagementComponent } from "./dataset-management.component";
import { ShareModule } from "src/app/share/share.module";
import { UploadFileComponent } from "./upload-file/upload-file.component";
import { EditDatasetComponent } from "./edit-dataset/edit-dataset.component";
import { RouterModule } from "@angular/router";



@NgModule({
    declarations: [
        DatasetManagementComponent,
        UploadFileComponent,
        EditDatasetComponent
    ],
    imports: [
        ShareModule,
        RouterModule
    ],
    exports: [
        DatasetManagementComponent, 
        ShareModule,
        UploadFileComponent,
        EditDatasetComponent,
        RouterModule
    ]
})
export class DatasetManagementModule{

}