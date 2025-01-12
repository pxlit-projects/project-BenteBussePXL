import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { ReviewPostComponent } from './review-post.component';
import { ReviewService } from '../../../shared/services/review.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Post } from '../../../shared/models/post.model';
import { Review } from '../../../shared/models/review.model';

class MockAuthService {
  username = new BehaviorSubject<string | null>('testUser');
}


describe('ReviewPostComponent', () => {
  let component: ReviewPostComponent;
  let fixture: ComponentFixture<ReviewPostComponent>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockAuthService: MockAuthService;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockAuthService = new MockAuthService();
    mockReviewService = jasmine.createSpyObj('ReviewService', [
      'getPosts',
      'getReviewedPosts',
      'updatePost'
    ]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['createNotification']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
  
    // Ensure default returns for mock methods
    mockReviewService.getPosts.and.returnValue(of([]));
    mockReviewService.getReviewedPosts.and.returnValue(of([]));
  
    await TestBed.configureTestingModule({
      imports: [ReviewPostComponent],
      providers: [
        { provide: ReviewService, useValue: mockReviewService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialog, useValue: mockMatDialog },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(ReviewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts and reviews on init', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Content 1', author: 'author1', createdAt: new Date(), status: 'Pending' },
    ];
    const mockReviews: Review[] = [
      { id: 1, postId: 1, comment: 'Approved', status: "approved", reviewer: 'reviewer1', reviewedAt: new Date(), postTitle: 'Post 1' },
    ];

    mockReviewService.getPosts.and.returnValue(of(mockPosts));
    mockReviewService.getReviewedPosts.and.returnValue(of(mockReviews));

    component.ngOnInit();

    expect(mockReviewService.getPosts).toHaveBeenCalled();
    expect(mockReviewService.getReviewedPosts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPosts);
    expect(component.reviewedPosts).toEqual(mockReviews);
  });

  it('should approve a post and send notification', () => {
    const mockPost: Post = { id: 1, title: 'Post 1', content: 'Content 1', author: 'author1', createdAt: new Date(), status: 'Pending' };

    mockReviewService.updatePost.and.returnValue(of({}));
    mockNotificationService.createNotification.and.returnValue(of({}));

    component.approve(mockPost);

    expect(mockReviewService.updatePost).toHaveBeenCalledWith(
      mockPost.id,
      mockPost.title,
      true,
      '',
      'testUser',
      mockPost.author
    );
    expect(mockNotificationService.createNotification).toHaveBeenCalled();
  });

  it('should reject a post and send notification', () => {
    const mockPost: Post = { id: 1, title: 'Post 1', content: 'Content 1', author: 'author1', createdAt: new Date(), status: 'Pending' };
    const dialogRef = { afterClosed: () => of('Rejection reason') };

    mockMatDialog.open.and.returnValue(dialogRef as any);
    mockReviewService.updatePost.and.returnValue(of({}));
    mockNotificationService.createNotification.and.returnValue(of({}));

    component.reject(mockPost);

    expect(mockMatDialog.open).toHaveBeenCalled();
    expect(mockReviewService.updatePost).toHaveBeenCalledWith(
      mockPost.id,
      mockPost.title,
      false,
      'Rejection reason',
      'testUser',
      mockPost.author
    );
    expect(mockNotificationService.createNotification).toHaveBeenCalled();
  });
});