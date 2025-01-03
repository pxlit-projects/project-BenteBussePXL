import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = new BehaviorSubject<boolean>(this.getInitialLoggedInState());
  username = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  role = new BehaviorSubject<string | null>(localStorage.getItem('role'));

  constructor() { }

  login(username: string, role: string): void {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    this.loggedIn.next(true);
    this.username.next(username);
    this.role.next(role);
    console.log('Logged in as', username, role);
  }

  isEditor(): boolean {
    return this.role.value === 'editor';
  }

  logout(): void {
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
    this.username.next(null);
    this.role.next(null);
  }

  private getInitialLoggedInState(): boolean {
    console.log('Initial logged in state:', localStorage.getItem('loggedIn') === 'true');
    return localStorage.getItem('loggedIn') === 'true';
  }
}
