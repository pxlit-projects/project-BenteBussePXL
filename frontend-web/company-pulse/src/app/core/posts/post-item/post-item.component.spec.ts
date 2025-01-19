import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostItemComponent } from './post-item.component';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { CommentService } from '../../../shared/services/comment.service';

describe('PostItemComponent', () => {
  let component: PostItemComponent;
  let fixture: ComponentFixture<PostItemComponent>;
  const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
  const commentServiceMock = jasmine.createSpyObj('CommentService', ['getCommentsByPostId']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostItemComponent,
        MatCard,
        MatCardFooter,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatCardSubtitle,
      ],
      providers: [
        { provide: MatDialog, useValue: matDialogMock },
        { provide: CommentService, useValue: commentServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostItemComponent);
    component = fixture.componentInstance;

    component.post = {
      id: 1,
      title: 'Test Post',
      content: 'This is a test post',
      author: 'Test Author',
      createdAt: new Date(),
      status: 'published',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
