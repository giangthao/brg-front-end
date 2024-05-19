import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { RouteConstant } from '../constant/route.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
  
    const isLogged = this.authService.isLoggedIn();
    
    if(isLogged) {
        return true;
    }
    else{
        this.router.navigate([RouteConstant.LOGIN], {queryParams: {returnUrl: state.url}});
        return false;
        
    }
  }
}
