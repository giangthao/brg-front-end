import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from './constant/route.constant';
import { HomeComponent } from './home/home.component';
import { DatasetManagementComponent } from './home/modules/dataset-management/dataset-management.component';
import { RuleManagementComponent } from './home/modules/rule-management/rule-management.component';
import { DeployedHistoryManagementComponent } from './home/modules/deployed-history-management/deployed-history-management.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  // { path: '', redirectTo: RouteConstant.LOGIN , pathMatch: "full" },
  {path: '', component: HomeComponent , children: [
    { path: RouteConstant.CONFIG,  canActivate: [], children: [
      {path: RouteConstant.DATASET, component: DatasetManagementComponent},
      {path: RouteConstant.RULE, component: RuleManagementComponent},
      {path: RouteConstant.DEPLOYED_HISTORY, component: DeployedHistoryManagementComponent}
  ] },

  ]},
  {path: RouteConstant.LOGIN, component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
