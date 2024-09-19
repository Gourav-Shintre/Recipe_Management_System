import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../validators/password-validator';
import { emailValidator } from '../validators/email-validator';
import { Router } from '@angular/router';
import { Login } from './shared/login';
import { LoginService } from './shared/login.service';

declare const Toastify: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  LoginForm!: FormGroup;
  loginObj: Login;

  constructor(private fb: FormBuilder,public service: LoginService, private router: Router) {
  this.loginObj = new Login();
  }
  ngOnInit(): void {
    if (sessionStorage.getItem("token") !== null) {
      this.router.navigate(['/home']);
    }
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, emailValidator()]],
      password: ['', [Validators.required, passwordValidator()]]
    })

    this.initiateValueChanges();
  }

  initiateValueChanges(): void {
    Object.keys(this.LoginForm.controls).forEach(key => {
      const control = this.f[key];

      control.valueChanges.subscribe(() => {
        control.markAsTouched();
      });
    });
  }

  get f() {
    return this.LoginForm.controls;
  }

  showToast(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: 'right',
      backgroundColor: "linear-gradient(to right, #e10600, #ff4d4d)",
    }).showToast();
  }

  onLogin() {
    if (this.LoginForm.valid) {
      this.loginObj.email = this.f['email'].value;
      this.loginObj.password = this.f['password'].value;
      this.LoginForm.disable();
      this.service.loginUser(this.loginObj).subscribe({
        next: (message) => {
            sessionStorage.setItem('token', message?.token);
            this.router.navigate(['/home']);
            this.LoginForm.enable();
        },
        error: (err) => {
            this.showToast(err.error.status);
            this.LoginForm.enable();
        },
        complete: () => {
          this.LoginForm.enable();
        }
    });
      
    }
   
  }
  
}
