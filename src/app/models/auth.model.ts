export type UserRole = 'Admin' | 'Technician' | 'Student';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
}
