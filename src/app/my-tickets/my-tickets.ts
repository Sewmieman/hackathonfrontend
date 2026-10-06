import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../services/auth.service';
import { TicketService } from '../services/ticket.service';
import { Ticket, TicketStatus } from '../models/ticket.model';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})
export class MyTickets implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly ticketService = inject(TicketService);

  tickets: Ticket[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    const fullName = this.auth.getFullName();

    this.ticketService.getAll().subscribe({
      next: tickets => {
        this.tickets = tickets.filter(t => t.reporterName === fullName);
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load your tickets.';
        this.loading = false;
      }
    });
  }

  statusLabel(status: TicketStatus): string {
    return status === 'InProgress' ? 'In Progress' : status;
  }
}
