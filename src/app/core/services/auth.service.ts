import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'AUTH_USERS';
  private readonly JWT_TOKEN = 'JWT_TOKEN';

  constructor(private router: Router) {}

  login(user: { email: string; password: string }): Observable<any> {
    const users = this.getAllUsers();
    const matchedUser = users.find(u => u.email === user.email && u.password === user.password);

    if (matchedUser) {
      const token = this.generateJWT(matchedUser);
      return of({ token })
        .pipe(
          delay(1000),
          tap(response => this.storeTokens(response))
        );
    }

    return throwError(() => new Error('Invalid credentials'));
  }

  signup(user: { name: string; email: string; password: string }): Observable<any> {
    const users = this.getAllUsers();
    const existingUser = users.find(u => u.email === user.email);

    if (existingUser) {
      return throwError(() => new Error('Email already exists'));
    }

    const newUsers = [...users, user];
    localStorage.setItem(this.USERS_KEY, JSON.stringify(newUsers));

    return of({ success: true, user }).pipe(delay(1000));
  }

  logout(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  getJwtToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private storeTokens(tokens: any): void {
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
  }

  private generateJWT(user: any): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.email,
      name: user.name,
      email: user.email,
      exp: new Date().getTime() + 3600000
    }));
    const signature = btoa('secret');
    return `${header}.${payload}.${signature}`;
  }

  private getAllUsers(): any[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
