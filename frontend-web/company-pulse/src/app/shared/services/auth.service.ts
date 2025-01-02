import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn : boolean = false;
  username : string = '';
  role : string = '';

  constructor() { }

  login(username: string, role: string) : void {
    this.loggedIn = true;
    this.username = username;
    this.role = role;
  }

  isEditor() : boolean {
    return this.role === 'editor';
  }

  logout() : void {
    this.loggedIn = false;
    this.username = '';
    this.role = '';
  }
}
