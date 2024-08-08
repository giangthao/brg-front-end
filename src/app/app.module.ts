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


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ShareModule,
    HomeModule,
    DatasetManagementModule,
    RuleManagementModule,
    DeployedHistoryModule,
    LoginModule,
    KPIManagementModule
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
   
    
  ]
})
export class AppModule { }
