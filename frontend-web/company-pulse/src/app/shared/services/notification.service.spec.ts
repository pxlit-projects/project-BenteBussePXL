import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment.development';
import { Notification } from '../models/notification.model';
import { NotificationRequest } from '../../core/reviews/review-post/review-post.component';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request when getNotifications is called', () => {
    const mockNotifications: Notification[] = [
      {
        id: 1,
        sender: 'testUserSender',
        message: 'New Notification',
        receiver: 'testUserReceiver',
        postId: 1,
        subject: 'New Notification',
        createdAt: new Date(),
        isRead: false,
      },
    ];

    service.getNotifications('testUser').subscribe((notifications) => {
      expect(notifications).toEqual(mockNotifications);
    });

    const req = httpMock.expectOne(`${service.url}/testUser`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNotifications);
  });

  it('should send a POST request when markAsRead is called', () => {
    service.markAsRead(1).subscribe();

    const req = httpMock.expectOne(`${service.url}/1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('should send a POST request when createNotification is called', () => {
    const mockNotificationRequest: NotificationRequest = {
      sender: 'testUserSender',
      message: 'New Notification',
      receiver: 'testUserReceiver',
      postId: 1,
      subject: 'New Notification',
    };

    service.createNotification(mockNotificationRequest).subscribe();

    const req = httpMock.expectOne(service.url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockNotificationRequest);
    req.flush(null);
  });
});