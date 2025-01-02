import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  postForm!: FormGroup;
  postService: PostService = inject(PostService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const { title, content, author, date } = this.postForm.value;
      const newPost = new Post(0, title, content, author, new Date(date)); 
      this.postService.addPost(newPost);
    } else {
      console.log('Form is invalid');
    }
  }
}
