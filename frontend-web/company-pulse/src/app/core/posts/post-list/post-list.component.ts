import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostItemComponent } from '../post-item/post-item.component';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { catchError, finalize, Observable, of } from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostItemComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts!: Post[];
  postService : PostService = inject(PostService);
  error: string | null = null;
  loading = false;
  
  ngOnInit(): void {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        
        // Sort posts by createdAt date (newest first)
        this.posts.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
  
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load posts';
        this.loading = false;
      }
    });
  }
  
}