import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, distinctUntilChanged, first  } from 'rxjs/operators';
import { RouteConstant } from 'src/app/constant/route.constant';
import { KPIManagementService } from 'src/app/services/kpi-management.service';
import { typesKPI, categories, units, operators, itemTypes } from './kpi-form.default';


@Component({
  selector: 'app-kpi-form',
  templateUrl: './kpi-form.component.html',
  styleUrls: ['./kpi-form.component.scss'],
})
export class KPIFormComponent implements OnInit {
  @Input() type!: string;

  formGroupKPI: FormGroup;
  form: FormGroup;
  errorMessageKPIName?: string;
  currentName: string = 'abc';
  TYPES_OF_KPI = typesKPI;
  CATEGORIES = categories;
  UNITS = units;
  OPERATORS = operators;
  ITEM_TYPES = itemTypes;
  charCount: number = 0;

  kpiOptions = [1, 2, 3];  // Replace with actual KPI IDs
  counterOptions = [101, 102, 103];  // Replace with actual counter IDs

  constructor(
    private router: Router,
    private kpiManagementService: KPIManagementService,
    private fb: FormBuilder
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

    this.form = this.fb.group({
      expression: this.fb.array([this.createGroup()])
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

  // EXp
  createGroup(): FormGroup {
    return this.fb.group({
      groupOperator: ['ADD'],
      groupItems: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      itemType: [null, Validators.required],
      itemOperator: ['ADD'],
      itemValue: [null, Validators.required]
    });
  }

  get expression(): FormArray {
    return this.form.get('expression') as FormArray;
  }

  getGroupItems(index: number): FormArray {
    return this.expression.at(index).get('groupItems') as FormArray;
  }

  addGroup(): void {
    this.expression.push(this.createGroup());
  }

  addItem(groupIndex: number): void {
    const groupItems = this.getGroupItems(groupIndex);
    groupItems.push(this.createItem());
  }
}
