import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { RouteConstant } from "src/app/constant/route.constant";

@Component({
    templateUrl: './list-kpi.component.html',
    styleUrls: ['./list-kpi.component.scss']
})
export class ListKPIComponent{

   constructor(private router: Router) {}
   navigateToAddKPI(){
     this.router.navigate([RouteConstant.KPI_MANAGEMENT, RouteConstant.ADD_KPI])
   }

   navigateToEditKPI() {
    this.router.navigate([RouteConstant.KPI_MANAGEMENT, RouteConstant.EDIT_KPI, '1'])
   }
}