import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from "../interceptors/auth.interceptor";
import { ClickOutsideDirective } from "./directives/click-outside.directive";
import { DateTimePickerComponent } from "./components/date-time-picker/date-time-picker.component";
import { SelectComponent } from "./components/select/select.component";
import { DropDownMenuComponent } from "./components/drop-down-menu/drop-down-menu.component";
import { KPIFormComponent } from "./components/kpi-form/kpi-form.component";

@NgModule({
    declarations: [
      SelectComponent,
      ClickOutsideDirective,
      DateTimePickerComponent,
      DropDownMenuComponent,
      KPIFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
       
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        ClickOutsideDirective,
        DateTimePickerComponent,
        DropDownMenuComponent,
        KPIFormComponent,
        SelectComponent
    ]
})
export class ShareModule{

}


