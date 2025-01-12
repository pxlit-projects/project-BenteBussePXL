import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';  // Add this import
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { Post } from '../../../shared/models/post.model';
import { map, Observable } from 'rxjs';
import { PostItemComponent } from '../post-item/post-item.component';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [PostItemComponent, AsyncPipe],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.css'
})
export class DraftsComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  router: Router = inject(Router);  // Add this
  posts: Observable<Post[]> = new Observable<Post[]>();

  ngOnInit() {
    this.getDrafts();
  }

  getDrafts() {
    this.posts = this.postService.getDraftsByAuthor(this.authService.username.value!).pipe(
      map(posts => [...posts].sort((a, b) => 
         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    );  
  }

  // Update to use ID instead of title for tracking
  trackByTitle(index: number, item: Post): number {
    return item.id;
  }

  // Add navigation method
  onEdit(postId: number) {
    this.router.navigate(['/edit-post', postId]);
  }
}