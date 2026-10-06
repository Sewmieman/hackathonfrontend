import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  error = '';

  readonly roles: UserRole[] = [
    'Student',
    'Technician',
    'Admin'
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],

    password: ['', Validators.required],

    role: [
      'Student' as UserRole,
      Validators.required
    ]
  });

  submit(): void {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.auth.login(this.form.getRawValue()).subscribe({
      next: response => {
        this.loading = false;

        this.router.navigateByUrl(
          response.role === 'Admin'
            ? '/admin'
            : '/dashboard'
        );
      },

      error: (err: unknown) => {
        this.loading = false;

        if (err instanceof Error) {
          this.error = err.message;
        } else if (
          typeof err === 'object' &&
          err !== null &&
          'error' in err
        ) {
          const httpError =
            err as {
              error?: {
                message?: string;
              } | string;
            };

          if (typeof httpError.error === 'string') {
            this.error = httpError.error;
          } else {
            this.error =
              httpError.error?.message ??
              'Invalid email, password, or role.';
          }
        } else {
          this.error =
            'Invalid email, password, or role.';
        }
      }
    });
  }
}