import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";


export type LoginDTO =  {
    username: string ;
    password: string
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrlLogin = `${environment.baseUrl}/api/auth/login-test`;
    private apiUrlRefreshToken = `${environment.baseUrl}/api/auth/refresh-token`;
    
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

    login(loginDTO: LoginDTO) : Observable<any> {
        return this.http.post(this.apiUrlLogin, loginDTO);
    }

    refreshToken() : Observable<any> {
        return this.http.post(this.apiUrlRefreshToken, null);
    }

    logout() {
        // call api logout 
    }


}