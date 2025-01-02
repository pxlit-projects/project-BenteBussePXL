import { Component, Input } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.css'
})
export class PostItemComponent {
  @Input() post!: Post;

}
