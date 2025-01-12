import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { environment } from '../../../environments/environment.development';
import { CommentRequest } from '../../core/posts/post-detail/post-detail.component';
import { Comment } from '../models/comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request when addComment is called', () => {
    const mockCommentRequest: CommentRequest = {
      content: 'Test Comment',
      postId: 1,
      author: 'testUser',
    };

    service.addComment(mockCommentRequest).subscribe();

    const req = httpMock.expectOne(service.url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      content: 'Test Comment',
      postId: 1,
      author: 'testUser',
    });
    req.flush(null);
  });

  it('should send a GET request when getCommentsByPostId is called', () => {
    const mockComments: Comment[] = [
      { id: 1, content: 'Test Comment', postId: 1, author: 'testUser', createdAt: new Date(), isEdited: false },
    ];

    service.getCommentsByPostId(1).subscribe((comments) => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${service.url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('should send a PUT request when updateComment is called', () => {
    const mockComment: Comment = {
      id: 1,
      content: 'Updated Comment',
      postId: 1,
      author: 'testUser',
      createdAt: new Date(),
      isEdited: false,
    };

    service.updateComment(mockComment).subscribe();

    const req = httpMock.expectOne(`${service.url}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ content: 'Updated Comment' });
    req.flush(null);
  });

  it('should send a DELETE request when deleteComment is called', () => {
    service.deleteComment(1).subscribe();

    const req = httpMock.expectOne(`${service.url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});