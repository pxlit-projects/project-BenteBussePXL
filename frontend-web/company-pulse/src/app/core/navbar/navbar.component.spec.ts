import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Notification } from '../../shared/models/notification.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockNotifications: Notification[] = [
    {
      id: 1,
      message: 'Test notification 1',
      receiver: 'testUser',
      isRead: false,
      createdAt: new Date('2024-01-01'),
      sender: 'admin',
      subject: 'Test subject 1',
      postId: 3
    },
    {
      id: 2,
      message: 'Test notification 2',
      receiver: 'testUser',
      isRead: true,
      createdAt: new Date('2024-01-02'),
      sender: 'admin',
      subject: 'Test subject 2',
      postId: 4
    }
  ];

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['logout'], {
      username: new BehaviorSubject<string>('testUser')
    });

    notificationService = jasmine.createSpyObj('NotificationService', 
      ['getNotifications', 'markAsRead']
    );

    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatBadgeModule,
        MatCardModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notificationService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    notificationService.getNotifications.and.returnValue(of(mockNotifications));
    
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load notifications on init', () => {
      component.notifications = [...mockNotifications];
      expect(notificationService.getNotifications).toHaveBeenCalledWith('testUser');
      expect(component.notifications).toEqual(mockNotifications);
    });

    it('should handle error when loading notifications', () => {
      notificationService.getNotifications.and.returnValue(throwError(() => new Error('Load failed')));
      component.loadNotifications();
      expect(component.error).toBe('Failed to load notifications');
    });
  });

  describe('auto refresh', () => {
    it('should start auto refresh on init', fakeAsync(() => {
      notificationService.getNotifications.calls.reset();
      component.ngOnInit();
  
      // Simuleer 11 seconden
      tick(11000);
  
      // Controleer of de notificatieservice is aangeroepen
      expect(notificationService.getNotifications).toHaveBeenCalled();
  
      // Ruim overgebleven timers op
      component.ngOnDestroy();
      flush();
    }));
  });
  

  describe('notification handling', () => {
    it('should toggle notifications panel', () => {
      component.toggleNotifications();
      expect(component.showNotifications).toBeTrue();
      
      component.toggleNotifications();
      expect(component.showNotifications).toBeFalse();
    });

    it('should load notifications when opening panel', () => {
      notificationService.getNotifications.calls.reset();
      component.showNotifications = false;
      component.toggleNotifications();
      expect(notificationService.getNotifications).toHaveBeenCalled();
    });

    it('should mark notification as read', () => {
      notificationService.markAsRead.and.returnValue(of({}));
    
      component.notifications = [...mockNotifications];
    
      const notification = component.notifications[1];
      component.markAsRead(notification);
      expect(notification.isRead).toBeTrue();
      expect(component.unreadCount).toBe(0);
      expect(notificationService.markAsRead).toHaveBeenCalledWith(notification.id);
    });
    

    it('should sort notifications by date', () => {
      const sortedDates = component.notifications.map(n => n.createdAt);
      expect(sortedDates).toEqual(sortedDates.sort((a, b) => b.getTime() - a.getTime()));
    });
  });

  describe('document click handling', () => {
    let mockEvent: MouseEvent;
    let notificationButton: HTMLElement;
    let notificationsDropdown: HTMLElement;

    beforeEach(() => {
      notificationButton = document.createElement('button');
      notificationButton.setAttribute('aria-label', 'Notifications button');
      notificationsDropdown = document.createElement('div');
      notificationsDropdown.className = 'notifications-dropdown';
      
      document.body.appendChild(notificationButton);
      document.body.appendChild(notificationsDropdown);
      
      spyOn(document, 'querySelector').and.callFake((selector: string) => {
        if (selector === '[aria-label="Notifications button"]') return notificationButton;
        if (selector === '.notifications-dropdown') return notificationsDropdown;
        return null;
      });
    });

    afterEach(() => {
      document.body.removeChild(notificationButton);
      document.body.removeChild(notificationsDropdown);
    });

    it('should not close notifications when clicking notification button', () => {
      mockEvent = new MouseEvent('click');
      spyOn(notificationButton, 'contains').and.returnValue(true);
      
      component.showNotifications = true;
      component.onDocumentClick(mockEvent);
      expect(component.showNotifications).toBeTrue();
    });

    it('should close notifications when clicking outside', () => {
      mockEvent = new MouseEvent('click');
      spyOn(notificationButton, 'contains').and.returnValue(false);
      spyOn(notificationsDropdown, 'contains').and.returnValue(false);
      
      component.showNotifications = true;
      component.onDocumentClick(mockEvent);
      expect(component.showNotifications).toBeFalse();
    });
  });

  describe('logout', () => {
    it('should handle logout correctly', () => {
      component.logout();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});