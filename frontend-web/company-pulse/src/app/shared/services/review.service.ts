import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  url = environment.reviewUrl;

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get<Post[]>(this.url + '/' + localStorage.getItem('username'));
  }

  updatePost(id: number, approved: boolean) {
    return this.http.post(`${this.url}`, { postId: id, approved: approved });
  }
}
