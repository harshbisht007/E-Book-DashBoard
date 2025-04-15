import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {catchError, finalize, of} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value)
      .pipe(
        catchError(error => {
          this.errorMessage = error.message || 'Login failed. Please check your credentials.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(response => {
        if (response) {
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
