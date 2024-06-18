import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
})
export class DateTimePickerComponent {
  fromDateTime: string = ''; // Biến lưu ngày/giờ từ
  toDateTime: string = '';   // Biến lưu ngày/giờ đến

  selectedFromDate: Date | null = null;
  selectedToDate: Date | null = null;

  fromToggle: boolean = false;
  toToggle: boolean = false;

  hours : string[] =  Array.from({ length: 24 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  minutes: string[] = Array.from({ length: 60 }, (_, i) => (i + 1).toString().padStart(2, '0'));;
  seconds: string[] =  Array.from({ length: 60 }, (_, i) => (i + 1).toString().padStart(2, '0'));;

  hourPick? : string;
  minutesPick?: string;
  secondPick? : string;

  toggleFromClick() {
    this.fromToggle = !this.fromToggle;
    this.toToggle = false;
  }

  toggleToClick() {
    this.toToggle = !this.toToggle;
    this.fromToggle = false;
  }
  _daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  _monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  currentToday: number = new Date().getDate();
  currentYear: number;
  currentMonth: number;
  daysOfMonth: number[] = [];
  daysOfPreviosMonth: number[] = [];
  daysOfNextMonth: number[] = [];

  @Input() dayPicked?: number;
  @Input() monthPicked?: number;
  @Input() yearPicked?: number;

  @Output() dayPickedChange = new EventEmitter<number>();
  @Output() monthPickedChange = new EventEmitter<number>();
  @Output() yearPickedChange = new EventEmitter<number>();

  constructor() {
    let now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');
const seconds = now.getSeconds().toString().padStart(2, '0');

    this.currentMonth = currentMonth;
    this.currentYear = currentYear;
    this.hourPick = hours;
    this.minutesPick = minutes;
    this.secondPick = seconds;
  }

  ngOnInit(): void {
    this.renderCalender();
  }

  renderCalender = () => {
    const ulElement = document.querySelector('.calender__day-in-month');
    if (!ulElement) {
      console.log('not tag');
      return;
    }
    let firstDayOfMonth = new Date(
      this.currentYear,
      this.currentMonth,
      1
    ).getDay(); // full day
    const lastDateOfMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();
    const lasDateOfLastMonth = new Date(
      this.currentYear,
      this.currentMonth,
      0
    ).getDate();
    //   console.log(lastDateOfMonth);
    //   console.log(firstDayOfMonth);
    //   console.log(lasDateOfLastMonth);
    let arrDaysPreMonth = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      arrDaysPreMonth[i] = lasDateOfLastMonth - i;
    }

    //  console.log(arrDaysPreMonth);
    this.daysOfPreviosMonth = arrDaysPreMonth.reverse();

    let arrTmp = [];
    for (let i = 0; i < lastDateOfMonth; i++) {
      arrTmp[i] = i + 1;
    }
    this.daysOfMonth = arrTmp;

    // Tạo mảng chứa các ngày của tháng tiếp theo
    const firstDayOfNextMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      1
    ).getDay();
    let arrDaysNextMonth = [];
    for (let i = 0; i < 7 - firstDayOfNextMonth; i++) {
      arrDaysNextMonth[i] = i + 1;
    }
    this.daysOfNextMonth = arrDaysNextMonth;
  };

  onNextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear = this.currentYear + 1;
      return;
    }
    this.currentMonth = this.currentMonth + 1;
    //  console.log(this.currentMonth);
    this.renderCalender();
  }
  onPrevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear = this.currentYear - 1;
      return;
    }
    this.currentMonth = this.currentMonth - 1;
    // console.log(this.currentMonth);
    this.renderCalender();
  }

  isToday(day: number): boolean {
    const date = new Date();
    if (
      day === date.getDate() &&
      this.currentMonth === new Date().getMonth() &&
      this.currentYear === new Date().getFullYear()
    ) {
      return true;
    }

    return false;
  }

  setDatePicker(valueDay: number, monthOffset: number) {
    // check date >= now
    const today = new Date();

    const datePick = new Date(this.currentYear, this.currentMonth + monthOffset, valueDay);
    console.log(datePick);

    if (this.fromToggle) {
      if (this.selectedToDate && datePick > new Date(this.selectedToDate)) {
        console.error('From date cannot be after To date');
        return;
      }
      this.selectedFromDate = datePick;
      // this.fromToggle = false;
      // this.toToggle = true;
    } else if (this.toToggle) {
      if (this.selectedFromDate && datePick < new Date(this.selectedFromDate)) {
        console.error('To date cannot be before From date');
        return;
      }
      this.selectedToDate = datePick;
     // this.toToggle = false;
    }

    this.dayPicked = valueDay;
    this.monthPicked = this.currentMonth + monthOffset;
    this.yearPicked = this.currentYear;
    // console.log(this.getDatePickerToString());
    // this.dayPickedChange.emit(valueDay);
    // this.monthPickedChange.emit(this.monthPicked);
    // this.yearPickedChange.emit(this.yearPicked);

    // if(this.fromToggle === true) {
    //      this.fromDateTime = `${valueDay}/${this.currentMonth}/${this.currentYear}`;
    // }

    // if(this.toToggle === true) {
    //      this.toDateTime = `${valueDay}/${this.currentMonth}/${this.currentYear}`

    // }
  
  }

  isDateSelected(day: number, monthOffset: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth + monthOffset, day);
    return this.selectedFromDate?.getTime() === date.getTime() || this.selectedToDate?.getTime() === date.getTime();
  }

  isDateInRange(day: number, monthOffset: number): boolean {
    if(!this.selectedFromDate || !this.selectedToDate) return false;
    const date = new Date(this.currentYear, this.currentMonth + monthOffset, day);
    return this.selectedFromDate && this.selectedToDate && date >= this.selectedFromDate && date <= this.selectedToDate;
  }

  isFromDate(day: number, monthOffset: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth + monthOffset, day);
    return this.selectedFromDate?.getTime() === date.getTime();
  }

  getDatePickerToString(date: number, month: number, year: number): string {
    let dateToString = '';

    dateToString = date + ' ' + this._monthNames[month] + ' ' + year;

    return dateToString;
  }

  clearDatePicked() {
    this.dayPicked = undefined;
    this.monthPicked = undefined;
    this.yearPicked = undefined;
    this.hourPick = undefined;
    this.minutesPick = undefined;
    this.secondPick = undefined;
  }
  

  applyDateTime(){
    console.log(this.selectedFromDate);
    console.log(this.selectedToDate)
    const from = `${this.selectedFromDate?.toLocaleDateString()} ${this.hourPick}:${this.minutesPick}:${this.secondPick}`;
    const to = `${this.selectedToDate?.toLocaleDateString()} ${this.hourPick}:${this.minutesPick}:${this.secondPick}`;

    if(this.fromToggle) {
        this.fromDateTime= from

    }

    if(this.toToggle) {
          this.toDateTime = to
    }

    this.clearDatePicked();

  }

  cancelDateTime(){

  }
}
