import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DatasetService{
    private apiUrlDataset = `${environment.baseUrl}/api/auth/dataset`;
   
    constructor(private http: HttpClient) {}

    getDataset(): Observable<any>  {
        
        return this.http.get(this.apiUrlDataset);
    }

}