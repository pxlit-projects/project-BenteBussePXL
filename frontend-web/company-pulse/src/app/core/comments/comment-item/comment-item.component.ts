import { Component, inject, Input, OnInit } from '@angular/core';
import { Comment } from '../../../shared/models/comment.model';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { AuthService } from '../../../shared/services/auth.service';
import { CommentService } from '../../../shared/services/comment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  imports: [RelativeTimePipe, ReactiveFormsModule, MatIconModule],
  standalone: true,
  styleUrls: ['./comment-item.component.css']
})
export class CommentItemComponent implements OnInit {
  @Input() comment!: Comment;
  commentForm! : FormGroup;
  isEditing = false;
  authService : AuthService = inject(AuthService);
  commentService : CommentService = inject(CommentService);

  constructor(
    private fb : FormBuilder
  ) {}

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      content: [this.comment.content]
    });
  }

  isAuthor(): boolean {
    console.log(this.comment.author);
    return this.comment.author === this.authService.username.value;
  }

  enableEdit(): void {
    this.isEditing = true;
    let { content } = this.commentForm.value
    content = this.comment.content; 
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    let { content } = this.commentForm.value
    if (content.trim()) {
      const updatedComment = { ...this.comment, content: content, isEdited: true };

      this.commentService.updateComment(updatedComment).subscribe({
        next: () => {
          this.comment.content = content; // Update locally
          this.isEditing = false;
        },
        error: () => {
          console.error('Failed to edit comment');
        },
      });
    }
  }

  deleteComment(): void {
    this.commentService.deleteComment(this.comment.id).subscribe({
      next: () => {
        this.commentService.commentChanged.next(this.comment.id);
      },
      error: () => {
        console.error('Failed to delete comment');
      },
    });
  }
}
