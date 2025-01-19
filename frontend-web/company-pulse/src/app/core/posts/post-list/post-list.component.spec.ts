import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { PostListComponent } from './post-list.component';
import { PostService } from '../../../shared/services/post.service';
import { CommentService } from '../../../shared/services/comment.service';
import { Post } from '../../../shared/models/post.model';
import { Filter } from '../../../shared/models/filter.model';
import { CommonModule } from '@angular/common';
import { PostItemComponent } from '../post-item/post-item.component';
import { FilterComponent } from '../filter/filter.component';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let commentService: jasmine.SpyObj<CommentService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockPosts: Post[] = [
    {
      id: 1,
      content: 'Test post 1',
      author: 'user1',
      createdAt: new Date('2024-01-02'),
      title: 'Title 1',
      status: 'published',
    },
    {
      id: 2,
      content: 'Test post 2',
      author: 'user2',
      createdAt: new Date('2024-01-01'),
      title: 'Title 2',
      status: 'draft',
    },
    {
      id: 3,
      content: 'Another test',
      author: 'user1',
      createdAt: new Date('2024-01-03'),
      title: 'Title 3',
      status: 'published',
    }
  ];

  beforeEach(async () => {
    postService = jasmine.createSpyObj('PostService', ['getPosts']);
    commentService = jasmine.createSpyObj('CommentService', ['getCommentsByPostId']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        PostListComponent,
        CommonModule,
        PostItemComponent,
        FilterComponent
      ],
      providers: [
        { provide: PostService, useValue: postService },
        { provide: CommentService, useValue: commentService },
        { provide: MatDialog, useValue: dialog }
      ]
    }).compileComponents();

    postService.getPosts.and.returnValue(of(mockPosts));

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load and sort posts on init', () => {
      expect(component.posts).toBeDefined();
      expect(component.posts.length).toBe(3);
      
      // Verify sorting (newest first)
      expect(component.posts[0].id).toBe(3);
      expect(component.posts[1].id).toBe(1);
      expect(component.posts[2].id).toBe(2);
    });

    it('should handle error when loading posts', () => {
      postService.getPosts.and.returnValue(throwError(() => new Error('Load failed')));
      
      component.ngOnInit();
      
      expect(component.error).toBe('Failed to load posts');
      expect(component.loading).toBeFalse();
    });

    it('should set loading state correctly', () => {
      component.ngOnInit();
      expect(component.loading).toBeFalse();
    });

    it('should store original posts for filtering', () => {
      expect(component.originalPosts).toEqual(mockPosts);
    });
  });

  describe('filtering', () => {
    it('should filter by content case-insensitive', () => {
      const filter: Filter = {
        content: 'TEST',
        author: '',
        createdAt: undefined
      };
      
      component.onFilterChanged(filter);
      expect(component.posts.length).toBe(3);
      expect(component.posts.every(post => 
        post.content.toLowerCase().includes(filter.content.toLowerCase())
      )).toBeTrue();
    });

    it('should filter by author case-insensitive', () => {
      const filter: Filter = {
        content: '',
        author: 'USER1',
        createdAt: undefined
      };
      
      component.onFilterChanged(filter);
      
      expect(component.posts.length).toBe(2);
      expect(component.posts.every(post => 
        post.author.toLowerCase().includes(filter.author.toLowerCase())
      )).toBeTrue();
    });

    it('should filter by date', () => {
      const filter: Filter = {
        content: '',
        author: '',
        createdAt: new Date('2024-01-01')
      };
      
      component.onFilterChanged(filter);
      
      expect(component.posts.length).toBe(1);
      expect(component.posts[0].id).toBe(2);
    });

    it('should combine multiple filter criteria', () => {
      const filter: Filter = {
        content: 'test',
        author: 'user1',
        createdAt: new Date('2024-01-02')
      };
      
      component.onFilterChanged(filter);
      
      expect(component.posts.length).toBe(1);
      expect(component.posts[0].id).toBe(1);
    });

    it('should return all posts when filter is empty', () => {
      const filter: Filter = {
        content: '',
        author: '',
        createdAt: undefined
      };
      
      component.onFilterChanged(filter);
      
      expect(component.posts.length).toBe(mockPosts.length);
    });

    it('should maintain sort order after filtering', () => {
      const filter: Filter = {
        content: 'test',
        author: '',
        createdAt: undefined
      };
      
      component.onFilterChanged(filter);
      
      expect(component.posts.length).toBe(3);
      expect(new Date(component.posts[0].createdAt).getTime())
        .toBeGreaterThan(new Date(component.posts[1].createdAt).getTime());
    });

    it('should return no posts when no matches found', () => {
      const filter: Filter = {
        content: 'nonexistent',
        author: '',
        createdAt: undefined
      };
      
      component.onFilterChanged(filter);
      
      expect(component.posts.length).toBe(0);
    });
  });
});