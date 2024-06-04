import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Dataset } from 'src/app/models/dataset';
import { DatasetService } from 'src/app/services/dataset.service';
import { Router } from '@angular/router';
import { RouteConstant } from 'src/app/constant/route.constant';


@Component({
  selector: 'app-dataset-mamagement',
  templateUrl: './dataset-management.component.html',
  styleUrls: ['./dataset-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatasetManagementComponent implements OnInit {
  listDataset!: Dataset[];

  constructor(private datasetService: DatasetService, private router: Router) {}

  ngOnInit(): void {
    // this.datasetService.getDataset().subscribe({
    //   next: (response: any) => {
    //     console.log(response);
    //   },
    //   complete: () => {},
    //   error: (error: any) => {
    //     console.log(error);
    //     //this.router.navigate([RouteConstant.LOGIN])
    //   },
    // });
  }
}
