import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from './constant/route.constant';
import { HomeComponent } from './home/home.component';
import { DatasetManagementComponent } from './home/modules/dataset-management/dataset-management.component';
import { RuleManagementComponent } from './home/modules/rule-management/rule-management.component';
import { DeployedHistoryManagementComponent } from './home/modules/deployed-history-management/deployed-history-management.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RuleGuard } from './guards/rule.guard';
import { DatasetGuard } from './guards/dataset.guard';
import { EditDatasetComponent } from './home/modules/dataset-management/edit-dataset/edit-dataset.component';
import { ListDatasetComponent } from './home/modules/dataset-management/list-dataset/list-dataset.component';

const routes: Routes = [
  // { path: '', redirectTo: RouteConstant.LOGIN , pathMatch: "full" },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        pathMatch: "full",
        redirectTo: RouteConstant.CONFIG
      },
      {

        path: RouteConstant.CONFIG,
        // canActivate: [AuthGuard],
        children: [
          {
            path: '',
            pathMatch: "full",
            redirectTo: RouteConstant.DATASET

          },
          {
            path: RouteConstant.DATASET,
            component: DatasetManagementComponent,
            // canActivate: [DatasetGuard],
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: ListDatasetComponent
              },
              {
                path: 'list',   component: ListDatasetComponent,
              },
              {
                path: 'edit/:datasetId',
                component: EditDatasetComponent,
              }
            ],
          
          },
          {
            path: RouteConstant.RULE,
            component: RuleManagementComponent,
            // canActivate: [RuleGuard],
          },
          {
            path: RouteConstant.DEPLOYED_HISTORY,
            component: DeployedHistoryManagementComponent,
            // canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
  { path: RouteConstant.LOGIN, component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
