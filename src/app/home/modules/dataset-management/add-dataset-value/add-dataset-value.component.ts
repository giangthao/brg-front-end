import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { DatasetService } from 'src/app/services/dataset.service';
import { Input } from '@angular/core';
import { Dataset, DatasetValue } from '../list-dataset/list-dataset.component';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-add-dataset-value',
  templateUrl: './add-dataset-value.component.html',
  styleUrls: ['./add-dataset-value.component.scss'],
})
export class AddDatasetValueComponent implements OnInit {
  @Input() datasetEdit!: Dataset;
  @Output() closePopUp = new EventEmitter<boolean>();
  @Output() newValues = new EventEmitter<DatasetValue[]>();

  formValues: FormGroup;
  fileName?: string;
  errorMessageUploadFile?: string;
  errorReport: string | null = null;
  originalContent: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  private readonly MAX_PAGE: number = 5;

  constructor(
    private datasetService: DatasetService,
    private uploadFileService: UploadFileService
  ) {
    this.formValues = new FormGroup({
      inputs: new FormArray([]),
    });
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
        .checkFileErrors(file, this.datasetEdit)
        .then((report) => {
          this.errorReport = report.errorReport;
          console.log(report.originalContent);
          if (report.originalContent.includes(null)) {
            if (this.datasetEdit.isRangeInput) {
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
    fileInput.value = ''; // Clear the file input
    this.fileName = undefined;
    this.originalContent = []; // Reset the list of non-empty lines
    this.inputs.clear();
    this.addInput({ value: null, from: null, to: null });
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
    if (this.datasetEdit.isRangeInput) {
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
    console.log(this.datasetEdit);
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
        this.datasetEdit.fields
      );
    } else {
      return true;
    }
  }

  handleClosePopUp() {
    this.closePopUp.emit(true);
  }

  onSubmit(event: any) {
    event.preventDefault();
    if (this.isDisableButtonSubmit() || this.countError().length > 0) return;
    let inputs: any[];

    // if(this.originalContent.length > 0) return;
    if (this.datasetEdit.isRangeInput) {
      inputs = this.formValues.value.inputs.filter(
        (input: any) =>
          input.from !== null &&
          input.from !== undefined &&
          input.to !== null &&
          input.to !== undefined &&
          input.from.trim() !== '' &&
          input.to.trim() !== ''
      );
    } else {
      inputs = this.formValues.value.inputs.filter(
        (input: any) =>
          input.value !== null &&
          input.value !== undefined &&
          input.value.trim() !== ''
      );
    }

    if (this.datasetEdit.isRangeInput) {
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

      this.datasetService.updateDataValueById(this.datasetEdit.id, newValues);
      this.newValues.emit(newValues);
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
      this.datasetService.updateDataValueById(this.datasetEdit.id, newValues);
      this.newValues.emit(newValues);
      this.handleClosePopUp();
    }
  }

  isDisableButtonSubmit(): boolean {
    let inputs: any[];
    if (this.datasetEdit.isRangeInput) {
      inputs = this.formValues.value.inputs.filter(
        (input: any) =>
          input.from !== null &&
          input.from !== undefined &&
          input.to !== null &&
          input.to !== undefined &&
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
    if (this.datasetEdit.isRangeInput) {
      const inputs = this.formValues.value.inputs.filter(
        (input: any) =>
          input.from !== null &&
          input.to !== null &&
          input.from !== undefined &&
          input.to !== undefined
      );
      //console.log(inputs);
      if (inputs.length > 0) {
        for (let i = 0; i < inputs.length; i++) {
          if (
            this.datasetService.isErrorDatasetValue(
              inputs[i].from,
              this.datasetEdit.fields
            ) ||
            this.datasetService.isErrorDatasetValue(
              inputs[i].to,
              this.datasetEdit.fields
            )
          ) {
            errors.push(i);
          }
        }
      }
    } else {
      const inputs = this.formValues.value.inputs.filter(
        (input: any) => input.value !== null && input.value !== undefined
      );
      //  console.log(inputs);
      if (inputs.length > 0) {
        for (let i = 0; i < inputs.length; i++) {
          if (
            this.datasetService.isErrorDatasetValue(
              inputs[i].value,
              this.datasetEdit.fields
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
