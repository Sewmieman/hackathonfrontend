import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { TicketService } from '../services/ticket.service';
import { Ticket, TicketStatus } from '../models/ticket.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private readonly ticketService = inject(TicketService);

  tickets: Ticket[] = [];
  building = '';
  status: TicketStatus | '' = '';
  technicianNames: Record<number, string> = {};
  loading = false;
  error = '';

  readonly statuses: TicketStatus[] = ['New', 'Assigned', 'InProgress', 'Resolved'];

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.error = '';

    this.ticketService.getAll(this.building, this.status).subscribe({
      next: data => {
        this.tickets = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load tickets.';
        this.loading = false;
      }
    });
  }

  assign(ticket: Ticket): void {
    const name = (this.technicianNames[ticket.id] ?? '').trim();

    if (!name) {
      this.error = 'Enter a technician name before assigning.';
      return;
    }

    this.ticketService.assign(ticket.id, { technicianName: name }).subscribe({
      next: () => {
        delete this.technicianNames[ticket.id];
        this.loadTickets();
      },
      error: err => {
        this.error = typeof err?.error === 'string'
          ? err.error
          : err?.error?.message ?? 'Unable to assign ticket.';
      }
    });
  }

  moveNext(ticket: Ticket): void {
    const nextStatus: TicketStatus | null =
      ticket.status === 'Assigned'
        ? 'InProgress'
        : ticket.status === 'InProgress'
          ? 'Resolved'
          : null;

    if (!nextStatus) return;

    this.ticketService.changeStatus(ticket.id, {
      status: nextStatus,
      changedBy: 'Admin'
    }).subscribe({
      next: () => this.loadTickets(),
      error: err => {
        this.error = typeof err?.error === 'string'
          ? err.error
          : err?.error?.message ?? 'Invalid status transition.';
      }
    });
  }

  nextLabel(status: TicketStatus): string {
    if (status === 'Assigned') return 'Start Work';
    if (status === 'InProgress') return 'Resolve';
    return '';
  }

  statusLabel(status: TicketStatus): string {
    return status === 'InProgress' ? 'In Progress' : status;
  }
}
