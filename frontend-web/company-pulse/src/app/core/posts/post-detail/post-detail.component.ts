import { Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommentItemComponent } from '../../comments/comment-item/comment-item.component';
import { Comment } from '../../../shared/models/comment.model';
import { CommonModule, DatePipe } from '@angular/common';
import { CommentService } from '../../../shared/services/comment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatInputModule, CommonModule, MatButtonModule, CommentItemComponent, DatePipe, CommonModule, MatLabel, MatFormFieldModule, ReactiveFormsModule]
})
export class PostDetailComponent implements OnInit {
  // Using the new input() syntax instead of constructor injection
  dialogRef = inject(MatDialogRef<PostDetailComponent>);
  data = inject(MAT_DIALOG_DATA);
  commentService : CommentService = inject(CommentService);
  authService : AuthService = inject(AuthService);
  comments : Comment[] = this.data.comments;
  postForm! : FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      comment: ['', Validators.required],
    });
    this.commentService.commentChanged.subscribe((commentId) => {
      this.comments = this.comments.filter((comment) => comment.id !== commentId);
    });
  }
  

  addComment(): void {
    if (this.postForm && this.authService.loggedIn) {
      const { comment } = this.postForm.value;
      const newCommentRequest: CommentRequest = new CommentRequest(
        this.data.id,
        comment,
        this.authService.username.value!
      );
  
      this.commentService.addComment(newCommentRequest).subscribe({
        next: () => {
          // Fetch the updated list of comments
          this.commentService.getCommentsByPostId(this.data.id).subscribe({
            next: (updatedComments) => {
              this.comments = updatedComments; // Update the comments array
            },
            error: () => {
              console.error('Failed to fetch updated comments');
            },
          });
        },
        error: () => {
          console.error('Failed to add comment');
        },
      });
      this.postForm.reset();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

export class CommentRequest {
  postId: number;
  content: string;
  author: string;

  constructor(postId: number, content: string, author: string) {
    this.postId = postId;
    this.content = content;
    this.author = author;
  }
}