import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShareModule } from "src/app/share/share.module";
import { KPIManagementComponent } from "./kpi-management.component";
import { RouterModule } from "@angular/router";
import { ListKPIComponent } from "./list-kpi/list-kpi.component";
import { EditKPIComponent } from "./edit-kpi/edit-kpi.component";
import { AddKPIComponent } from "./add-kpi/add-kpi.component";

const declarations = [
   KPIManagementComponent,
   ListKPIComponent,
   EditKPIComponent,
   AddKPIComponent
]
const imports = [
    CommonModule,
    ShareModule,
    RouterModule
]

@NgModule({
    declarations,
    imports,
    exports: [
        ...declarations,
        ...imports
    ],
})
export class KPIManagementModule{

}