import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  url = environment.postUrl;

  constructor(private http : HttpClient) { 
    this.http = http;
  }

  addPost(post: any) {
    return this.http.post(this.url, post);
  }
}
