import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';
import { Review } from '../models/review.model';

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
    return this.http.get<Review[]>(`${this.url}/${localStorage.getItem('username')}/reviewed`, {
      withCredentials: true 
    });
  }

  updatePost(id: number, title : string, approved: boolean, comment : string, reviewer: string, author: string) {
    return this.http.post(`${this.url}`, { postId: id, postTitle: title, approved: approved, comment: comment, reviewer: reviewer, author: author}, {
      withCredentials: true 
    });
  }
}
