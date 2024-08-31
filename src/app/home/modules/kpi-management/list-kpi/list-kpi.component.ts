import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant } from 'src/app/constant/route.constant';

@Component({
  templateUrl: './list-kpi.component.html',
  styleUrls: ['./list-kpi.component.scss'],
})
export class ListKPIComponent implements AfterViewInit, OnInit {
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

  ngOnInit(): void {
    this.fetchData().then((data: number) => {
      this.animateNumber('number', 0, data, 500); // Ví dụ: từ 0 đến giá trị data trong 2000ms
    });
  }

  ngAfterViewInit() {
    //this.animateNumber('number', 0, 12345, 2000); // Example animation
  }

  animateNumber(elementId: string, start: number, end: number, duration: number) {
    const element = document.getElementById(elementId);
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is between 0 and 1
      const value = Math.round(start + (end - start) * progress);
      if(element) {
        element.textContent = value.toString();
      }
      else{
        return;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }


  // Giả lập hàm gọi API
  fetchData(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fakeData = 12345; // Giá trị giả lập trả về từ API
        resolve(fakeData);
      }, 2000); // Giả lập thời gian chờ 2 giây
    });
  }
  
}
