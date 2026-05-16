import { api } from '../api';
import type { User } from '../../types';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'owner' | 'helper';
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/login', { email, password }),

  signup: (payload: SignupPayload) =>
    api.post<AuthResponse>('/api/auth/signup', payload),

  logout: () => api.post<void>('/api/auth/logout'),

  getMe: () => api.get<User>('/api/users/me'),

  updateMe: (payload: Partial<Pick<User, 'firstName' | 'lastName'>>) =>
    api.patch<User>('/api/users/me', payload),
};
