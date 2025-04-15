import {Component, inject} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {BookService} from './core/services/book.service';
import {AuthService} from './core/services/auth.service';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title='E-Book-Dashboard';
  authService = inject(AuthService);
  isLoggedIn = false;
  hideLogout = false;

  constructor(private router: Router) {
    this.checkLoginStatus();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        this.hideLogout = currentUrl.includes('/login') || currentUrl.includes('/signup');

        this.checkLoginStatus(); // recheck token on every route
      });
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn()
  }

  logout() {
  this.isLoggedIn = false;
  this.authService.logout();
  }

}
