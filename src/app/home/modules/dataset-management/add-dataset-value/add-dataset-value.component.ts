import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
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
  totalPages: number = 1;
  private readonly MAX_PAGE: number = 5;
  loadingFile: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

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
      this.loadingFile = true;

      if (this.originalContent.length > 0) {
        console.log('clear old file');
        this.originalContent = [{ value: null, from: null, to: null }];
        this.currentPage = 1;
        this.totalPages = 1;
        this.updateFormControls();
      }

      this.fileName = file.name;
      this.errorMessageUploadFile = '';

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessageUploadFile = 'Larger than 5MB';
        this.loadingFile = false;
        return;
      }
      if (!file.name.endsWith('.txt')) {
        this.errorMessageUploadFile =
          'File không đúng định dạng, vui lòng chọn file .txt';
        this.loadingFile = false;
        return;
      }

      this.uploadFileService
        .checkFileErrors(file, this.datasetEdit)
        .then((report) => {
          this.errorReport = report.errorReport;
          console.log(report.originalContent);
          console.log(report.errorReport);

          if (report.originalContent.includes(null)) {
            if (this.datasetEdit.isRangeInput) {
              this.errorMessageUploadFile =
                'File must be format: from: xxx-to:xxx';
            } else {
              this.errorMessageUploadFile = 'File must be format: value: xxx';
            }
            this.loadingFile = false;
            return;
          }

          this.originalContent = report.originalContent;
          this.calculateTotalPages();
          this.currentPage = 1; // inital page

          this.updateFormControls();
          this.loadingFile = false;
        });
    }
  }

  clearFile() {
    this.fileInput.nativeElement.value = ''; // Clear the file input
    this.fileName = undefined;
    this.errorMessageUploadFile = undefined;
    this.originalContent = [{ value: null, to: null, from: null }]; // Reset the list of non-empty lines
    this.calculateTotalPages();
    this.currentPage = this.totalPages;
    this.updateFormControls();
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
    } else {
      const value = new FormControl(input?.value);
      const formGroup = new FormGroup({ value });

      this.inputs.push(formGroup);
    }
  }

  onEnter(event: any) {
    event.preventDefault();
    if (event.key === 'Enter') {
      this.originalContent.push({ value: null, from: null, to: null });
      this.calculateTotalPages();
      this.currentPage = this.totalPages; // go to end page
      this.updateFormControls();
    }
  }

  ngOnInit(): void {
    this.originalContent.push({ value: null, from: null, to: null });
    this.updateFormControls();

    // folowing form values changing
    this.formValues.valueChanges.subscribe((value) => {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;

      for (let i = 0; i < value.inputs.length; i++) {
        this.originalContent[startIndex + i] = value.inputs[i];
      }
    });
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(
      this.originalContent.length / this.itemsPerPage
    );
  }

  updateFormControls() {
    this.inputs.clear();

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageItems = this.originalContent.slice(startIndex, endIndex);

    pageItems.forEach((item) => {
      this.addInput(item);
    });
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.originalContent.length) {
      this.currentPage = this.currentPage + 1;
      this.updateFormControls();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.updateFormControls();
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

      this.updateFormControls();
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

    if (this.datasetEdit.isRangeInput) {
      inputs = this.originalContent.filter( // replace originalContent -> inputs
        (input: any) =>
          input.from !== null &&
          input.from !== undefined &&
          input.to !== null &&
          input.to !== undefined &&
          input.from.trim() !== '' &&
          input.to.trim() !== ''
      );
    } else {
      inputs = this.originalContent.filter( // replace originalContent -> inputs
        (input: any) =>
          input.value !== null &&
          input.value !== undefined &&
          input.value.trim() !== ''
      );
    }

    if (this.datasetEdit.isRangeInput) {
      const newValues = inputs.map((input: any, index) => {
        return {
          id: 100 + index, // fake
          value: '',
          from: input.from as string,
          to: input.to as string,
          updatedAt: new Date().toISOString(),
          updatedBy: 'Giang Thao', // fake
        };
      });

      this.datasetService.updateDataValueById(this.datasetEdit.id, newValues);
      this.newValues.emit(newValues);
      this.handleClosePopUp();
    } else {
      const newValues = inputs.map((input: any, index) => {
        return {
          id: 100 + index, // fake
          value: input.value as string,
          from: '',
          to: '',
          updatedAt: new Date().toISOString(),
          updatedBy: 'Giang Thao',
        };
      });

      this.datasetService.updateDataValueById(this.datasetEdit.id, newValues);
      this.newValues.emit(newValues);
      this.handleClosePopUp();
    }
  }

  isDisableButtonSubmit(): boolean {
    let inputs: any[];
    if (this.datasetEdit.isRangeInput) {
      inputs = this.originalContent.filter( // replace originalContent -> inputs
        (input: any) =>
          input.from !== null &&
          input.from !== undefined &&
          input.to !== null &&
          input.to !== undefined &&
          input.from.trim() !== '' &&
          input.to.trim() !== ''
      );
    } else {
      inputs = this.originalContent.filter( // replace originalContent -> inputs
        (input: any) =>
          input.value !== undefined &&
          input?.value !== null &&
          input?.value.trim() !== ''
      );
    }

    if (inputs.length === 0) {
      return true;
    } else {
      const errors = this.countError();
      return errors.length === 0 ? false : true;
    }
  }
  removeFormGroup(index: number) {
    if (this.originalContent.length > 1) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.originalContent.splice(startIndex + index, 1);
      this.calculateTotalPages();
      this.currentPage = this.totalPages;
      this.updateFormControls();
    }
  }

  countError(): number[] {
    let errors: number[] = [];
    if (this.datasetEdit.isRangeInput) {
      const inputs = this.originalContent.filter( // replace originalContent -> inputs
        (input: any) =>
          input.from !== null &&
          input.to !== null &&
          input.from !== undefined &&
          input.to !== undefined
      );

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
      const inputs = this.originalContent.filter( // replace originalContent -> inputs
        (input: any) => input.value !== null && input.value !== undefined
      );

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
