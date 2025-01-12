import { Component, inject, Input } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { DatePipe } from '@angular/common';
import { CommentService } from '../../../shared/services/comment.service';
import { PostDetailComponent } from '../post-detail/post-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [DatePipe, 
    PostDetailComponent, 
    MatCard, 
    MatCardFooter, 
    MatCardActions, 
    MatCardContent, 
    MatCardHeader, 
    MatCardTitle, 
    MatCardSubtitle,],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.css'
})
export class PostItemComponent {
  @Input() post!: Post;
  commentService: CommentService = inject(CommentService);
  dialog : MatDialog = inject(MatDialog);

  openPostDetail(post: Post): void {
    this.commentService.getCommentsByPostId(post.id).subscribe((comments) => {
      const dialogRef = this.dialog.open(PostDetailComponent, {
        width: '600px',
        data: { ...post, comments }
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('Dialog closed');
      });
    });
  }
}
