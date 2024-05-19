import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginDTO } from '../services/auth.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouteConstant } from '../constant/route.constant';
import { DatasetService } from '../services/dataset.service';
import { RoleService } from '../services/role.service';
import { Role } from '../models/role';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage?: string;
  isLogged: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private datasetService: DatasetService,
    private roleService: RoleService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl(
        'nguyenvanagmailcom',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z]*$/),
        ])
      ),
      password: new FormControl(
        '123456',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
    });
  }

  ngOnInit(): void {}

  onSubmitForm($event: any) {
    $event.preventDefault();
    this.errorMessage = undefined;
    console.log(this.loginForm.value);

    if (this.loginForm.status === 'INVALID') return;

    const formData: LoginDTO = {
      username: this.loginForm.value.username.trim(),
      password: this.loginForm.value.password,
    };

    console.log(formData);

    this.authService.login(formData).subscribe({
      next: (response: any) => {
        console.log(response);

        console.log(response?.role);
        if (response.role) {
          this.isLogged = true;

          const userRole: Role = response.role;
          this.roleService.saveRole(userRole);

          // 1 - manage dataset ; 2 - manage all dataset and rule
          if (userRole.id === 1) {
            this.router.navigate([RouteConstant.CONFIG, RouteConstant.DATASET]);
          } else if (userRole.id === 2) {
            this.router.navigate([RouteConstant.CONFIG, RouteConstant.RULE]);
          }
        } else {
          this.isLogged = false;
          this.errorMessage =
            'You do not to access the system. Please contact the admin.';
        }
      },

      complete: () => {
        console.log('Complete');
      },
      error: (error: any) => {
        console.log(error);
        this.isLogged = false;
        this.roleService.clearRole();
        if (error?.error?.message) {
          // console.log(error.error.message)
          this.errorMessage = error.error.message;
        }
      },
    });
  }

  isUsernameEmpty(): boolean {
    return (
      this.loginForm.get('username')?.errors?.['required'] &&
      this.loginForm.get('username')?.touched
    );
  }

  isUsernameWrongFormat(): boolean {
    return (
      this.loginForm.get('username')?.errors?.['pattern'] &&
      this.loginForm.get('username')?.touched
    );
  }

  isPasswordEmpty(): boolean {
    return (
      this.loginForm.get('password')?.errors?.['required'] &&
      this.loginForm.get('password')?.touched
    );
  }

  isPasswordWrongFormat(): boolean {
    return (
      this.loginForm.get('password')?.errors?.['minlength'] &&
      this.loginForm.get('password')?.touched
    );
  }
}
