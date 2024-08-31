import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstant } from 'src/app/constant/route.constant';
import { NumberAnimationService } from 'src/app/services/number-animatin-service';

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
  ];

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
  ];

  elementId = 'number';
  startValue: number = 0;
  endValue: number = 12345;

  constructor(
    private router: Router,
    private numberAnimationService: NumberAnimationService
  ) {}
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
    // this.fetchData().then((data: number) => {
    //   this.animateNumber('number', 0, data, 500); // Ví dụ: từ 0 đến giá trị data trong 2000ms
    // });
   
  }

  ngAfterViewInit() {
    //this.animateNumber('number', 0, 12345, 2000); // Example animation
  }

  animateNumber(
    elementId: string,
    start: number,
    end: number,
    duration: number
  ) {
    const element = document.getElementById(elementId);
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is between 0 and 1
      const value = Math.round(start + (end - start) * progress);
      if (element) {
        element.textContent = value.toString();
      } else {
        return;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Giả lập gọi API
  fetchData() {
    // Gọi API thực tế ở đây
    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        const success = true; // Thay đổi thành false để thử lỗi
        if (success) {
          resolve(this.endValue); // Giá trị từ API
        } else {
          reject('Error fetching data');
        }
      }, 2000); // Giả lập thời gian chờ 2 giây
    });
  }

  // Gọi API và dừng hoạt hình khi có phản hồi
  callApi() {
    this.numberAnimationService.animateNumber(
      this.elementId,
      this.startValue,
      this.endValue,
      10 // Tốc độ tăng (có thể điều chỉnh)
    );
    this.fetchData()
      .then((data) => {
        // Cập nhật giá trị cuối cùng
        const element = document.getElementById(this.elementId);
        if (element) {
          element.textContent = data.toString();
        }
        // Dừng hoạt hình nếu còn
        this.numberAnimationService.stopAnimation();
      })
      .catch((error) => {
        console.error(error);
        // Xử lý lỗi nếu cần
        this.numberAnimationService.stopAnimation();
      });
  }

  ngOnDestroy() {
    // Đảm bảo dừng hoạt hình khi component bị hủy
    this.numberAnimationService.stopAnimation();
  }
}
