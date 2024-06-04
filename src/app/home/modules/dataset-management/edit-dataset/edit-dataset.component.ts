import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Dataset, DatasetValue } from '../upload-file/upload-file.component';
import { DatasetService } from 'src/app/services/dataset.service';
import { deepCopy } from 'src/app/share/utils';


import {
  headerTableNotRange,
  headerTableRange,
  fieldsConstant,
} from './edit-dataset.component.default';
import { FormArray, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-dataset',
  templateUrl: './edit-dataset.component.html',
  styleUrls: ['./edit-dataset.component.scss'],
})
export class EditDatasetComponent implements OnInit, OnDestroy {
  datasetEdit!: Dataset;
  id!: number;
  headerTable: any;
  FIELDS_CONSTANTS = fieldsConstant;
  showFormSelectFields: boolean = false;

  filterForm: FormGroup;
  formSubscription!: Subscription;

  filteredData: DatasetValue[] = [];
  pageSize = 5;
  currentPage = 1;
  totalPages!: number;
  paginatedData: DatasetValue[] = [];

  isEditing = false;
  editedItem?: DatasetValue; // Track the item being edited
  editedValue = ''; // Store the edited value
  typeEdit?: string;

  newDatasetValue: DatasetValue[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datasetService: DatasetService,
    private fb: FormBuilder
  ) {
    this.filterForm = new FormGroup({
      value: new FormControl(''),
      username: new FormControl(''),
      selectedFields: new FormArray([]),
      startTime: new FormControl(''),
      endTime: new FormControl(''),
    });
  }

  ngOnInit(): void {
    console.log('Edit dataset on init');
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('datasetId');
      if (id !== null) {
        this.id = Number(id);
      } else {
        this.id = 0;
      }
    });
    console.log(this.id);
    if (this.id) {
      this.datasetEdit = this.datasetService.getDatasetById(this.id);
      this.filteredData =  deepCopy(this.datasetEdit.listDatasetValue)
      this.newDatasetValue =  deepCopy(this.datasetEdit.listDatasetValue);

      console.log(this.filteredData);
      console.log(this.newDatasetValue)

    }
    console.log(this.datasetEdit);
    if (this.datasetEdit.isRangeInput === true) {
      this.headerTable = headerTableRange;
    } else {
      this.headerTable = headerTableNotRange;
    }

    this.addCheckboxes();

    this.formSubscription = this.filterForm.valueChanges.subscribe((value) => {
      console.log('on changes: ', value);

      let tmpList: DatasetValue[] =  deepCopy(this.datasetEdit.listDatasetValue);

      if (value?.value && value.value.trim() !== '') {
        tmpList = tmpList.filter((item) =>
          item.value.toLowerCase().includes(value.value.trim().toLowerCase())
          || item.from.toLowerCase().includes(value.value)
          || item.to.toLowerCase().includes(value.value)
        );
      }

      if (value?.username && value.username.trim() !== '') {
        tmpList = tmpList.filter((item) =>
          item.updatedBy
            .toLowerCase()
            .includes(value.username.trim().toLowerCase())
        );
      }

      if (value?.selectedFields) {
      }

      if (value?.startTime && value.startTime.trim() !== '') {
        const startTime = new Date(value.startTime);
        tmpList = tmpList.filter(
          (item) => new Date(item.updatedAt) >= startTime
        );
      }

      if (value?.endTime && value.endTime.trim() !== '') {
        const endTime = new Date(value.endTime);
        tmpList = tmpList.filter((item) => new Date(item.updatedAt) <= endTime);
      }

      this.filteredData = tmpList;
      this.currentPage = 1;
      this.paginateData(); // Initialize pagination on load
      this.calculateTotalPages(); // Calculate total pages on load
    });

    this.paginateData(); // Initialize pagination on load
    this.calculateTotalPages(); // Calculate total pages on load
  }

  startEditing(item: DatasetValue, type? : string) {
    this.editedItem = item;

    if(!type) {
      if (!this.datasetEdit.isRangeInput) {
        this.editedValue = item.value;
        this.typeEdit = 'VALUE'
      } else {
        this.editedValue = item.from;
        this.typeEdit = 'FROM'
      }

    }
    else{
      switch (type) {
        case 'VALUE' : {
          if(!this.datasetEdit.isRangeInput){
            this.editedValue = item.value;
            this.typeEdit = type;
          }
          break;
        }
        case 'FROM' : {
          if(this.datasetEdit.isRangeInput) {
            this.editedValue = item.from;
            this.typeEdit = type;
          }
          break;
        }
        case 'TO' : {
          if(this.datasetEdit.isRangeInput) {
            this.editedValue = item.to;
            this.typeEdit = type;
          }
          break;
        }
        default:
          break;
      }
    }

   

    this.isEditing = true;
  }

  cancelEditing() {
    // Cancel editing and reset variables
    this.editedItem = undefined;
    this.editedValue = '';
    this.isEditing = false;
    this.typeEdit = undefined;
  }

  saveEditedValue() {
    // Save the edited value to the data
    if (this.editedItem) {
      this.editedItem.value = this.editedValue;
    }
    this.cancelEditing(); // Reset editing state
  }

  saveEditedFromValue() {
    if (this.editedItem) {
      this.editedItem.from = this.editedValue;
    }
    this.cancelEditing();
  }

  saveEditedToValue() {
    if (this.editedItem) {
      this.editedItem.to = this.editedValue;
    }
    this.cancelEditing();
  }

  isValidDatasetValue() {
    //console.log(this.datasetService.isErrorDatasetValue(this.editedValue, this.datasetEdit.fields))
    return (
      !this.datasetService.isErrorDatasetValue(
        this.editedValue,
        this.datasetEdit.fields
      ) 
    );
  }

  applyNewValue(datasetValue: DatasetValue, type: string) {
    console.log('Value Edit', datasetValue);
    // console.log(this.editedValue);

    

    // Update the filteredData with the edited value
    const index = this.filteredData.findIndex(
      (item) => item === datasetValue
    );
    
    // Update the newDataValue with the edited value
    //console.log(this.newDatasetValue);
    console.log( 'filter list: ', this.filteredData)
    console.log( 'new list: ', this.newDatasetValue)
    const indexInNewList = this.newDatasetValue.findIndex(
      (item) => item.id === datasetValue.id
    );
    

    console.log(indexInNewList, 'index new');
    console.log(index, 'index filter')
    
    if (index !== -1) {
      switch (type) {
        case 'VALUE' : {
          this.filteredData[index].value = this.editedValue;
          this.filteredData[index].updatedBy = 'meeee'; //fake;
          this.filteredData[index].updatedAt = new Date().toISOString();
          if(indexInNewList !== -1) {
            console.log('apply in new value')
            this.newDatasetValue[indexInNewList].value = this.editedValue;
            this.newDatasetValue[indexInNewList].updatedBy = 'meeee';
            this.newDatasetValue[indexInNewList].updatedAt = new Date().toISOString()

            console.log(this.newDatasetValue);
            console.log(this.datasetEdit.listDatasetValue);
           

          }
          this.cancelEditing();

        
          break;

        }
        case 'FROM' : {
          this.filteredData[index].from = this.editedValue;
          this.filteredData[index].updatedBy = 'meeee'; //fake;
          this.filteredData[index].updatedAt = new Date().toISOString();
          if(indexInNewList !== -1) {
            this.newDatasetValue[indexInNewList].from = this.editedValue;
            this.newDatasetValue[indexInNewList].updatedBy = 'meeee';
            this.newDatasetValue[indexInNewList].updatedAt = new Date().toISOString();
          }
          this.cancelEditing();
          break;
        }
        case 'TO' : {
          this.filteredData[index].to = this.editedValue;
          this.filteredData[index].updatedBy = 'meeee'; //fake;
          this.filteredData[index].updatedAt = new Date().toISOString();
          if(indexInNewList !== -1) {
            this.newDatasetValue[indexInNewList].to = this.editedValue;
            this.newDatasetValue[indexInNewList].updatedBy = 'meeee';
            this.newDatasetValue[indexInNewList].updatedAt = new Date().toISOString();
          }
          this.cancelEditing();
          break;
        }
      }
    }
  }


  deleteDatasetValue(datasetValue: DatasetValue) {
    console.log('delete: ', datasetValue);
    this.filteredData = this.filteredData.filter(
      (item) => item !== datasetValue
    );

    this.newDatasetValue = this.newDatasetValue?.filter(
      (item) => item.id !== datasetValue.id
    );

   // console.log(this.newDatasetValue)

    this.paginateData();
    this.calculateTotalPages();
  }

  

  applyFilter(value: any) {}

  paginateData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);

    console.log('paginated: ', this.paginatedData);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    console.log(this.totalPages);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber; // Set current page to the selected page number
    this.paginateData(); // Paginate data for the selected page
  }

  getSelectedFields(): FormArray {
    return this.filterForm.get('selectedFields') as FormArray;
  }

  get selectedValues(): string[] {
    let selectedString: string[] = [];
    const selectedFields = this.filterForm.get('selectedFields') as FormArray;
    const hasSelected = selectedFields.value.some((item: any) => item.checkbox);

    if (hasSelected) {
      for (let i = 0; i < selectedFields.value.length; i++) {
        if (!selectedFields.value[i].checkbox) {
          continue;
        }
        selectedString = [...selectedString, this.FIELDS_CONSTANTS[i]];
      }
    } else {
      selectedString = ['Select Fields'];
    }
    //console.log(selectedString)
    return selectedString;
  }

  removeSelected(selected: any, index: any) {
    console.log('Remove ');
    console.log(selected, index);

    this.FIELDS_CONSTANTS.filter((field, index) => {
      if (selected === field) {
        (
          (this.filterForm.get('selectedFields') as FormArray).at(
            index
          ) as FormGroup
        )
          .get('checkbox')
          ?.setValue(false);
      }
    });
  }

  formatSelectedFields(strings: string[]) {
    return this.datasetService.formatFields(strings);
  }

  private addCheckboxes() {
    this.FIELDS_CONSTANTS.forEach(() => {
      const control = new FormControl(false);
      (this.filterForm.controls.selectedFields as FormArray).push(
        new FormGroup({
          checkbox: control,
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe(); // Unsubscribe to prevent memory leaks
  }

  submitForm(e: any) {
    e.preventDefault();
    console.log(this.filterForm.value);
  }

  formatDateTimeToString(date: string) {
    return this.datasetService.convertDateTimeUTCToString(date);
  }

  toggleShowFormSelectFields() {
    this.showFormSelectFields = !this.showFormSelectFields;
  }

  checkArraysEqual(): boolean {
    if (this.newDatasetValue.length !== this.datasetEdit.listDatasetValue.length) {
      return false;
    }

    for(const datasetValue of this.datasetEdit.listDatasetValue) {
       const elementCheck = this.newDatasetValue.find(item => item.id === datasetValue.id);
       //console.log(elementCheck, datasetValue)
       
       if(elementCheck?.value !== datasetValue.value || elementCheck?.from !== datasetValue.from
        || elementCheck?.to !== datasetValue.to) {
          return false;
        }
    }
    return true;
  }

  saveDatasetValue() {
    // call api
    
    this.datasetEdit.listDatasetValue = this.newDatasetValue;

    console.log(this.datasetEdit.listDatasetValue);
    this.filteredData = deepCopy(this.datasetEdit.listDatasetValue);
    this.paginateData();
    this.calculateTotalPages();

    
  }

  cancel() {
    this.filteredData = deepCopy(this.datasetEdit.listDatasetValue);
    this.paginateData();
    this.calculateTotalPages();
  }

 
}
