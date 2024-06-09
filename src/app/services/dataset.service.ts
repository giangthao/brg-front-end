import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { Dataset, DatasetValue } from "../home/modules/dataset-management/list-dataset/list-dataset.component";
import { datasetList } from "../home/modules/dataset-management/list-dataset/mockdata";

@Injectable({
    providedIn: 'root'
})
export class DatasetService{
    private apiUrlDataset = `${environment.baseUrl}/api/auth/dataset`;
    private readonly REGEX = /^((?!_).)*$/;
   
    constructor(private http: HttpClient) {}

    getDataset(): Observable<any>  {
        
        return this.http.get(this.apiUrlDataset);
    }

    getDatasetById(id: number) : Dataset {
        return datasetList.find(item => item.id === id) ?? 
        {
          id: 0,
          name: '',
          fields: [''],
          format: '',
          isRangeInput: false,
          updatedAt: '',
          updatedBy: '',
          listDatasetValue: [
            {
                id: 0,
                value: '',
                from: '',
                to: '',
                updatedAt: '',
                updatedBy: ''
            }
          ]
        };
    }

    updateDataValueById(id: number, newDataValue: DatasetValue[]) {
        const dataset = datasetList.find(item => item.id === id);
        if(dataset) {
            dataset.listDatasetValue = newDataValue;
        }
    }

    isErrorDatasetValue(input: string, fields: string[]) : boolean {
       
       if(fields[0] === 'CELL') {

       // console.log(this.checkValueDatasetIfFieldIsCell(input, fields))
         return this.checkValueDatasetIfFieldIsCell(input, fields);
       }
       else if (fields.length > 1) {
       
       // console.log(this.checkValueDataset(input, fields))
         return this.checkValueDataset(input, fields)
       }
       else if(fields.length === 1) {
       // console.log(fields)
       // console.log(this.REGEX.test(input))
        return !this.REGEX.test(input);
       }
       return false;

    }

    checkValueDatasetIfFieldIsCell(input: string, fields: string[]) : boolean {
        let arr;
        if(!input.startsWith('_')) return true; 
        arr = input.split('_');
        arr = arr.filter((item, index) => index !== 0);
        if(arr.filter((v) => v === '').length !== 0) return true;
        if(arr.length !== fields.length) return true;
        return arr.filter((item) => !this.REGEX.test(item)).length !== 0;
    }

    checkValueDataset(input: string, fields: string[]): boolean {
        let arr;
        if(!input.includes('_')) return true;
        arr = input.split('_');
        if(arr.filter ((item) => item === '').length !== 0) return true;
        if(arr.length !== fields.length) return true;
        return arr.filter(item => !this.REGEX.test(item)).length !== 0;
    }

    convertDateTimeUTCToString(dateInput: string) {
         // Parse the UTC date-time string to create a Date object
    const date = new Date(dateInput);

    // Extract day, month, year, hour, and minute
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based in JavaScript
    const year = date.getUTCFullYear();
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');

    // Format the date-time components into "day-month-year hour:minute"
    const formattedDateTime = `${day}-${month}-${year} ${hour}:${minute}`;

    return formattedDateTime;

    }

    convertDateTimeStringToUTC(dateInput: string) {
        const [datePart, timePart] = dateInput.split(' ');

    // Split the date part into day, month, and year
    const [day, month, year] = datePart.split('-');

    // Split the time part into hours and minutes
    const [hours, minutes] = timePart.split(':');

    // Construct the ISO 8601 format with specific seconds and Z for UTC
    const iso8601Str = `${year}-${month}-${day}T${hours}:${minutes}:00Z`;

    return iso8601Str;

    }

    formatFields(fields: string[]) {
        const startsWithCell = fields[0] === 'CELL';
      
        // Join the array elements with underscores
        let result = fields.join('_');
        
        // Add an underscore at the beginning if the first element is "CELL"
        if (startsWithCell) {
            result = '_' + result;
        }
        
        return result;
    }


    async checkName(name: string): Promise<{ valid: boolean }> {
        // Giả lập kiểm tra tên tại client
        const isValid = name.length > 3; 
        return { valid: isValid };
    }
}