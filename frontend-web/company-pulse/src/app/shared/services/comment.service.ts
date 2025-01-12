import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CommentRequest } from '../../core/posts/post-detail/post-detail.component';
import { Comment } from '../models/comment.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  url = environment.commentUrl;
  commentChanged = new Subject<number>(); 
  constructor(private httpClient : HttpClient) { }

  addComment(commentRequest : CommentRequest) {
    return this.httpClient.post(this.url, { content: commentRequest.content, postId: commentRequest.postId, author: commentRequest.author });
  }

  getCommentsByPostId(postId: number) {
    return this.httpClient.get<Comment[]>(`${this.url}/${postId}`);
  }  

  updateComment(comment : Comment) {
    return this.httpClient.put(`${this.url}/${comment.id}`, { content: comment.content });
  }

  deleteComment(commentId : number) {
    return this.httpClient.delete(`${this.url}/${commentId}`);
  }
}