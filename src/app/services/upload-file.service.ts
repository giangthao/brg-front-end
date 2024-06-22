import { Injectable } from '@angular/core';
import { DatasetService } from './dataset.service';
import { Dataset } from '../home/modules/dataset-management/list-dataset/list-dataset.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private fileDownloadUrl = 'https://your-backend-url/api/download';
  constructor(private datasetService: DatasetService, private http: HttpClient) {}

  downloadFileFromBackend(): Observable<Blob> {
    return this.http.get(this.fileDownloadUrl, { responseType: 'blob' });
  }

  downloadFile() {
    this.downloadFileFromBackend().subscribe(
      response => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'downloaded_file.xlsx';  // Thay đổi tên file theo ý muốn
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error downloading file:', error);
      }
    );
  }

  async checkFileErrors(
    file: File,
    dataset: Dataset
  ): Promise<{ originalContent: any[]; errorReport: string }> {
    // const text = await file.text();
    // const lines = text
    //   .split('\n')
    //   .map((line) => line.trim())
    //   .filter((line) => line.length > 0);
    
    // const processedLines = lines.map((line, index) => {
    //   const errors = this.findErrors(line, dataset);
    //   return errors.length ? `error ${line}` : line;
    // });

    // return {
    //   originalContent: this.extractValues(lines, dataset),
    //   errorReport: processedLines.join('\n'),
    // };
    const chunkSize = 10 * 1024;
    let offset = 0;

    const originalContent : any[] = [];
    const errorLines: string[] = [];
    let pendingLine = '';

    while(offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      const chunkText = await this.readChunk(chunk);
      const lines = (pendingLine + chunkText)
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let lineNotLastIndex : string[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      lineNotLastIndex.push(line);
      const errors = this.findErrors(line, dataset);
      if (errors.length > 0) {
        errorLines.push(`error ${line}`);
      } else {
        errorLines.push(line);
      }
    }

      originalContent.push(...this.extractValues(lineNotLastIndex, dataset));
      pendingLine = lines[lines.length - 1].trim()

      offset += chunkSize
    }

  

    return {
      originalContent: originalContent,
      errorReport: errorLines.join('\n')
    }
  }

  private async readChunk(chunk: Blob) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(event.target.result)
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsText(chunk);
    })
  }

  private findErrors(line: string, dataset: Dataset): string[] {
    const errors: string[] = [];

    if (dataset.isRangeInput) {
      // Kiểm tra định dạng "from: giá trị-to:giá trị"
      const match = line.match(/from:\s*(\w+)\s*-to:\s*(\w+)/);
      if (!match) {
        errors.push('Invalid format (from:value-to:value)');
      } else {
        const from = match[1];
        const to = match[2];

        if (
          this.datasetService.isErrorDatasetValue(from, dataset.fields) ||
          this.datasetService.isErrorDatasetValue(to, dataset.fields)
        ) {
          errors.push('Wrong format');
        }
      }
    } else {
      // Kiểm tra định dạng "value:giá trị"
      const match = line.match(/value:\s*(\w+)/);
      if (!match) {
        errors.push('Invalid format (value:giá trị)');
      } else {
        const value = match[1];
        if (this.datasetService.isErrorDatasetValue(value, dataset.fields)) {
          errors.push('Wrong format');
        }
      }
    }

    return errors;
  }

  private extractValues(lines: string[], dataset: Dataset): any[] {
    const values: any[] = [];
    lines.forEach((line) => {
      if (dataset.isRangeInput) {
        const match = line.match(/from:\s*(\S+)\s*-to:\s*(\S+)/);
        if (match && match[1] && match[2]) {
          values.push({ from: match[1], to: match[2], value: null });
        } else {
          values.push(null);
        }
      } else {
        const valueMatch = line.match(/value:\s*(\S+)\s*/);
        if (valueMatch && valueMatch[1]) {
          values.push({ value: valueMatch[1], from: null, to: null });
        } else {
          values.push(null);
        }
      }
    });
    return values;
  }

  downloadFileWithErrors( errorReport: string, fileName: string): void {
      const blob = new Blob([errorReport], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName
        ? `errors_${fileName}`
        : 'file_with_errors.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
  
  }

  createAndDownloadExcelFile() {
    // Tạo dữ liệu giả lập
    const data = [
      { name: 'John Doe', age: 28, city: 'New York' },
      { name: 'Jane Smith', age: 34, city: 'Los Angeles' }
    ];

    // Chuyển đổi dữ liệu thành worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Tạo workbook và thêm worksheet vào
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };

    // Chuyển đổi workbook thành buffer
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Lưu file
    this.saveAsExcelFile(excelBuffer, 'sample');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}.xlsx`);
  }
   
}
