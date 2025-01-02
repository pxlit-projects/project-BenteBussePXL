import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostItemComponent } from '../post-item/post-item.component';
import { Post } from '../../../shared/models/post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostItemComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts!: Post[];

  ngOnInit(): void {
    this.posts = [
      new Post(1, "Title 1", "Content 1", "Author 1", new Date()),
      new Post(2, "Title 2", "Content 2", "Author 2", new Date()),
      new Post(3, "Title 3", "Content 3", "Author 3", new Date())
    ];
  }
}
