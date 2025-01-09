import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Post } from '../../../shared/models/post.model';
import { ReviewService } from '../../../shared/services/review.service';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review-post',
  standalone: true,
  templateUrl: './review-post.component.html',
  styleUrls: ['./review-post.component.css'],
  imports: [MatCard, MatCardFooter, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle, DatePipe],
})
export class ReviewPostComponent implements OnInit {
  posts!: Post[];
  router: Router = inject(Router);


  constructor(private reviewService: ReviewService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  approve(post: Post) {
    this.reviewService.updatePost(post.id, true).subscribe(() =>
      this.loadPosts()
    );
  }

  reject(post: Post) {
    this.reviewService.updatePost(post.id, false).subscribe(() =>
      this.loadPosts()
    );
  }

  loadPosts() {
    this.reviewService.getPosts().subscribe((posts : Post[]) => {
      this.posts = posts;  
    });
  }
}
