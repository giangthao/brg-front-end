import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from "../interceptors/auth.interceptor";
import { ClickOutsideDirective } from "./directives/click-outside.directive";
import { DateTimePickerComponent } from "./components/date-time-picker/date-time-picker.component";

@NgModule({
    declarations: [
       
      ClickOutsideDirective,
      DateTimePickerComponent
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
        DateTimePickerComponent
    ]
})
export class ShareModule{

}


