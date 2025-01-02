import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PostRequest } from '../../core/posts/add-post/add-post.component';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  url = environment.postUrl;

  constructor(private http: HttpClient) { }

  addPost(post: PostRequest) {
    return this.http.post(this.url, post);
  }

  getDraftsByAuthor(author: string) {
    return this.http.get<Post[]>(`${this.url}/drafts/${author}`);
  }

  getPosts() {
    return this.http.get<Post[]>(this.url);
  }

  // Added new methods
  getPostById(id: string) {
    return this.http.get<Post>(`${this.url}/${id}`);
  }

  updatePost(id: string, post: PostRequest) {
    return this.http.put(`${this.url}/${id}`, post);
  }
}