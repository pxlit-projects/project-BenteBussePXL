import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostItemComponent } from '../post-item/post-item.component';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { catchError, finalize, Observable, of } from 'rxjs';
import { FilterComponent } from '../filter/filter.component';
import { Filter } from '../../../shared/models/filter.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostItemComponent, FilterComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts!: Post[];
  originalPosts!: Post[]; // Store original posts for filtering
  postService: PostService = inject(PostService);
  error: string | null = null;
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.originalPosts = data; // Store original posts
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

  onFilterChanged(filter: Filter) {
    this.posts = this.originalPosts.filter(post => {
      const matchContent = !filter.content || 
        post.content.toLowerCase().includes(filter.content.toLowerCase());
      const matchAuthor = !filter.author || 
        post.author.toLowerCase().includes(filter.author.toLowerCase());
      const matchDate = !filter.createdAt || 
        new Date(post.createdAt).toDateString() === new Date(filter.createdAt).toDateString();

      return matchContent && matchAuthor && matchDate;
    });

    // Sort filtered results
    this.posts.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
}