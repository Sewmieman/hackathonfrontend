import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5093/api/Auth';

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => this.saveSession(response))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.saveSession(response))
    );
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem('fixmycampus_token', response.token);
    localStorage.setItem('fixmycampus_user', JSON.stringify(response));
  }

  logout(): void {
    localStorage.removeItem('fixmycampus_token');
    localStorage.removeItem('fixmycampus_user');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('fixmycampus_token');
  }

  getUser(): AuthResponse | null {
    const value = localStorage.getItem('fixmycampus_user');
    if (!value) return null;

    try {
      return JSON.parse(value) as AuthResponse;
    } catch {
      this.logout();
      return null;
    }
  }

  getFullName(): string {
    return this.getUser()?.fullName ?? '';
  }

  getEmail(): string {
    return this.getUser()?.email ?? '';
  }

  getRole(): string {
    return this.getUser()?.role ?? '';
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  isTechnician(): boolean {
    return this.getRole() === 'Technician';
  }
}
