import { Component } from '@angular/core';
import { USERS } from './custom-select.default';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent {
  formGroup: FormGroup;
  users: any[] = USERS;

  constructor() {
    this.formGroup = new FormGroup({
      user: new FormControl([]),
    });
  }

  getLabelByValue(value: string): string {
    const found = this.users.find((u) => u.value === value);
    return found ? found.label : value;
  }
}
