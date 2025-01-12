import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { CommentItemComponent } from './comment-item.component';
import { AuthService } from '../../../shared/services/auth.service';
import { CommentService } from '../../../shared/services/comment.service';
import { Comment } from '../../../shared/models/comment.model';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

describe('CommentItemComponent', () => {
  let component: CommentItemComponent;
  let fixture: ComponentFixture<CommentItemComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let commentService: jasmine.SpyObj<CommentService>;

  const mockComment: Comment = {
    id: 1,
    content: 'Test comment',
    author: 'testUser',
    createdAt: new Date(),
    isEdited: false,
    postId: 3
  };

  beforeEach(async () => {
    // Create spies for services
    authService = jasmine.createSpyObj('AuthService', [], {
      username: new BehaviorSubject<string | null>('testUser')
    });

    commentService = jasmine.createSpyObj('CommentService', 
      ['updateComment', 'deleteComment'],
      { commentChanged: new BehaviorSubject<string>('') }
    );

    await TestBed.configureTestingModule({
      imports: [
        CommentItemComponent,
        ReactiveFormsModule,
        MatIconModule,
        RelativeTimePipe
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: CommentService, useValue: commentService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentItemComponent);
    component = fixture.componentInstance;
    component.comment = mockComment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize form with comment content', () => {
      expect(component.commentForm.get('content')?.value).toBe(mockComment.content);
    });
  });

  describe('isAuthor', () => {
    it('should return true when current user is author', () => {
      expect(component.isAuthor()).toBeTrue();
    });

    it('should return false when current user is not author', () => {
      authService = jasmine.createSpyObj('AuthService', [], {
        username: new BehaviorSubject<string | null>('testUser')
      });      
      expect(component.isAuthor()).toBeFalse();
    });
  });

  describe('enableEdit', () => {
    it('should enable editing mode and set form value', () => {
      component.enableEdit();
      expect(component.isEditing).toBeTrue();
      expect(component.commentForm.get('content')?.value).toBe(mockComment.content);
    });
  });

  describe('cancelEdit', () => {
    it('should disable editing mode', () => {
      component.isEditing = true;
      component.cancelEdit();
      expect(component.isEditing).toBeFalse();
    });
  });

  describe('saveEdit', () => {
    beforeEach(() => {
      component.isEditing = true;
    });

    it('should not update if content is empty', () => {
      component.commentForm.patchValue({ content: '   ' });
      component.saveEdit();
      expect(commentService.updateComment).not.toHaveBeenCalled();
    });

    it('should update comment successfully', () => {
      const newContent = 'Updated content';
      commentService.updateComment.and.returnValue(of({}));
      
      component.commentForm.patchValue({ content: newContent });
      component.saveEdit();

      expect(commentService.updateComment).toHaveBeenCalledWith({
        ...mockComment,
        content: newContent,
        isEdited: true
      });
      expect(component.comment.content).toBe(newContent);
      expect(component.isEditing).toBeFalse();
    });

    it('should handle update error', () => {
      const consoleSpy = spyOn(console, 'error');
      commentService.updateComment.and.returnValue(throwError(() => new Error('Update failed')));
      
      component.commentForm.patchValue({ content: 'New content' });
      component.saveEdit();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to edit comment');
      expect(component.isEditing).toBeTrue();
    });
  });

  describe('deleteComment', () => {
    it('should delete comment successfully', () => {
      commentService.deleteComment.and.returnValue(of({}));
      
      component.deleteComment();

      expect(commentService.deleteComment).toHaveBeenCalledWith(mockComment.id);
      expect(commentService.commentChanged.asObservable).toBe(mockComment.id.toString());
    });

    it('should handle delete error', () => {
      const consoleSpy = spyOn(console, 'error');
      commentService.deleteComment.and.returnValue(throwError(() => new Error('Delete failed')));
      
      component.deleteComment();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to delete comment');
    });
  });

  // Test form validation
  describe('Form Validation', () => {
    it('should initialize with valid form', () => {
      expect(component.commentForm.valid).toBeTrue();
    });

    it('should update form value', () => {
      const newContent = 'New test content';
      component.commentForm.patchValue({ content: newContent });
      expect(component.commentForm.get('content')?.value).toBe(newContent);
    });
  });
});