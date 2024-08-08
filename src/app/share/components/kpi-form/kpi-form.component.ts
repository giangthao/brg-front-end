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
import { catchError, debounceTime, map, switchMap, distinctUntilChanged, first  } from 'rxjs/operators';
import { RouteConstant } from 'src/app/constant/route.constant';
import { KPIManagementService } from 'src/app/services/kpi-management.service';
import { typesKPI, categories, units } from './kpi-form.default';

@Component({
  selector: 'app-kpi-form',
  templateUrl: './kpi-form.component.html',
  styleUrls: ['./kpi-form.component.scss'],
})
export class KPIFormComponent implements OnInit {
  @Input() type!: string;

  formGroupKPI: FormGroup;
  errorMessageKPIName?: string;
  currentName: string = 'abc';
  TYPES_OF_KPI = typesKPI;
  CATEGORIES = categories;
  UNITS = units;
  charCount: number = 0;

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
        asyncValidators: [this.checkNameValidator()]
      }),
      typeKPI: new FormControl(null, {
        validators: Validators.compose([
          Validators.required
        ])
      }),
      category: new FormControl(null, {
        validators: Validators.compose([
          Validators.required
        ])
      }),
      unit: new FormControl(null, {
        validators: Validators.compose([
          Validators.required
        ])
      }),
      percentValue: new FormControl(false),
      description: new FormControl(null, 
        {
          validators: Validators.compose([
            Validators.maxLength(255)
          ])
        }
      )
    });
  }

  ngOnInit(): void {
    if(this.type === 'EDIT') {
        const nameKPi = 'abc'
        this.formGroupKPI.patchValue({
            name: nameKPi
        });
    }
    this.formGroupKPI.valueChanges.subscribe((value) => {
      console.log(value);
      this.charCount = value.description.trim().length;
    })
  }

  checkNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (!control.value || (this.type === 'EDIT' && control.value.toLowerCase() === this.currentName)) {
        return of(null); 
      }
      return control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => 
          this.kpiManagementService.checkNameExists(value).pipe(
            map(exists => (exists ? { nameExists: true } : null)),
            catchError(() => of(null))
          )
        ),
        first(),
      );
    };
  }

  cancelEditing() {
    this.router.navigate([RouteConstant.KPI_MANAGEMENT, RouteConstant.LIST_KPI])
  }

  onOpen() {
    console.log('open')
  }
}
