import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  error = '';
  success = '';

  // These are the roles supported by the backend UserRole enum.
  readonly roles: UserRole[] = ['Student', 'Technician', 'Admin'];

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    role: ['Student' as UserRole, Validators.required]
  });

  submit(): void {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (value.password !== value.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.auth.register({
      fullName: value.fullName,
      email: value.email,
      password: value.password,
      role: value.role
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful. Redirecting to login...';

        setTimeout(() => this.router.navigateByUrl('/login'), 900);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Registration failed.';
      }
    });
  }
}
