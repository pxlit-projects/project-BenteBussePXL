import { Routes } from '@angular/router';
import { PostListComponent } from './core/posts/post-list/post-list.component';
import { AddPostComponent } from './core/posts/add-post/add-post.component';
import { AuthService } from './shared/services/auth.service';
import { LoginComponent } from './core/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DraftsComponent } from './core/posts/drafts/drafts.component';
import { EditPostComponent } from './core/posts/edit-post/edit-post.component';
import { AdminGuard } from './guards/admin.guard';
import { ReviewPostComponent } from './core/reviews/review-post/review-post.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: PostListComponent, canActivate: [AuthGuard]},
    {path: 'add-post', component: AddPostComponent, canActivate: [AdminGuard]},
    {path: 'drafts', component: DraftsComponent , canActivate: [AdminGuard]},
    {path: 'edit-post/:id', component: EditPostComponent, canActivate: [AdminGuard]},
    {path: 'review-posts', component: ReviewPostComponent, canActivate: [AdminGuard]},
    {path: '**', redirectTo: ''}
];
