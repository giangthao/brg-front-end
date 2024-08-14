import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { RouteConstant } from "src/app/constant/route.constant";

@Component({
    templateUrl: './list-kpi.component.html',
    styleUrls: ['./list-kpi.component.scss']
})
export class ListKPIComponent{

  dataTable = [
    {
      name: 'Name 1',
      type: 'Type',
      category: 'Category'
    },
    {
      name: 'Name 1',
      type: 'Type',
      category: 'Category'
    },
    {
      name: 'Name 1',
      type: 'Type',
      category: 'Category'
    }
  ]

   constructor(private router: Router) {}
   navigateToAddKPI(){
     this.router.navigate([RouteConstant.KPI_MANAGEMENT, RouteConstant.ADD_KPI])
   }

   navigateToEditKPI() {
    this.router.navigate([RouteConstant.KPI_MANAGEMENT, RouteConstant.EDIT_KPI, '1'])
   }
}