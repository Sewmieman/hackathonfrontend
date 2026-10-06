import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { TicketService } from '../services/ticket.service';
import { Ticket, TicketStatus } from '../models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketList implements OnInit {
  private readonly ticketService = inject(TicketService);

  tickets: Ticket[] = [];
  loading = false;
  error = '';

  building = '';
  status: TicketStatus | '' = '';

  readonly statuses: TicketStatus[] = [
    'New',
    'Assigned',
    'InProgress',
    'Resolved'
  ];

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
      error: err => {
        this.loading = false;
        this.error = typeof err?.error === 'string'
          ? err.error
          : 'Unable to load tickets.';
      }
    });
  }

  statusLabel(status: TicketStatus): string {
    return status === 'InProgress' ? 'In Progress' : status;
  }
}
