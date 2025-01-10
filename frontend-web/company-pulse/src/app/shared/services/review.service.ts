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
    return this.http.get<Post[]>(`${this.url}/${localStorage.getItem('username')}/pending`, {
      withCredentials: true 
    });
  }

  getReviewedPosts() {
    return this.http.get<Post[]>(`${this.url}/${localStorage.getItem('username')}/reviewed`, {
      withCredentials: true 
    });
  }

  updatePost(id: number, approved: boolean, comment : string, reviewer: string, author: string) {
    return this.http.post(`${this.url}`, { postId: id, approved: approved, comment: comment, reviewer: reviewer, author: author}, {
      withCredentials: true 
    });
  }
}
