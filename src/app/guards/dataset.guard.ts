import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
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
export class DatasetGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const role = this.roleService.getRole();
    const isLogged = this.authService.isLoggedIn();
    
    if(isLogged && (role?.id == 1 || role?.id === 2  )) {
        return true;
    }
    else{
        this.router.navigate([RouteConstant.LOGIN], {queryParams: {returnUrl: state.url}});
        return false;
    }
  }
}
