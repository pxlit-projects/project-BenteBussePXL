import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DraftsComponent } from './drafts.component';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Post } from '../../../shared/models/post.model';

class MockPostService {
  getDraftsByAuthor = jasmine.createSpy('getDraftsByAuthor').and.returnValue(of([
    { id: 1, title: 'Draft 1', content: 'Content 1', author: 'testUser', createdAt: new Date() },
    { id: 2, title: 'Draft 2', content: 'Content 2', author: 'testUser', createdAt: new Date() },
  ]));
}

class MockAuthService {
  username = new BehaviorSubject<string | null>('testUser');
}

describe('DraftsComponent', () => {
  let component: DraftsComponent;
  let fixture: ComponentFixture<DraftsComponent>;
  let mockAuthService: MockAuthService;
  let mockPostService: MockPostService;

  beforeEach(async () => {
    mockPostService = new MockPostService();
    mockAuthService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [DraftsComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch drafts on init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(mockPostService.getDraftsByAuthor).toHaveBeenCalledWith('testUser');
    component.posts.subscribe((posts) => {
      expect(posts.length).toBe(2);
      expect(posts[0].title).toBe('Draft 1');
    });
  });

  it('should navigate to edit post on onEdit', () => {
    const routerSpy = spyOn(component.router, 'navigate');
    component.onEdit(1);

    expect(routerSpy).toHaveBeenCalledWith(['/edit-post', 1]);
  });

  it('should track posts by ID', () => {
    const result = component.trackByTitle(0, { id: 1, title: 'Draft 1', content: 'Content 1', author: 'testUser', createdAt: new Date() } as Post);
    expect(result).toBe(1);
  });
});