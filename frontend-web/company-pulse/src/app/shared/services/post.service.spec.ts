import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { environment } from '../../../environments/environment.development';
import { PostRequest } from '../../core/posts/add-post/add-post.component';
import { Post } from '../models/post.model';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request when addPost is called', () => {
    const mockPostRequest: PostRequest = {
      title: 'Test Post',
      content: 'This is a test post',
      author: 'testUser',
      isDraft: false,
    };

    service.addPost(mockPostRequest).subscribe();

    const req = httpMock.expectOne(service.url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPostRequest);
    req.flush(null);
  });

  it('should send a GET request to fetch drafts by author', () => {
    const mockDrafts: Post[] = [
      { id: 1, title: 'Draft 1', content: 'Draft Content 1', author: 'testUser', createdAt: new Date(), status: 'draft' },
    ];

    service.getDraftsByAuthor('testUser').subscribe((drafts) => {
      expect(drafts).toEqual(mockDrafts);
    });

    const req = httpMock.expectOne(`${service.url}/drafts/testUser`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDrafts);
  });

  it('should send a GET request to fetch all posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', content: 'Content 1', author: 'testUser', createdAt: new Date(), status: 'published' },
    ];

    service.getPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(service.url);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should send a GET request to fetch a post by ID', () => {
    const mockPost: Post = { id: 1, title: 'Post 1', content: 'Content 1', author: 'testUser', createdAt: new Date(), status: 'published' };

    service.getPostById('1').subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${service.url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should send a PUT request to update a post', () => {
    const mockPostRequest: PostRequest = {
      title: 'Updated Post',
      content: 'Updated Content',
      author: 'testUser',
      isDraft: false,
    };

    service.updatePost('1', mockPostRequest).subscribe();

    const req = httpMock.expectOne(`${service.url}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPostRequest);
    req.flush(null);
  });
});