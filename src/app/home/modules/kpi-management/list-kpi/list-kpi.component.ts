import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant } from 'src/app/constant/route.constant';

@Component({
  templateUrl: './list-kpi.component.html',
  styleUrls: ['./list-kpi.component.scss'],
})
export class ListKPIComponent {
  dataTable = [
    {
      name: 'Name 143434534534534545435435435435345345345345435345435345345345',
      type: 'Type',
      category: 'Category',
    },
    {
      name: 'Name 1',
      type: 'Type',
      category: 'Category',
    },
    {
      name: 'Name 1434445435bbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      type: 'Type',
      category: 'Category',
    },
  ];

  showLoading = false;

  catchingData = [
    {
      country: 'Chế độ thủ công - Tìm thấy địa điểm - Lấy được IMEI',
      litres: 545,
    },
    {
      country: 'Chế độ thủ công - Tìm thấy địa điểm - Không lấy được IMEI',
      litres: 344,
    },
    {
      country: 'Chế độ thủ công - Không tìm thấy địa điểm - Lấy được IMEI',
      litres: 400,
    },
    {
      country: 'Chế độ tự động - Tìm thấy địa điểm - Lấy được IMEI',
      litres: 200,
    },
    {
      country: 'Chế độ tự động - Tìm thấy địa điểm - Không lấy được IMEI',
      litres: 111,
    },
    {
      country: 'Chế độ tự động - Không tìm thấy địa điểm - Lấy được IMEI',
      litres: 700,
    },
  ]

  locateData = [
    {
      country: 'Chế độ thủ công - Tìm thấy địa điểm - Lấy được IMEI',
      litres: 0,
    },
    {
      country: 'Chế độ thủ công - Tìm thấy địa điểm - Không lấy được IMEI',
      litres: 0,
    },
    {
      country: 'Chế độ thủ công - Không tìm thấy địa điểm - Lấy được IMEI',
      litres: 0,
    },
    {
      country: 'Chế độ tự động - Tìm thấy địa điểm - Lấy được IMEI',
      litres: 0,
    },
    {
      country: 'Chế độ tự động - Tìm thấy địa điểm - Không lấy được IMEI',
      litres: 0,
    },
    {
      country: 'Chế độ tự động - Không tìm thấy địa điểm - Lấy được IMEI',
      litres: 0,
    },
  ]

  constructor(private router: Router) {}
  navigateToAddKPI() {
    this.router.navigate([RouteConstant.KPI_MANAGEMENT, RouteConstant.ADD_KPI]);
  }

  navigateToEditKPI() {
    this.router.navigate([
      RouteConstant.KPI_MANAGEMENT,
      RouteConstant.EDIT_KPI,
      '1',
    ]);
  }

  toggleLoading() {
    this.showLoading = !this.showLoading;
  }

  
}
