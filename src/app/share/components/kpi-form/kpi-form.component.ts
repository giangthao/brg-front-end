import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  switchMap,
  distinctUntilChanged,
  take,
} from 'rxjs/operators';
import { RouteConstant } from 'src/app/constant/route.constant';
import { KPIManagementService } from 'src/app/services/kpi-management.service';
import {
  typesKPI,
  categories,
  units,
  operators,
  itemTypes,
  listKPITimeSeries,
  listKPITransaction,
  counters,
  kpiEdit,
} from './kpi-form.default';
import { Group } from './kpi-form.default';

@Component({
  selector: 'app-kpi-form',
  templateUrl: './kpi-form.component.html',
  styleUrls: ['./kpi-form.component.scss'],
})
export class KPIFormComponent implements OnInit {
  @Input() type!: string;

  formGroupKPI: FormGroup;
  //form: FormGroup;
  datasetEdit?: any;
  TYPES_OF_KPI = typesKPI;
  CATEGORIES: any[] = [];
  UNITS = units;
  OPERATORS = operators;
  ITEM_TYPES = itemTypes;
  charCount: number = 0;

  kpiOptions: { label: string; value: string }[] = [];
  counterOptions = counters;
  disableButtonSave: boolean = true;
  inValidCommonInfor: boolean = true;
  inValidCalculationFormule: boolean = true;
  textCalculationFormule: string = '';
  isExistedName: boolean = false;

  currentPageCategories : number = 1;

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
        // asyncValidators: [this.checkNameValidator()],
      }),
      typeKPI: new FormControl(null, {
        validators: Validators.compose([Validators.required]),
      }),
      category: new FormControl(null, {
        validators: Validators.compose([Validators.required]),
      }),
      unit: new FormControl(null, {
        validators: Validators.compose([
          Validators.required,
          kpiManagementService.unitValidators(),
        ]),
      }),
      percentValue: new FormControl(false),
      description: new FormControl(null, {
        validators: Validators.compose([Validators.maxLength(255)]),
      }),
      expression: this.fb.array([this.createGroup()]),
    });

    // this.form = this.fb.group({
    //   expression: this.fb.array([this.createGroup()]),
    // });
  }

  ngOnInit(): void {
    this.loadCategories(this.currentPageCategories);
    if (this.type === 'EDIT') {
      this.datasetEdit = kpiEdit; // fake data edited

      this.formGroupKPI.patchValue({
        name: this.datasetEdit.name,
        typeKPI: this.datasetEdit.typeKPI.value,
        category: this.datasetEdit.category.value,
        unit: this.datasetEdit.unit,
        percentValue: this.datasetEdit.percentValue,
        description: this.datasetEdit.description,
      });
      const kpiTypeValue = {
        typeKPI: this.datasetEdit.typeKPI.value,
      };
      this.initalListKPI(kpiTypeValue);

      if (this.datasetEdit.expression.length > 0) {
        while (this.expression.length < this.datasetEdit.expression.length) {
          this.expression.push(this.createGroup());
        }
        this.expression.patchValue(this.datasetEdit.expression);
        this.textCalculationFormule = this.kpiManagementService.convertJsonToExpression(this.datasetEdit.expression)
      }
    }
    // Subscribe to value changes to log validation errors
    this.subcribeCheckName();
    this.subcribeCommonValues();
    this.subcribeExpressionValues();
  }

  loadCategories(pageNumber: number) {
    this.kpiManagementService.getCategories(pageNumber).subscribe((newItems: any[]) => {
      console.log(newItems)
      this.CATEGORIES = [...this.CATEGORIES, ...newItems];

      // Add "More" button if there are more items to load
      if (newItems.length > 0) {
        this.CATEGORIES.push({ value: 'More' });
      }
    });

  }

  onSelectCategory(event: any) {
    if (event.value === 'More') {
      
      this.currentPageCategories++;
      this.CATEGORIES.pop(); // Remove the "More" option
      this.loadCategories(this.currentPageCategories); // Load more items
      
    }
  }

  checkNameValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      if (
        !control.value ||
        (this.type === 'EDIT' &&
          control.value.toLowerCase() === this.datasetEdit?.name)
      ) {
        return of(null);
      }
      return control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) =>
          this.kpiManagementService.checkNameExists(value, this.datasetEdit?.name).pipe(
            map((exists) => (exists ? { nameExists: true } : null)),
            catchError(() => of(null))
          )
        ),
        take(1)
      );
    };
  }

  subcribeCheckName() {
    this.formGroupKPI
      .get('name')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        const control = this.formGroupKPI.get('name');
        this.kpiManagementService
          .checkNameExists(control?.value.trim(), this.datasetEdit?.name)
          .subscribe({
            next: (res) => {
              this.isExistedName = res;
            },
            error: (error) => {},
            complete: () => {},
          });
      });
  }

  cancelEditing() {
    this.router.navigate([
      RouteConstant.KPI_MANAGEMENT,
      RouteConstant.LIST_KPI,
    ]);
  }

  onOpen() {
    console.log('open');
  }

  // Expression
  createGroup(operator: any = null): FormGroup {
    return this.fb.group({
      groupOperator: [operator],
      groupItems: this.fb.array([
        this.createItem(null, 'KPI'),
        this.createItem('PLUS', 'KPI'),
      ]),
    });
  }

  createItem(operator: any = null, itemType: string): FormGroup {
    return this.fb.group({
      itemType: [itemType, Validators.required],
      itemOperator: [operator],
      item: [null, Validators.required],
    });
  }

  get expression(): FormArray {
    return this.formGroupKPI.get('expression') as FormArray;
  }

  getGroupItems(index: number): FormArray {
    return this.expression.at(index).get('groupItems') as FormArray;
  }

  addGroup(): void {
    this.expression.push(this.createGroup('PLUS'));
  }

  addItem(groupIndex: number): void {
    const groupItems = this.getGroupItems(groupIndex);
    groupItems.push(this.createItem('PLUS', 'KPI'));
  }

  removeItem(groupIndex: number, itemIndex: number): void {
    if (this.cannotRemoveItem(groupIndex, itemIndex)) return;
    const groupItems = this.getGroupItems(groupIndex);
    groupItems.removeAt(itemIndex);
  }

  removeGroup(groupIndex: number): void {
    if (this.cannotRemoveGroup(groupIndex)) return;
    this.expression.removeAt(groupIndex);
  }

  cannotRemoveItem(groupIndex: number, itemIndex: number): boolean {
    if (itemIndex === 0) return true;
    const groupItems = this.getGroupItems(groupIndex);
    if (groupIndex === 0) {
      if (groupItems.length <= 2) return true;
    }
    return false;
  }

  cannotRemoveGroup(groupIndex: number): boolean {
    if (groupIndex === 0) return true;
    return false;
  }

  subcribeExpressionValues() {
    this.formGroupKPI.valueChanges.subscribe((value) => {
      console.log(value);
      this.subscribeToItemTypeChanges();
      this.checkValidationCalculationFormule(value);

      if (!this.inValidCalculationFormule) {
        this.textCalculationFormule =
          this.kpiManagementService.convertJsonToExpression(
            value.expression as Group[]
          );
      }
    });
  }

  subcribeCommonValues() {
    this.formGroupKPI.valueChanges.subscribe((value) => {
      console.log(value);
      this.countDescriptionLength(value);
      this.initalListKPI(value);
      this.checkValidationCommonValues(value);
      console.log('Form:', this.formGroupKPI.invalid);
    });
  }

  countDescriptionLength(value: any): void {
    if (value.description) {
      this.charCount = value.description.trim().length;
    }
  }

  initalListKPI(value: any): void {
    console.log(value);
    if (value.typeKPI) {
      if (value.typeKPI === 'Time series') {
        this.kpiOptions = listKPITimeSeries;
      } else if (value.typeKPI === 'Transaction') {
        this.kpiOptions = listKPITransaction;
      }
    }
  }

  checkValidationCommonValues(value: any) {
    if (!value.name || !value.typeKPI || !value.unit || !value.category) {
      this.inValidCommonInfor = true;
      return;
    }
    if (
      this.formGroupKPI.get('unit')?.invalid ||
      this.formGroupKPI.get('name')?.invalid
    ) {
      this.inValidCommonInfor = true;
      return;
    }

    this.inValidCommonInfor = false;
  }

  checkValidationCalculationFormule(value: any): void {
    let isValid = true;
    for (let i = 0; i < value.expression.length; i++) {
      if (i > 0 && !value.expression[i].groupOperator) {
        isValid = false;
        break;
      }
      if (!this.checkGroupItems(this.getGroupItems(i))) {
        isValid = false;
        break;
      }
    }

    this.inValidCalculationFormule = !isValid;
  }

  checkGroupItems(itemsGroup: FormArray): boolean {
    for (let j = 0; j < itemsGroup.length; j++) {
      if (
        itemsGroup.at(j).get('item')?.errors?.required ||
        itemsGroup.at(j).get('itemType')?.errors?.required ||
        (j > 0 && !itemsGroup.at(j).get('itemOperator')?.value) ||
        this.inValidItemValueNumber(itemsGroup, j)
      ) {
        return false;
      }
    }
    return true;
  }

  inValidItemValueNumber(itemsGroup: FormArray, itemIndex: number): boolean {
    if (
      itemsGroup.at(itemIndex).get('itemType')?.value === 'NUMBER' &&
      Number(itemsGroup.at(itemIndex).get('item')?.value) <= 0
    ) {
      return true;
    }
    return false;
  }

  subscribeToItemTypeChanges() {
    this.expression.controls.forEach((group) => {
      const groupItems = (group.get('groupItems') as FormArray).controls;
      groupItems.forEach((item) => {
        item.get('itemType')?.valueChanges.subscribe((value) => {
          item.get('item')?.reset();
        });
      });
    });
  }

  onSubmitForm() {
    console.log('submit form');
  }
}
