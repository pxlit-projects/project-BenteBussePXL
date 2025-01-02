import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-post',  // Changed from add-post to edit-post
  templateUrl: './edit-post.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrls: [
    "../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css",
    './edit-post.component.css'
  ]
})
export class EditPostComponent implements OnInit {
  postForm!: FormGroup;
  postId: string | null = null;
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    // Get post ID from route parameters
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.loadPost(this.postId);
    }
  }

  loadPost(id: string): void {
    this.postService.getPostById(id).subscribe(
      (post: Post) => {
        this.postForm.patchValue({
          title: post.title,
          content: post.content
        });
      }
    );
  }

  onUpdatePost(isDraft: boolean = false): void {
    if (this.postForm.valid && this.postId) {
      const { title, content } = this.postForm.value;
      const updateRequest = new PostRequest(
        title,
        content,
        this.authService.username.value!,
        isDraft
      );
      
      this.postService.updatePost(this.postId, updateRequest).subscribe(() => {
        this.router.navigate(['']);
      });
    } else {
      this.showErrorMessage('Invalid title or content');
    }
  }

  onSaveAsDraft(): void {
    this.onUpdatePost(true);
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
