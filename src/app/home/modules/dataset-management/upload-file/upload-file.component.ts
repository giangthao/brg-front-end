import { Component, ElementRef, ViewChild } from '@angular/core';
import { datasetList } from './mockdata';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReadFileService } from 'src/app/services/read-file.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { Router } from '@angular/router';
import { RouteConstant } from 'src/app/constant/route.constant';
import { DatasetService } from 'src/app/services/dataset.service';

export type Dataset = {
   id: number;
   name: string;
   isRangeInput: boolean;
   fields: string[];
   format: string,
   updatedBy: string, 
   updatedAt: string,
   listDatasetValue: DatasetValue[];
};

export type DatasetValue = {
   id: number,
   value: string ,
   from: string,
   to: string,
   updatedBy: string,
   updatedAt: string
};

@Component({
   selector: 'app-upload-file',
   templateUrl: './upload-file.component.html',
   styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent {
   listDataset: Dataset[];

   // Edit
   datasetEdit?: Dataset;
   valueDatasetForm: FormGroup;

   // File
   file?: File;
   pages: any[] = [];
   currentPage = 0;
   pageSize = 80;
   totalPage = 0;
   @ViewChild('fileInput') fileInput!: ElementRef;

   paginatedContent: string[][] = [];
   totalPageArray: number[] = [];

   headerTable = [
      {
         col: 'ID',
      },
      {
         col: 'Name',
      },
      {
         col: 'Fields',
      },
      {
         col: 'Is Range Input',
      },
      {
         col: 'Updated By'
      },
      {
         col: 'Updated At'
      },
      {
         col: 'Actions',
      },
   ];

   constructor(
      private formBuilder: FormBuilder,
      private fileReaderService: ReadFileService,
      private paginationService: PaginationService,
      private router: Router,
      private datasetService: DatasetService
   ) {
      this.listDataset = datasetList;
      this.valueDatasetForm = this.formBuilder.group({
         inputList: this.formBuilder.array([]),
      });
   }

   onFileSelected(event: any, rangeInput: boolean) {
      event.preventDefault();
      const file: File = event.target.files[0];
      const inputList = this.valueDatasetForm.get('inputList') as FormArray;
      const chunkSize = 1024 * 1024;

      if (file) {
         // clear

         inputList.clear();
      }

      if (file.name.endsWith('.txt')) {
         if (file.size <= 5 * 1024 * 1024) {
            // 5MB
            this.fileReaderService.readFileWithChunking(file, chunkSize).subscribe((chunks) => {
               this.processChunks(chunks);
               this.paginatedContent = this.panigateChunks(chunks);

               // console.log('Panigate chunk: ', this.paginatedContent);
            });
         } else {
            alert('File .txt must be smaller tan 5MB.');
         }
      } else {
         alert('File mut be a .txt file.');
      }
   }

   resetFileInput(): void {
      this.fileInput.nativeElement.value = '';
      this.pages = [];
      this.currentPage = 0;
      this.totalPage = 0;
   }

   processChunks(chunks: string[]): void {
      console.log('chuking...');
      this.pages = [...this.pages];
      chunks.forEach((chunk) => {
         const lines = chunk
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

         lines.forEach((line) => {
            const isRangeInput = this.datasetEdit?.isRangeInput;

            if (isRangeInput) {
               const [from, to] = line.split(' ');
               this.pages.push({ from, to });
            } else {
               this.pages.push({ value: line });
            }
         });
      });

      console.log(this.pages);
      // load page
      this.loadPage(0);
   }

   panigateChunks(chunks: string[]): string[][] {
      const paginatedContent: string[][] = [];

      for (let i = 0; i < chunks.length; i++) {
         const lines = chunks[i].split('\n');
         for (let j = 0; j < lines.length; j += this.pageSize) {
            const pageLines = lines.slice(j, j + this.pageSize);
            paginatedContent.push(pageLines);
         }
      }

      console.log('Paginated Content: ', paginatedContent);

      return paginatedContent;
   }

   loadPage(pageIndex: number): void {
      const page = this.pages.slice(pageIndex * this.pageSize, (pageIndex + 1) * this.pageSize);

      const inputList = this.valueDatasetForm.get('inputList') as FormArray;

      if (inputList) {
         inputList.clear();

         page.forEach((item) => {
            if (item.hasOwnProperty('from') && item.hasOwnProperty('to')) {
               const formGroup = this.formBuilder.group({
                  from: [item.from, Validators.pattern(/^[0-9]+$/)],
                  to: [item.to, Validators.pattern(/^[0-9]+$/)],
               });
               inputList.push(formGroup);
            } else {
               const formGroup = this.formBuilder.group({
                  value: [item.value, Validators.pattern(/^[0-9]+(_[0-9]+)+$/)],
               });
               inputList.push(formGroup);
            }
         });
      }
   }

   createLineFromGroup(line: string, rangeInput: boolean): FormGroup {
      // const inputList = this.valueDatasetForm.get('inputList') as FormArray;

      if (rangeInput) {
         return this.formBuilder.group({
            from: [line.split(' ')[0], Validators.pattern(/^[0-9]+$/)],
            to: [line.split(' ')[1], Validators.pattern(/^[0-9]+$/)],
         });
      } else {
         return this.formBuilder.group({
            value: [line],
         });
      }
   }

   renderFromData(data: any[], rangeInput: boolean): void {
      const inputList = this.valueDatasetForm.get('inputList') as FormArray;

      inputList.clear();

      data.forEach((item) => {
         if (rangeInput) {
            const formGroup = this.formBuilder.group({
               from: [item.from, Validators.pattern(/^[0-9]+$/)],
               to: [item.to, Validators.pattern(/^[0-9]+$/)],
            });

            formGroup.setErrors(item.errors);
            inputList.push(formGroup);
         } else {
            const formGroup = this.formBuilder.group({
               value: [item.value, Validators.pattern(/^[0-9]+(_[0-9]+)+$/)],
            });
            formGroup.setErrors(item.errors);

            inputList.push(formGroup);
         }
      });
   }

   addInput(isRange: boolean) {
      if (isRange) {
         // Thêm FormGroup cho dạng range (from - to)
         const rangeFormGroup = this.formBuilder.group({
            from: [''], // FormControl cho giá trị "from"
            to: [''], // FormControl cho giá trị "to"
         });
         this.inputList.push(rangeFormGroup);
      } else {
         // Thêm FormGroup cho dạng đơn lẻ (single input)
         const singleInputFormGroup = this.formBuilder.group({
            value: [''], // FormControl cho giá trị đơn
         });
         this.inputList.push(singleInputFormGroup);
      }
   }

   removeInput(index: number) {
      this.inputList.removeAt(index);
   }

   get inputList(): FormArray {
      return this.valueDatasetForm.get('inputList') as FormArray;
   }

   getFields(dataset: Dataset): string {
      // Check if the first element is "CELL"
      const startsWithCell = dataset.fields[0] === 'CELL';
      
      // Join the array elements with underscores
      let result = dataset.fields.join('_');
      
      // Add an underscore at the beginning if the first element is "CELL"
      if (startsWithCell) {
          result = '_' + result;
      }
      
      return result;
   }

   setDataSetEdit(dataset: Dataset) {
      this.datasetEdit = dataset;
      const inputControls: AbstractControl[] = dataset.listDatasetValue.map((data) => {
         if (dataset.isRangeInput) {
            return this.formBuilder.group({
               from: [data.from, Validators.pattern(/^[0-9]+$/)],
               to: [data.to, Validators.pattern(/^[0-9]+$/)],
            });
         } else {
            return this.formBuilder.group({
               value: [data.value, Validators.pattern(/^[0-9]+(_[0-9]+)+$/)], // /^[0-9]+(_[0-9]+)+$/
            });
         }
      });

      // this.valueDatasetForm.setControl('inputList', this.formBuilder.array(inputControls));
      // Gán inputListForm.inputList bằng một mảng các AbstractControl
      const inputListArray = this.valueDatasetForm.get('inputList') as FormArray;
      inputListArray.clear(); // Xóa tất cả các control cũ

      inputControls.forEach((control) => {
         if (this.isFormGroup(control)) {
            inputListArray.push(control); // Thêm FormGroup vào FormArray
         }
      });
   }

   getFormGroup(control: AbstractControl) {
      return control as FormGroup;
   }

   // Phương thức để kiểm tra xem AbstractControl có phải là FormGroup hay không
   isFormGroup(control: AbstractControl): control is FormGroup {
      return control instanceof FormGroup;
   }

   isRangeControl(inputGroup: FormGroup): boolean {
      // Kiểm tra sự tồn tại của các trường 'from' và 'to' trong inputGroup
      const hasFromControl = inputGroup.contains('from');
      const hasToControl = inputGroup.contains('to');

      // Trả về true nếu cả hai trường 'from' và 'to' đều tồn tại trong inputGroup
      return hasFromControl && hasToControl;
   }

   // Kiểm tra tất cả các FormControl trong FormArray
   checkAllInputs(): void {
      const inputList = this.valueDatasetForm.get('inputList') as FormArray;
      inputList.controls.forEach((inputGroup: AbstractControl) => {
         if (inputGroup.get('from')?.invalid) {
            console.log('Invalid "From" value:', inputGroup.get('from')?.errors);
         }
         if (inputGroup.get('to')?.invalid) {
            console.log('Invalid "To" value:', inputGroup.get('to')?.errors);
         }
         if (inputGroup.get('value')?.invalid) {
            console.log('Invalid "Value" value:', inputGroup.get('value')?.errors);
         }
      });
   }

   goToEditPage(id: number) {
      this.router.navigate([RouteConstant.CONFIG, RouteConstant.DATASET, 'edit', id])
   }

   formatDateTimeToString(date: string) {
      return this.datasetService.convertDateTimeUTCToString(date)
      
   }
}
