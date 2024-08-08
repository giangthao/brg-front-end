import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { RouteConstant } from 'src/app/constant/route.constant';
import { KPIManagementService } from 'src/app/services/kpi-management.service';

@Component({
  selector: 'app-kpi-form',
  templateUrl: './kpi-form.component.html',
  styleUrls: ['./kpi-form.component.scss'],
})
export class KPIFormComponent implements OnInit {
  @Input() type!: string;

  formGroupKPI: FormGroup;
  errorMessageKPIName?: string;

  constructor(
    private router: Router,
    private kpiManagementService: KPIManagementService
  ) {
    this.formGroupKPI = new FormGroup({
      name: new FormControl(null, {
        validators: Validators.compose([
          Validators.required,
          kpiManagementService.nameValidators(),
        ]),
        asyncValidators: []
      }),
    });
  }

  ngOnInit(): void {
    if(this.type === 'EDIT') {
        const nameKPi = 'abc'
        this.formGroupKPI.patchValue({
            name: nameKPi
        });
        this.formGroupKPI.get('name')?.setAsyncValidators(this.checkNameValidator(nameKPi));
    }
    else{
        this.formGroupKPI.get('name')?.setAsyncValidators(this.checkNameValidator());
    }

    this.formGroupKPI.get('name')?.updateValueAndValidity();
        
  }

  checkNameValidator(currentName?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (!control.value || control.value.toLowerCase() === currentName) {
        return of(null); 
      }
      return this.kpiManagementService.checkNameExists(control.value).pipe(
        map(exists => (exists ? { nameExists: true } : null)),
        catchError(() => of(null)) 
      );
    };
  }

  cancelEditing() {
    this.router.navigate([RouteConstant.KPI_MANAGEMENT, RouteConstant.LIST_KPI])
  }
}
