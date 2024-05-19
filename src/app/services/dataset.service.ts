import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DatasetService{
    private apiUrlDataset = `${environment.baseUrl}/api/auth/dataset`;
    private apiConfig = {
        headers: this.createHeadersRequest(),
        withCredentials: true
    }

    constructor(private http: HttpClient) {}

    private createHeadersRequest() : HttpHeaders {
        return new HttpHeaders ({
            'Content-Type' : 'application/json',
            'Accept-Language': 'en',
           
        })
    }

    getDataset(): Observable<any>  {
        
        return this.http.get(this.apiUrlDataset, this.apiConfig);
    }

}