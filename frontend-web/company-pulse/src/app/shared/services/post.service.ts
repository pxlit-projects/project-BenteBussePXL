import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PostRequest } from '../../core/posts/add-post/add-post.component';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  url = environment.postUrl;

  constructor(private http: HttpClient) { }

  addPost(post: PostRequest) {
    console.log('Sending post:', post);  
    return this.http.post(this.url, post);
  }
}
