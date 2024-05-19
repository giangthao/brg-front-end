import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { RoleService } from '../services/role.service';
import { Router } from '@angular/router';
import { RouteConstant } from '../constant/route.constant';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService, 
    private roleService: RoleService, 
    private router: Router) {}


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    console.log('Call interceptor')
    const apiConfig = req.clone({
      withCredentials: true,
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
      },
    });

    return next.handle(apiConfig).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('refresh-token')) {
            console.log('Call refresh token')
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              console.log('Refresh token success');
              return next.handle(req);
            }),
            catchError((error: any) => {
              this.authService.logout();
              this.roleService.clearRole();
              this.router.navigate([RouteConstant.LOGIN])

              return throwError(error);
            })
          );
        }

        return throwError(error);
      })
    );
  }
}
