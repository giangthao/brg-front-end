import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShareModule } from './share/share.module';
import { HomeModule } from './home/home.module';
import { DatasetManagementModule } from './home/modules/dataset-management/dataset-management.module';
import { RuleManagementModule } from './home/modules/rule-management/rule-management.module';
import { DeployedHistoryModule } from './home/modules/deployed-history-management/deployed-history-management.module';
import { LoginModule } from './login/login.module';
import { KPIManagementModule } from './home/modules/kpi-management/kpi-management.module';
import { ReportKPIModule } from './home/modules/report-kpi/report-kpi.module';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createTranslateLoader } from './translate-loader';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatatableModule } from './home/modules/datatable/datatable.module';
import { MapOfflineModule } from './home/modules/map-offline/map-offline.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ShareModule,
    HomeModule,
    DatasetManagementModule,
    RuleManagementModule,
    DeployedHistoryModule,
    LoginModule,
    KPIManagementModule,
    ReportKPIModule,
    HttpClientModule,
    NgxDatatableModule,
    DatatableModule,
    MapOfflineModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader, // Reference the factory function correctly
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    BrowserModule,
    AppRoutingModule,
    ShareModule,
    HomeModule,
    DatasetManagementModule,
    RuleManagementModule,
    DeployedHistoryModule,
    LoginModule,
    ReportKPIModule,
    NgxDatatableModule,
    DatatableModule,
    MapOfflineModule,
  ],
})
export class AppModule {}
