import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { CommentRequest, PostDetailComponent } from './post-detail.component';
import { AuthService } from '../../../shared/services/auth.service';
import { CommentService } from '../../../shared/services/comment.service';
import { Comment } from '../../../shared/models/comment.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, DatePipe } from '@angular/common';
import { CommentItemComponent } from '../../comments/comment-item/comment-item.component';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<PostDetailComponent>>;
  let authService: jasmine.SpyObj<AuthService>;
  let commentService: jasmine.SpyObj<CommentService>;

  const mockComments: Comment[] = [
    {
      id: 1,
      content: 'Test comment 1',
      author: 'user1',
      createdAt: new Date(),
      isEdited: false,
      postId: 3
    },
    {
      id: 2,
      content: 'Test comment 2',
      author: 'user2',
      createdAt: new Date(),
      isEdited: false,
      postId: 3
    }
  ];

  const mockDialogData = {
    id: 1,
    comments: mockComments
  };

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    authService = jasmine.createSpyObj('AuthService', [], {
      username: new BehaviorSubject<string>('testUser')
    });

    commentService = jasmine.createSpyObj('CommentService', 
      ['addComment', 'getCommentsByPostId'],
      { commentChanged: new BehaviorSubject<string>('') }
    );

    await TestBed.configureTestingModule({
      imports: [
        PostDetailComponent,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        CommonModule,
        CommentItemComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: AuthService, useValue: authService },
        { provide: CommentService, useValue: commentService },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with comments from dialog data', () => {
      expect(component.comments).toEqual(mockComments);
    });

    it('should initialize form with empty comment', () => {
      expect(component.postForm.get('comment')?.value).toBe('');
    });

    it('should require comment field', () => {
      const commentControl = component.postForm.get('comment');
      expect(commentControl?.hasValidator(Validators.required)).toBeTrue();
    });
  });

  describe('comment subscription', () => {
    it('should remove comment when commentChanged emits', () => {
      const commentIdToRemove = 1;
      commentService.commentChanged.next(commentIdToRemove);
      
      expect(component.comments.find(c => c.id === commentIdToRemove)).toBeUndefined();
      expect(component.comments.length).toBe(1);
    });
  });

  describe('addComment', () => {
    beforeEach(() => {
      commentService.addComment.and.returnValue(of({}));
      commentService.getCommentsByPostId.and.returnValue(of([...mockComments, {
        id: 3,
        content: 'New comment',
        author: 'testUser',
        createdAt: new Date(),
        isEdited: false,
        postId: 3
      }]));
    });

    it('should not add comment if form is invalid', () => {
      component.postForm.patchValue({ comment: '' });
      component.addComment();
      expect(commentService.addComment).not.toHaveBeenCalled();
    });

    it('should not add comment if no user is logged in', () => {
      authService = jasmine.createSpyObj('AuthService', [], {
        username: new BehaviorSubject<string | null>('testUser')
      });   
      component.postForm.patchValue({ comment: 'Test comment' });
      component.addComment();
      expect(commentService.addComment).not.toHaveBeenCalled();
    });

    it('should add comment successfully', () => {
      const newComment = 'Test new comment';
      component.postForm.patchValue({ comment: newComment });
      
      component.addComment();

      expect(commentService.addComment).toHaveBeenCalledWith({
        postId: mockDialogData.id,
        content: newComment,
        author: 'testUser'
      });
      expect(commentService.getCommentsByPostId).toHaveBeenCalledWith(mockDialogData.id);
      expect(component.comments.length).toBe(3);
      expect(component.postForm.get('comment')?.value).toBe('');
    });

    it('should handle add comment error', () => {
      const consoleSpy = spyOn(console, 'error');
      commentService.addComment.and.returnValue(throwError(() => new Error('Add failed')));
      
      component.postForm.patchValue({ comment: 'Test comment' });
      component.addComment();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to add comment');
    });

    it('should handle fetch updated comments error', () => {
      const consoleSpy = spyOn(console, 'error');
      commentService.getCommentsByPostId.and.returnValue(throwError(() => new Error('Fetch failed')));
      
      component.postForm.patchValue({ comment: 'Test comment' });
      component.addComment();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch updated comments');
    });
  });

  describe('closeDialog', () => {
    it('should close dialog', () => {
      component.closeDialog();
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('CommentRequest class', () => {
    it('should create CommentRequest instance with correct properties', () => {
      const request = new CommentRequest(1, 'content', 'author');
      expect(request.postId).toBe(1);
      expect(request.content).toBe('content');
      expect(request.author).toBe('author');
    });
  });
});