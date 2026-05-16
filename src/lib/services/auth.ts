import { api } from '../api';
import type { User } from '../../types';

// Actual backend response shape for login/signup
interface RawAuthResponse {
  status: string;
  data: {
    token: string;
    refreshToken: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: 'worker' | 'client' | 'admin';
      status: string;
      rating: number;
      reviewCount: number;
      createdAt: string;
    };
  };
}

// Normalised shape the rest of the app uses
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
  role: 'client' | 'worker';
}

function normalise(raw: RawAuthResponse): AuthResponse {
  const u = raw.data.user;
  return {
    accessToken: raw.data.token,
    refreshToken: raw.data.refreshToken,
    user: {
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      role: u.role === 'client' ? 'owner' : 'helper', // map to internal role names
      verified: true,
      bvnVerified: false,
      createdAt: u.createdAt,
    },
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const raw = await api.post<RawAuthResponse>('/api/auth/login', { email, password });
    return normalise(raw);
  },

  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const raw = await api.post<RawAuthResponse>('/api/auth/signup', payload);
    return normalise(raw);
  },

  logout: () => api.post<void>('/api/auth/logout'),

  getMe: async (): Promise<User> => {
    const raw = await api.get<{ status: string; data: { user: RawAuthResponse['data']['user'] } }>('/api/users/me');
    const u = raw.data.user;
    return {
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      role: u.role === 'client' ? 'owner' : 'helper',
      verified: true,
      bvnVerified: false,
      createdAt: u.createdAt,
    };
  },

  updateMe: (payload: Partial<Pick<User, 'firstName' | 'lastName'> & { bio?: string; profileImage?: string }>) =>
    api.patch<{ status: string }>('/api/users/me', payload),
};
