import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);

    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user and update BehaviorSubjects and localStorage', () => {
    service.login('testUser', 'editor');

    expect(localStorage.getItem('loggedIn')).toBe('true');
    expect(localStorage.getItem('username')).toBe('testUser');
    expect(localStorage.getItem('role')).toBe('editor');

    expect(service.loggedIn.value).toBeTrue();
    expect(service.username.value).toBe('testUser');
    expect(service.role.value).toBe('editor');
  });

  it('should logout a user and clear BehaviorSubjects and localStorage', () => {
    service.login('testUser', 'editor');
    service.logout();

    expect(localStorage.getItem('loggedIn')).toBe('false');
    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();

    expect(service.loggedIn.value).toBeFalse();
    expect(service.username.value).toBeNull();
    expect(service.role.value).toBeNull();
  });

  it('should return true for isEditor if role is editor', () => {
    service.login('testUser', 'editor');
    expect(service.isEditor()).toBeTrue();
  });

  it('should return false for isEditor if role is not editor', () => {
    service.login('testUser', 'viewer');
    expect(service.isEditor()).toBeFalse();
  });

  it('should return false for isEditor if role is null', () => {
    service.logout();
    expect(service.isEditor()).toBeFalse();
  });
});
