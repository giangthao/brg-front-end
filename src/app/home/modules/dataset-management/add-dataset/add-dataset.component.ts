import { Component, OnInit } from "@angular/core";
import { FormControl, FormArray, FormGroup } from "@angular/forms";
import { DatasetService } from "src/app/services/dataset.service";
import { TogglePopUPService, PopUpStateEnum } from "src/app/services/toggle-pop-up.service";
import { UploadFileService } from "src/app/services/upload-file.service";
import { Dataset } from "../list-dataset/list-dataset.component";
import { fieldsConstant } from "../edit-dataset/edit-dataset.component.default";


@Component({
    selector: 'app-add-dataset',
    templateUrl: "./add-dataset.component.html",
    styleUrls: ["./add-dataset.component.scss", "../edit-dataset/edit-dataset.component.scss"]
})
export class AddDatasetComponent implements OnInit{
    FIELDS_CONSTANTS = fieldsConstant;
    newDataset : Dataset = {
        id: 0,
        name: '',
        fields: [],
        format: '',
        isRangeInput: false,
        updatedAt: '',
        updatedBy: '',
        listDatasetValue: []
    };
  
    formValues: FormGroup;
    fileName?: string;
    errorMessageUploadFile?: string;
    errorReport: string | null = null;
    originalContent: any[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;
    private readonly MAX_PAGE: number = 5;

    options : string[] = this.FIELDS_CONSTANTS;
  //  selectedOptions: string[] = [];
    isOptionsVisible: boolean = false;
    isClickedInside: boolean = false;
  
  
    constructor(
      private datasetService: DatasetService,
      private uploadFileService: UploadFileService,
      private togglePopUpService: TogglePopUPService
    ) {
      
      this.formValues = new FormGroup({
        inputs: new FormArray([]),
      });
    }
    
  selectOption(option: string, event: Event): void {
    event.stopImmediatePropagation();
    if (!this.newDataset.fields.includes(option)) {
      this.newDataset.fields.push(option);
      this.options = this.options.filter(opt => opt !== option);
     // this.isOptionsVisible = false;
    }
  }

  removeSelectedOption(option: string, event: Event): void {
    event.stopImmediatePropagation();
    this.newDataset.fields = this.newDataset.fields.filter(opt => opt !== option);
    this.options.push(option);
  }
  toggleOptionsVisibility(event: Event): void {
    event.stopPropagation(); // Prevent this click from propagating to the document
    this.isOptionsVisible = !this.isOptionsVisible;
    this.isClickedInside = !this.isClickedInside
  }

  get displaySelectedOptions(): string[] {
    return this.newDataset.fields.slice(0, 3);
  }

  get extraSelectedOptionsCount(): number {
    return this.newDataset.fields.length > 3 ? this.newDataset.fields.length - 3 : 0;
  }

  handlerClickOutside() {
  //  console.log('click outside');
    this.isClickedInside = false;
    this.isOptionsVisible = false;
  }

 
  
    onFileChange(event: any) {
      
      const file = event.target.files[0];
  
      if (file) {
        console.log(file);
        this.fileName = file.name;
        this.errorMessageUploadFile = '';
        this.originalContent = [];
        this.currentPage = 1;
        this.totalPages = 0;
  
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessageUploadFile = 'Larger than 5MB';
          return;
        }
        if (!file.name.endsWith('.txt')) {
          this.errorMessageUploadFile =
            'File không đúng định dạng, vui lòng chọn file .txt';
          return;
        }
  
        this.uploadFileService
          .checkFileErrors(file, this.newDataset)
          .then((report) => {
            this.errorReport = report.errorReport;
            console.log(report.originalContent);
            if (report.originalContent.includes(null)) {
              if (this.newDataset.isRangeInput) {
                this.errorMessageUploadFile =
                  'File must be format: from: xxx-to:xxx';
              } else {
                this.errorMessageUploadFile = 'File must be format: value: xxx';
              }
              return;
            }
            this.inputs.clear();
            this.updateInputs(report.originalContent);
          });
      }
    }
  
    clearFile(fileInput: any) {
      fileInput.value = '';  // Clear the file input
      this.fileName = undefined;
      this.originalContent = [];  // Reset the list of non-empty lines
      this.inputs.clear();
      this.addInput({value: null, from: null, to: null});
      
    }
  
    downloadFileWithErrors(): void {
      if (this.errorReport && this.fileName) {
        this.uploadFileService.downloadFileWithErrors(
          this.errorReport,
          this.fileName
        );
      }
    }
  
    get inputs(): FormArray {
      return this.formValues.get('inputs') as FormArray;
    }
  
    addInput(input: any): void {
      if (this.newDataset.isRangeInput) {
        const from = new FormControl(input?.from);
        const to = new FormControl(input?.to);
        const formGroup = new FormGroup({ from, to });
        this.inputs.push(formGroup);
        this.calculateTotalPages();
        // Subscribe to the valueChanges observable of the new control
        formGroup.valueChanges.subscribe((control) => {
          const index = this.inputs.controls.indexOf(formGroup);
          // console.log(index); // (currentPage - 1) * itemsPerPage + i + 1
  
          this.originalContent[index] = {
            from: control.from,
            to: control.to,
          };
        });
      } else {
        const value = new FormControl(input?.value);
        const formGroup = new FormGroup({ value });
        this.inputs.push(formGroup);
        this.calculateTotalPages();
  
        // Subscribe to the valueChanges observable of the new control
        formGroup.valueChanges.subscribe((control) => {
          const index = this.inputs.controls.indexOf(formGroup);
          console.log(control.value);
          this.originalContent[index] = {
            value: control.value,
          };
        });
      }
    }
  
    onEnter(event: any) {
      event.preventDefault();
      if (event.key === 'Enter') {
        this.addInput({ value: null, from: null, to: null });
      }
    }
  
    ngOnInit(): void {
      console.log(this.newDataset);
      this.originalContent.forEach((item) => {
        console.log(item);
        this.addInput(item);
      });
  
      this.addInput({ value: null, to: null, from: null });
  
      // folowing form values changing
      this.formValues.valueChanges.subscribe((value) => {
        console.log('form change subcription: ', value.inputs);
  
        this.originalContent = value.inputs;
        this.calculateTotalPages();
        // console.log(this.originalContent);
      });
    }
  
    private calculateTotalPages(): void {
      this.totalPages = Math.ceil(
        this.originalContent.length / this.itemsPerPage
      );
      console.log(this.totalPages);
    }
  
    updateInputs(newInputs: any[]): void {
      newInputs.forEach((input) => this.addInput(input));
      this.originalContent = newInputs;
      this.calculateTotalPages();
    }
  
    get panigatedInputs(): FormArray {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const controls = this.inputs.controls.slice(start, end);
      return new FormArray(controls);
    }
    nextPage(): void {
      if (this.currentPage * this.itemsPerPage < this.inputs.length) {
        this.currentPage = this.currentPage + 1;
      }
    }
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
      }
    }
    getPageNumbers(): number[] {
      const maxPages = Math.min(this.totalPages, this.MAX_PAGE);
      const startIndex = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
      const endIndex = Math.min(this.totalPages, startIndex + maxPages - 1);
      return Array.from(
        { length: endIndex - startIndex + 1 },
        (_, i) => startIndex + i
      );
    }
    pageClick(pageNumber: number) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
      }
    }
  
    isValidValue(input: any): boolean {
      if (typeof input === 'string') {
        return !this.datasetService.isErrorDatasetValue(
          input,
          this.newDataset.fields
        );
      } else {
        return true;
      }
    }
  
    handleClosePopUp() {
        this.togglePopUpService.savePopupState({state: PopUpStateEnum.HIDDEN});
    }
  
    onSubmit(event: any) {
      event.preventDefault();
      if (this.isDisableButtonSubmit() || this.countError().length > 0) return;
      let inputs: any[];
  
      // if(this.originalContent.length > 0) return;
      if (this.newDataset.isRangeInput) {
        inputs = this.formValues.value.inputs.filter(
          (input: any) =>
            input.from !== null &&
            input.to !== null &&
            input.from.trim() !== '' &&
            input.to.trim() !== ''
        );
      } else {
        inputs = this.formValues.value.inputs.filter(
          (input: any) => input.value !== null && input.value.trim() !== ''
        );
      }
  
      if (this.newDataset.isRangeInput) {
        const newValues = inputs.map((input: any) => {
          return {
            id: 100, // fake
            value: '',
            from: input.from as string,
            to: input.to as string,
            updatedAt: new Date().toISOString(),
            updatedBy: 'Giang Thao', // fake
          };
        });
  
        console.log('new: ', newValues);
        
        // fetching api
        this.handleClosePopUp();
      } else {
        const newValues = inputs.map((input: any) => {
          return {
            id: 100, // fake
            value: input.value as string,
            from: '',
            to: '',
            updatedAt: new Date().toISOString(),
            updatedBy: 'Giang Thao',
          };
        });
  
        console.log('new: ', newValues);
      
        // fetching api
        this.handleClosePopUp();
      }
    }
  
    isDisableButtonSubmit(): boolean {
      let inputs: any[];
      if (this.newDataset.isRangeInput) {
        inputs = this.formValues.value.inputs.filter(
          (input: any) =>
            input.from !== null &&
            input.to !== null &&
            input.from.trim() !== '' &&
            input.to.trim() !== ''
        );
      } else {
        inputs = this.formValues.value.inputs.filter(
          (input: any) =>
            input.value !== undefined &&
            input?.value !== null &&
            input?.value.trim() !== ''
        );
      }
      // console.log(inputs);
      if (inputs.length === 0) {
        return true;
      } else {
        const errors = this.countError();
        return errors.length === 0 ? false : true;
      }
    }
    removeFormGroup(index: number) {
      if (this.inputs.length > 1) {
        this.inputs.removeAt(index);
      }
    }
  
    countError(): number[] {
      let errors: number[] = [];
      if (this.newDataset.isRangeInput) {
        const inputs = this.formValues.value.inputs.filter(
          (input: any) => input.from !== null && input.to !== null
        );
        //console.log(inputs);
        if (inputs.length > 0) {
          for (let i = 0; i < inputs.length; i++) {
            if (
              this.datasetService.isErrorDatasetValue(
                inputs[i].from,
                this.newDataset.fields
              ) ||
              this.datasetService.isErrorDatasetValue(
                inputs[i].to,
                this.newDataset.fields
              )
            ) {
              errors.push(i);
            }
          }
        }
      } else {
        const inputs = this.formValues.value.inputs.filter(
          (input: any) => input.value !== null
        );
        //  console.log(inputs);
        if (inputs.length > 0) {
          for (let i = 0; i < inputs.length; i++) {
            if (
              this.datasetService.isErrorDatasetValue(
                inputs[i].value,
                this.newDataset.fields
              )
            ) {
              errors.push(i);
            }
          }
        }
      }
      return errors;
    }

}