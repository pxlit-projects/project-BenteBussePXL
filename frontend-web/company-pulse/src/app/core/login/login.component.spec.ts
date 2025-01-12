import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../shared/services/auth.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for dependencies
    authService = jasmine.createSpyObj('AuthService', ['login'], {
      loggedIn: false
    });
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        BrowserDynamicTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('role')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all fields are filled', () => {
    component.loginForm.patchValue({
      username: 'testUser',
      role: 'admin'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Setup valid form data before each test
      component.loginForm.patchValue({
        username: 'testUser',
        role: 'admin'
      });
    });

    it('should not call login service if form is invalid', () => {
      component.loginForm.get('username')?.setErrors({ required: true });
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call login service with correct parameters when form is valid', () => {
      component.onSubmit();
      expect(authService.login).toHaveBeenCalledWith('testUser', 'admin');
    });

    it('should navigate to root when login is successful', () => {
      // Set loggedIn to true to simulate successful login
      Object.defineProperty(authService, 'loggedIn', { get: () => true });
      
      component.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });

    it('should display error message when login fails', () => {
      // Create error div
      const errorDiv = document.createElement('div');
      errorDiv.id = 'error';
      document.body.appendChild(errorDiv);

      // Set loggedIn to false to simulate failed login
      Object.defineProperty(authService, 'loggedIn', { get: () => false });
      
      component.onSubmit();
      
      expect(errorDiv.textContent).toBe('Invalid username or role');
      
      // Cleanup
      document.body.removeChild(errorDiv);
    });

    it('should handle missing error div gracefully', () => {
      // Set loggedIn to false to simulate failed login
      Object.defineProperty(authService, 'loggedIn', { get: () => false });
      
      // No error div in the DOM
      component.onSubmit();
      
      // Test should complete without errors
      expect().nothing();
    });
  });

  describe('Form Validation', () => {
    it('should mark username as invalid when empty', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.errors?.['required']).toBeTruthy();
    });

    it('should mark role as invalid when empty', () => {
      const roleControl = component.loginForm.get('role');
      roleControl?.setValue('');
      expect(roleControl?.errors?.['required']).toBeTruthy();
    });

    it('should mark controls as touched when submit is clicked', () => {
      component.onSubmit();
      expect(component.loginForm.get('username')?.touched).toBeTruthy();
      expect(component.loginForm.get('role')?.touched).toBeTruthy();
    });
  });
});