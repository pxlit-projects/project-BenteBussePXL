import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrls: [  "../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css",
    './add-post.component.css']
})
export class AddPostComponent implements OnInit {
  postForm!: FormGroup;
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  onAddPost(isDraft : boolean = false): void {
    if (this.postForm.valid) {
      const { title, content } = this.postForm.value;
      console.log('Author:', this.authService.username.value);
      const newPost = new PostRequest(title, content, this.authService.username.value!, isDraft); 
      console.log('Add post', newPost);
      this.postService.addPost(newPost).subscribe(() => {
        this.router.navigate(['']);
      });
    } else {
      this.showErrorMessage('Invalid title or content');
    }
  }

  onSaveAsDraft(): void {
    console.log('Save as draft');
    this.onAddPost(true);
  }

  private showErrorMessage(message: string): void {
    let errorDiv = document.getElementById('error');
    if (errorDiv) {
      errorDiv.textContent = message;
    }
  }
}

export class PostRequest {
  title: string;
  content: string;
  author: string;
  isDraft: boolean;

  constructor(title: string, content: string, author: string, isDraft: boolean) {
    this.title = title;
    this.content = content;
    this.author = author;
    this.isDraft = isDraft;
  }
}
