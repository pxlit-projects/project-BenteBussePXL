import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddPostComponent } from './add-post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, BehaviorSubject } from 'rxjs';

class MockPostService {
  addPost = jasmine.createSpy('addPost').and.returnValue(of(null));
}

class MockAuthService {
  username = new BehaviorSubject<string | null>('testUser');
}

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let mockPostService: MockPostService;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    mockPostService = new MockPostService();
    mockAuthService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [
        AddPostComponent, // Standalone components should be imported here
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule, // Mock the router for navigation
      ],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.postForm).toBeDefined();
    expect(component.postForm.get('title')).toBeTruthy();
    expect(component.postForm.get('content')).toBeTruthy();
  });

  it('should call addPost on PostService when onAddPost is called with valid form', () => {
    component.postForm.setValue({
      title: 'Test Title',
      content: 'Test Content',
    });

    component.onAddPost(false);

    expect(mockPostService.addPost).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Test Title',
        content: 'Test Content',
        author: 'testUser',
        isDraft: false,
      })
    );
  });

  it('should navigate to the correct route after adding a post', () => {
    const navigateSpy = spyOn(component.router, 'navigate');
    component.postForm.setValue({
      title: 'Test Title',
      content: 'Test Content',
    });

    component.onAddPost(false);

    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });

  it('should navigate to drafts after saving as draft', () => {
    const navigateSpy = spyOn(component.router, 'navigate');
    component.postForm.setValue({
      title: 'Draft Title',
      content: 'Draft Content',
    });

    component.onSaveAsDraft();

    expect(navigateSpy).toHaveBeenCalledWith(['drafts']);
  });
});

