import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { DatasetService } from 'src/app/services/dataset.service';
import { Input } from '@angular/core';
import { Dataset, DatasetValue } from '../upload-file/upload-file.component';
import { ErrorCheckService } from 'src/app/services/error-check.service';

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
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(
    private datasetService: DatasetService,
    private fb: FormBuilder,
    private errorCheckService: ErrorCheckService
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
        // Kiểm tra kích thước tối đa 5MB
        this.errorMessageUploadFile = 'Larger than 5MB';
        return;
      }
      if (!file.name.endsWith('.txt')) {
        // Kiểm tra định dạng file
        this.errorMessageUploadFile =
          'File không đúng định dạng, vui lòng chọn file .txt';
        return;
      }

      this.errorCheckService
        .checkFileErrors(file, this.datasetEdit)
        .then((report) => {
          this.errorReport = report.errorReport;
          // console.log(report);
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
          this.originalContent = report.originalContent;
          this.renderDatasetValueFromFileToUI();
        });
    }
  }

  renderDatasetValueFromFileToUI() {
    this.calculateTotalPages();
    this.currentPage = 1;
    this.inputs.clear();
    if (this.datasetEdit.isRangeInput) {
      this.pagedData.forEach((value) => {
        this.inputs.push(
          this.fb.group({
            from: new FormControl(value.from),
            to: new FormControl(value.to),
          })
        );
      });
    } else {
      this.pagedData.forEach((value) => {
        this.inputs.push(
          this.fb.group({
            value: new FormControl(value.value),
          })
        );
      });
    }
  }

  downloadFileWithErrors(): void {
    if (this.errorReport) {
      const blob = new Blob([this.errorReport], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName
        ? `errors_${this.fileName}`
        : 'file_with_errors.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  get inputs(): FormArray {
    return this.formValues.get('inputs') as FormArray;
  }

  addInput(): void {
    if (this.datasetEdit.isRangeInput) {
      this.inputs.push(
        this.fb.group({
          from: new FormControl(null),
          to: new FormControl(null),
        })
      );
    } else {
      this.inputs.push(
        this.fb.group({
          value: new FormControl(null),
        })
      );
    }
  }

  onEnter(event: any) {
    event.preventDefault();
    if (event.key === 'Enter') {
      this.addInput();
    }
  }

  ngOnInit(): void {
    console.log(this.datasetEdit);

    // Khởi tạo với một điều khiển form
    this.addInput();
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(
      this.originalContent.length / this.itemsPerPage
    );
  }

  get pagedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.originalContent.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  getPageNumbers(): number[] {
    //return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const maxPages = Math.min(this.totalPages, 5); // Lấy số lượng trang tối đa là 5 hoặc số trang thực tế nếu nhỏ hơn 5
    const startIndex = Math.max(1, this.currentPage - Math.floor(maxPages / 2)); // Bắt đầu từ trang currentPage - maxPages/2
    const endIndex = Math.min(this.totalPages, startIndex + maxPages - 1); // Kết thúc ở trang startIndex + maxPages - 1 hoặc totalPages nếu vượt quá
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

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
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
          input.to !== null &&
          input.from.trim() !== '' &&
          input.to.trim() !== ''
      );
    } else {
      inputs = this.formValues.value.inputs.filter(
        (input: any) => input.value !== null && input.value.trim() !== ''
      );
    }

    if (this.datasetEdit.isRangeInput) {
      const newValues = inputs.map((input: any) => {
        return {
          id: 100,
          value: '',
          from: input.from as string,
          to: input.to as string,
          updatedAt: new Date().toISOString(),
          updatedBy: 'Giang Thao',
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
          input.to !== null &&
          input.from.trim() !== '' &&
          input.to.trim() !== ''
      );
    } else {
      inputs = this.formValues.value.inputs.filter(
        (input: any) => input.value !== null && input.value.trim() !== ''
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
    if (this.originalContent.length > 0) {
      this.originalContent = this.originalContent.filter(
        (item, ind) => ind !== index
      );

      console.log(this.originalContent)
    //   this.calculateTotalPages();
    //   this.currentPage = 1;
    this.renderDatasetValueFromFileToUI()
    } else {
      if (this.inputs.length > 1) {
        this.inputs.removeAt(index);
      }
    }
  }

  countError(): number[] {
    let errors: number[] = [];
    if (this.datasetEdit.isRangeInput) {
      const inputs = this.formValues.value.inputs.filter(
        (input: any) => input.from !== null && input.to !== null
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
        (input: any) => input.value !== null
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


  options : string[] =  ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  selectedOption: string | null = null;

  selectOption(option: string): void {
    this.selectedOption = option;
    this.options = this.options.filter(opt => opt !== option);
  }
}
