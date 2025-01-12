import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { environment } from '../../../environments/environment.development';
import { Post } from '../models/post.model';
import { Review } from '../models/review.model';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService],
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to fetch pending posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Content 1', author: 'testUser', createdAt: new Date(), status: 'pending' },
    ];

    localStorage.setItem('username', 'testUser');
    service.getPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${service.url}/testUser/pending`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should send a GET request to fetch reviewed posts', () => {
    const mockReviews: Review[] = [
      { id: 1, postId: 1, comment: 'Looks good', status: "approved", reviewer: 'reviewerUser', postTitle: 'Post 1', reviewedAt: new Date() },
    ];

    localStorage.setItem('username', 'testUser');
    service.getReviewedPosts().subscribe((reviews) => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(`${service.url}/testUser/reviewed`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReviews);
  });

  it('should send a POST request to update a post', () => {
    const mockUpdateRequest = {
      id: 1,
      title: 'Post 1',
      approved: true,
      comment: 'Well written',
      reviewer: 'reviewerUser',
      author: 'testUser',
    };

    service
      .updatePost(
        mockUpdateRequest.id,
        mockUpdateRequest.title,
        mockUpdateRequest.approved,
        mockUpdateRequest.comment,
        mockUpdateRequest.reviewer,
        mockUpdateRequest.author
      )
      .subscribe();

    const req = httpMock.expectOne(`${service.url}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      postId: mockUpdateRequest.id,
      postTitle: mockUpdateRequest.title,
      approved: mockUpdateRequest.approved,
      comment: mockUpdateRequest.comment,
      reviewer: mockUpdateRequest.reviewer,
      author: mockUpdateRequest.author,
    });
    req.flush(null);
  });
});
