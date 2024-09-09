import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { LoginResponseType } from 'src/app/types/login-response.type';
import { nameValidator } from 'src/app/utils/name-validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.fb.group({
    fullName: ['', [Validators.required, nameValidator()]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]]
  });

  constructor(private authService: AuthService, private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  get fullName() {
    return this.signupForm.get('fullName');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get agree() {
    return this.signupForm.get('agree');
  }

  signup(): void {
    if (this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.fullName && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.fullName, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            };

            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            };

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            errorResponse.error && errorResponse.error ? this._snackBar.open(errorResponse.error.message) : this._snackBar.open('Ошибка регистрации');
          }
        });
    }
  }
}
