import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShareModule } from "src/app/share/share.module";
import { RouterModule } from "@angular/router";
import { ReportKPIComponent } from "./report-kpi.component";

const declarations = [
   ReportKPIComponent
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
export class ReportKPIModule{

}