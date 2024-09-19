import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageComponent } from './login-page.component';
import { LoginService } from './shared/login.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mocking LoginService
class MockLoginService {
  loginUser() {
    return of({ token: 'fake-token' });
  }
}

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let mockLoginService: MockLoginService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginPageComponent],
      providers: [
        FormBuilder,
        { provide: LoginService, useClass: MockLoginService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignores unknown elements and attributes
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    mockLoginService = TestBed.inject(LoginService) as any;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const emailControl = component.LoginForm.get('email');
    const passwordControl = component.LoginForm.get('password');
    
    expect(emailControl?.value).toBe('');
    expect(passwordControl?.value).toBe('');
  });

  it('should show validation errors for empty fields', () => {
    const emailControl = component.LoginForm.get('email');
    const passwordControl = component.LoginForm.get('password');

    emailControl?.markAsTouched();
    passwordControl?.markAsTouched();

    fixture.detectChanges();

    const emailErrorElement = fixture.nativeElement.querySelector('#email + .text-danger');
    const passwordErrorElement = fixture.nativeElement.querySelector('#password + .text-danger');
    
    expect(emailErrorElement.textContent).toContain('Email field is required.');
    expect(passwordErrorElement.textContent).toContain('Password field is required.');
  });

  it('should call onLogin() when form is submitted and form is valid', () => {
    component.LoginForm.setValue({ email: 'test@example.com', password: 'Password1!' });
    spyOn(component, 'onLogin').and.callThrough();

    fixture.nativeElement.querySelector('button[type="submit"]').click();
    
    expect(component.onLogin).toHaveBeenCalled();
  });

  it('should navigate to home on successful login', () => {
    component.LoginForm.setValue({ email: 'test@example.com', password: 'Password1!' });
    spyOn(mockLoginService, 'loginUser').and.returnValue(of({ token: 'fake-token' }));
    
    component.onLogin();
    
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

});
