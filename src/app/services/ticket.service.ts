import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AssignTicketRequest,
  ChangeStatusRequest,
  CreateTicketRequest,
  Ticket,
  TicketStatus
} from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5093/api/Tickets';

  create(data: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, data);
  }

  getAll(building = '', status: TicketStatus | '' = ''): Observable<Ticket[]> {
    let params = new HttpParams();

    if (building.trim()) {
      params = params.set('building', building.trim());
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Ticket[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  assign(id: number, data: AssignTicketRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/${id}/assign`,
      data
    );
  }

  changeStatus(
    id: number,
    data: ChangeStatusRequest
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/${id}/status`,
      data
    );
  }
}
