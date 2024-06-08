import { NgModule } from "@angular/core";
import { DatasetManagementComponent } from "./dataset-management.component";
import { ShareModule } from "src/app/share/share.module";
import { ListDatasetComponent } from "./list-dataset/list-dataset.component";
import { EditDatasetComponent } from "./edit-dataset/edit-dataset.component";
import { RouterModule } from "@angular/router";
import { AddDatasetValueComponent } from "./add-dataset-value/add-dataset-value.component";
import { AddDatasetComponent } from "./add-dataset/add-dataset.component";

@NgModule({
    declarations: [
        DatasetManagementComponent,
        ListDatasetComponent,
        EditDatasetComponent,
        AddDatasetValueComponent,
        AddDatasetComponent
    ],
    imports: [
        ShareModule,
        RouterModule
    ],
    exports: [
        DatasetManagementComponent, 
        ShareModule,
        ListDatasetComponent,
        EditDatasetComponent,
        RouterModule,
        AddDatasetValueComponent,
        AddDatasetComponent
    ]
})
export class DatasetManagementModule{

}