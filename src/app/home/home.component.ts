import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { Router } from '@angular/router';
import { RouteConstant } from '../constant/route.constant';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
 
  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router
  ) {
   
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response: any) => {
        console.log(response);
        this.roleService.clearRole();
        this.router.navigate([RouteConstant.HOME]);
      },
      complete: () => {},
      error: (error: any) => {
        console.log(error);
      },
    });
  }


  ngOnInit(): void {
    
  }

  isLoggedIn() : boolean {
    return this.authService.isLoggedIn();
  }
}
