import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  url = environment.notificationUrl;

  constructor(private http: HttpClient) { }

  getNotifications(receiver: string) {
    return this.http.get<Notification[]>(`${this.url}/${receiver}`);
  }

  markAsRead(id: number) {
    return this.http.post(`${this.url}/${id}`, {});
  }
}

