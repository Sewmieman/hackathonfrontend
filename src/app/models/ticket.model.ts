export type TicketStatus = 'New' | 'Assigned' | 'InProgress' | 'Resolved';

export interface TicketHistory {
  id: number;
  ticketId: number;
  fromStatus: TicketStatus;
  toStatus: TicketStatus;
  changedAt: string;
  changedBy: string;
}

export interface Ticket {
  id: number;
  category: string;
  building: string;
  room: string;
  description: string;
  technicianName: string | null;
  status: TicketStatus;
  reporterName: string;
  createdAt: string;
  history?: TicketHistory[];
}

export interface CreateTicketRequest {
  category: string;
  building: string;
  room: string;
  description: string;
  reporterName: string;
}

export interface AssignTicketRequest {
  technicianName: string;
}

export interface ChangeStatusRequest {
  status: TicketStatus;
  changedBy: string;
}
