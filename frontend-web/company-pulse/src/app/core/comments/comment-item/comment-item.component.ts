import { Component, Input } from '@angular/core';
import { Comment } from '../../../shared/models/comment.model';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  imports: [RelativeTimePipe],
  standalone: true,
  styleUrls: ['./comment-item.component.css']
})
export class CommentItemComponent {
  @Input() comment!: Comment;
}
