import { Routes } from '@angular/router';

import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { TicketCreate } from './ticket-create/ticket-create';
import { TicketList } from './ticket-list/ticket-list';
import { TicketDetail } from './ticket-detail/ticket-detail';
import { MyTickets } from './my-tickets/my-tickets';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [

  // Default page
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  // Authentication
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },

  // Authenticated user pages
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'tickets',
    component: TicketList,
    canActivate: [authGuard]
  },
  {
    path: 'tickets/create',
    component: TicketCreate,
    canActivate: [authGuard]
  },
  {
    path: 'tickets/:id',
    component: TicketDetail,
    canActivate: [authGuard]
  },
  {
    path: 'my-tickets',
    component: MyTickets,
    canActivate: [authGuard]
  },

  // Admin only
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [adminGuard]
  },

  // Unknown URL
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];