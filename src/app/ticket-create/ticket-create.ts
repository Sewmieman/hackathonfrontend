import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../services/auth.service';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './ticket-create.html',
  styleUrl: './ticket-create.css'
})
export class TicketCreate {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);

  loading = false;
  error = '';
  success = '';

  readonly categories = [
    'Computer',
    'Wi-Fi',
    'Projector',
    'Electrical',
    'Plumbing',
    'Other'
  ];

  readonly buildings = [
    'Science Building',
    'Main Building',
    'Library',
    'Administration Building',
    'ICT Building',
    'Other'
  ];

  readonly form = this.fb.nonNullable.group({
    category: ['', Validators.required],
    building: ['', Validators.required],
    room: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  submit(): void {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.auth.getUser();
    if (!user) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.loading = true;

    this.ticketService.create({
      ...this.form.getRawValue(),
      reporterName: user.fullName
    }).subscribe({
      next: ticket => {
        this.loading = false;
        this.success = `Ticket #${ticket.id} created successfully.`;
        this.form.reset();
        setTimeout(() => this.router.navigate(['/tickets', ticket.id]), 700);
      },
      error: err => {
        this.loading = false;
        this.error = this.extractError(err, 'Unable to create ticket.');
      }
    });
  }

  private extractError(err: any, fallback: string): string {
    if (typeof err?.error === 'string') return err.error;
    return err?.error?.message ?? fallback;
  }
}
