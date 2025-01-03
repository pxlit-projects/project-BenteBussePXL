import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { PostListComponent } from './core/posts/post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './core/login/login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, 
    RouterOutlet, 
    NavbarComponent, 
    PostListComponent, 
    ReactiveFormsModule, 
    LoginComponent, 
    MatToolbarModule, 
    MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'company-pulse';
}
