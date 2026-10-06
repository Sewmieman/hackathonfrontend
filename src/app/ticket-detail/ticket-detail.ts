import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { TicketService } from '../services/ticket.service';
import { Ticket, TicketStatus } from '../models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css'
})
export class TicketDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ticketService = inject(TicketService);

  ticket?: Ticket;
  error = '';
  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Invalid ticket id.';
      this.loading = false;
      return;
    }

    this.ticketService.getById(id).subscribe({
      next: ticket => {
        this.ticket = ticket;
        this.loading = false;
      },
      error: err => {
        this.error = typeof err?.error === 'string'
          ? err.error
          : 'Unable to load ticket.';
        this.loading = false;
      }
    });
  }

  statusLabel(status: TicketStatus): string {
    return status === 'InProgress' ? 'In Progress' : status;
  }
}
