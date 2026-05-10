import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from './constant/route.constant';
import { MapOfflineComponent } from './home/modules/map-offline/map-offline.component';

const routes: Routes = [
  { path: '', redirectTo: RouteConstant.MAP_OFFLINE, pathMatch: 'full' },
  {
    path: RouteConstant.MAP_OFFLINE,
    component: MapOfflineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
