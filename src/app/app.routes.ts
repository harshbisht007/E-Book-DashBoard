import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {SignupComponent} from './pages/signup/signup.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {authGuard} from './auth.guard';
import {BookReaderComponent} from './pages/book-reader/book-reader.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Signup',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [authGuard]
  },
  {
    path: 'read/:id',
    component: BookReaderComponent,
    title: 'Read Your Book',
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
