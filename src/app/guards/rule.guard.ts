import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { RoleService } from "../services/role.service";
import { AuthService } from "../services/auth.service";
import { RouteConstant } from "../constant/route.constant";


@Injectable({
    providedIn: 'root'
})
export class RuleGuard implements CanActivate {

    constructor(
        private router: Router,
        private roleService: RoleService,
        private authService: AuthService

    ){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean {
        const role = this.roleService.getRole();

        const isLogged = this.authService.isLoggedIn();
        
        if(isLogged && role?.id === 2) {
            return true
        }
        else{
            this.router.navigate([RouteConstant.LOGIN], {queryParams: {returnUrl: state.url}});
            return false;
        }

    }

}