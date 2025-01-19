import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPostComponent, PostRequest } from './edit-post.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { Post } from '../../../shared/models/post.model';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPostById', 'updatePost']);
    postServiceSpy.getPostById.and.returnValue(of({
      id: 1,
      title: 'Mock Title',
      content: 'Mock Content',
      author: 'Mock Author',
      createdAt: new Date(),
      status: 'Draft'
    }));
  
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      username: new BehaviorSubject<string | null>('testUser')
    });
  
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };
  
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        EditPostComponent
      ],
      providers: [
        FormBuilder,
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
  });  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    component.ngOnInit();
    expect(component.postForm.get('title')?.value).toBe('Mock Title');
    expect(component.postForm.get('content')?.value).toBe('Mock Content');
  });

  it('should load post data on init when postId exists', () => {
    const mockPost: Post = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'testUser',
      createdAt: new Date(),
      status: "Draft"
    };

    postService.getPostById.and.returnValue(of(mockPost));
    
    component.ngOnInit();
    fixture.detectChanges();

    expect(postService.getPostById).toHaveBeenCalledWith('1');
    expect(component.postForm.get('title')?.value).toBe(mockPost.title);
    expect(component.postForm.get('content')?.value).toBe(mockPost.content);
  });

  it('should update post and navigate on valid form submission', () => {
    const mockPost = new PostRequest('Updated Post', 'Updated Content', 'testUser', false);

    component.ngOnInit();
    component.postForm.setValue({
      title: mockPost.title,
      content: mockPost.content
    });

    postService.updatePost.and.returnValue(of({}));
    component.onUpdatePost();

    expect(postService.updatePost).toHaveBeenCalledWith('1', mockPost);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should not update post on invalid form submission', () => {
    component.ngOnInit();
    component.postForm.setValue({
      title: '',
      content: ''
    });

    const errorSpy = spyOn(component as any, 'showErrorMessage');
    component.onUpdatePost();

    expect(postService.updatePost).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Invalid title or content');
  });

  it('should save post as draft', () => {
    const mockPost = new PostRequest('Draft Post', 'Draft Content', 'testUser', true);
    component.ngOnInit();
    component.postForm.setValue({
      title: mockPost.title,
      content: mockPost.content
    });

    postService.updatePost.and.returnValue(of({}));
    component.onSaveAsDraft();

    expect(postService.updatePost).toHaveBeenCalledWith('1', mockPost);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should show error message when element exists', () => {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error';
    document.body.appendChild(errorDiv);

    const errorMessage = 'Test error message';
    (component as any).showErrorMessage(errorMessage);

    document.body.removeChild(errorDiv);
  });
});