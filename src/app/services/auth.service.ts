import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { RoleService } from "./role.service";


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
    private apiUrlLogout = `${environment.baseUrl}/api/auth/logout`;
    
    constructor(
        private http: HttpClient,
        private roleService: RoleService
    ) {}

    login(loginDTO: LoginDTO) : Observable<any> {
        return this.http.post(this.apiUrlLogin, loginDTO);
    }

    refreshToken() : Observable<any> {
        return this.http.post(this.apiUrlRefreshToken, null);
    }

    logout() {
       return this.http.post(this.apiUrlLogout, null);
    }

    isLoggedIn(): boolean {
        const role = this.roleService.getRole();
        console.log(role)
        if (role) {
            
          return true;
        } else {
           
          return false;
        }

    }


}