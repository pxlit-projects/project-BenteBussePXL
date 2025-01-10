import { Component, inject, OnInit, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { Notification } from '../../shared/models/notification.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatBadgeModule, MatCardModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  notificationService: NotificationService = inject(NotificationService);
  error: string | null = null;
  notifications!: Notification[];
  unreadCount: number = 0;
  showNotifications: boolean = false;

  ngOnInit(): void {
    this.loadNotifications();
  }

  toggleNotifications(): void {
    if (!this.showNotifications) {
      this.loadNotifications();
    }
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const notificationButton = document.querySelector('[aria-label="Notifications button"]');
    const notificationsDropdown = document.querySelector('.notifications-dropdown');
    
    if (notificationButton?.contains(event.target as Node)) {
      return; // Don't close if clicking the notification button
    }
    
    if (notificationsDropdown && !notificationsDropdown.contains(event.target as Node)) {
      this.closeNotifications();
    }
  }

  loadNotifications(): void {
    const receiver = this.authService.username.value;
    if (!receiver) {
      return;
    }
    this.notificationService.getNotifications(receiver).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = this.notifications.filter((n) => !n.isRead).length;

        // Sort notifications by createdAt date (newest first)
        this.notifications.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      },
      error: () => {
        this.error = 'Failed to load notifications';
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  markAsRead(notification: Notification): void {
    notification.isRead = true;
    this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
    this.notificationService.markAsRead(notification.id).subscribe();
  }
}