import { Routes } from '@angular/router';
import { PostListComponent } from './core/posts/post-list/post-list.component';
import { AddPostComponent } from './core/posts/add-post/add-post.component';
import { AuthService } from './shared/services/auth.service';
import { LoginComponent } from './core/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: PostListComponent, canActivate: [AuthGuard]},
    {path: 'add-post', component: AddPostComponent, canActivate: [AuthGuard]}
];
