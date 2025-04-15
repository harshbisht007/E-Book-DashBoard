import { Component } from '@angular/core';
import {
  NonNullableFormBuilder,
  Validators,
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        name: this.fb.control('', Validators.required),
        email: this.fb.control('', [Validators.required, Validators.email]),
        password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: this.fb.control('', Validators.required),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { name, email, password } = this.signupForm.getRawValue();

    this.authService.signup({ name, email, password })
      .pipe(
        catchError(error => {
          this.errorMessage = error?.message ?? 'Signup failed. Please try again.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(response => {
        if (response?.success) {
          this.authService.login({ email, password }).subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
        }
      });
  }
}
