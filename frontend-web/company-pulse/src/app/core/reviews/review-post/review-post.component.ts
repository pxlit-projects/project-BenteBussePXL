import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Post } from '../../../shared/models/post.model';
import { ReviewService } from '../../../shared/services/review.service';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../../shared/services/notification.service';
import { Notification } from '../../../shared/models/notification.model';
import { AuthService } from '../../../shared/services/auth.service';
import { RejectDialogComponent } from '../reject-dialog/reject-dialog.component';

// review-post.component.ts
@Component({
  selector: 'app-review-post',
  standalone: true,
  templateUrl: './review-post.component.html',
  styleUrls: ['./review-post.component.css'],
  imports: [
    MatCard, 
    MatCardFooter, 
    MatCardActions, 
    MatCardContent, 
    MatCardHeader, 
    MatCardTitle, 
    MatCardSubtitle, 
    DatePipe
  ],
})
export class ReviewPostComponent implements OnInit {
  posts!: Post[];
  reviewedPosts!: Post[];
  router: Router = inject(Router);
  notificationService: NotificationService = inject(NotificationService);
  authService: AuthService = inject(AuthService);

  constructor(
    private reviewService: ReviewService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  approve(post: Post) {
    this.reviewService.updatePost(
      post.id,
      true,
      '', // No comment needed for approval
      this.authService.username.value!,
      post.author
    ).subscribe(() => {
      this.loadPosts();
      this.notificationService.createNotification(
        new NotificationRequest(
          this.authService.username.value!,
          post.author,
          "Approved",
          `Your post "${post.title}" has been approved!`,
          post.id
        )
      ).subscribe();
    });
  }

  reject(post: Post) {
    const dialogRef = this.dialog.open(RejectDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(comment => {
      if (comment) {
        this.reviewService.updatePost(
          post.id,
          false,
          comment,
          this.authService.username.value!,
          post.author
        ).subscribe(() => {
          this.loadPosts();
          this.notificationService.createNotification(
            new NotificationRequest(
              this.authService.username.value!,
              post.author,
              "Rejected",
              `Your post "${post.title}" has been rejected. \nReason: ${comment}`,
              post.id
            )
          ).subscribe();
        });
      }
    });
  }

  loadPosts() {
    this.reviewService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
    
    this.reviewService.getReviewedPosts().subscribe((posts: Post[]) => {
      this.reviewedPosts = posts;
    });
  }
}

export class NotificationRequest {
  sender: string;
  receiver: string;
  subject: string;
  message: string;
  postId: number;


  constructor(sender : string,receiver: string, subject: string, message: string, postId: number)
  {
    this.sender = sender;
    this.receiver = receiver;
    this.subject = subject;
    this.message = message;
    this.postId = postId;
  }
}
