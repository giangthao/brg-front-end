import { Injectable } from '@angular/core';
import { DatasetService } from './dataset.service';
import { Dataset } from '../home/modules/dataset-management/upload-file/upload-file.component';

@Injectable({
    providedIn: 'root'
})
export class ErrorCheckService {

    constructor(private datasetService: DatasetService) { }

    //   async checkFileErrors(file: File, dataset: Dataset): Promise<string> {
    //     const text = await file.text();
    //     const lines = text.split('\n');
    //     const processedLines = lines.map((line, index) => {
    //       const errors = this.findErrors(line, dataset);
    //       return errors.length ? `error ${line}` : line;
    //     });

    //     return processedLines.join('\n');
    //   }

    async checkFileErrors(file: File, dataset: Dataset): Promise<{ originalContent: any[], errorReport: string }> {
        const text = await file.text();
        const lines = text.split('\n');
        const processedLines = lines.map((line, index) => {
            const errors = this.findErrors(line, dataset);
            return errors.length ? `error ${line}` : line;
        });

        return {
            originalContent: this.extractValues(lines, dataset),
            errorReport: processedLines.join('\n')
        };
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

                if (this.datasetService.isErrorDatasetValue(from, dataset.fields)
                    || this.datasetService.isErrorDatasetValue(to, dataset.fields)) {
                    errors.push('Wrong format')
                }
            }
        } else {
            // Kiểm tra định dạng "value:giá trị"
            const match = line.match(/value:\s*(\w+)/);
            if (!match) {
                errors.push('Invalid format (value:giá trị)');
            }
            else {
                const value = match[1];
                if (this.datasetService.isErrorDatasetValue(value, dataset.fields)) {
                    errors.push('Wrong format')

                }
            }
        }

        return errors;
    }

    private extractValues(lines: string[], dataset: Dataset): any[] {
        const values: any[] = [];
        lines.forEach(line => {

            if (dataset.isRangeInput) {
                const match = line.match(/from:\s*(\S+)\s*-to:\s*(\S+)/);
                if (match && match[1] && match[2]) {
                    values.push({ from: match[1], to: match[2] });
                }
                else {
                    values.push(null)
                }
            }
            else {
                const valueMatch = line.match(/value:\s*(\S+)\s*/);
                if (valueMatch && valueMatch[1]) {
                    values.push({ value: valueMatch[1] });
                }
                else {
                    values.push(null);
                }
            }
        });
        return values;
    }
}