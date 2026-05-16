import { api } from '../api';
import type { Booking } from '../../types';

export interface BookingsPage {
  bookings: Booking[];
  total: number;
}

export const bookingsService = {
  create: (payload: { jobId: string; proposedBudget?: number; deliverables?: string }) =>
    api.post<Booking>('/api/bookings', payload),

  getMy: (params?: { role?: 'worker' | 'client'; status?: string; limit?: number; page?: number }) => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
    return api.get<BookingsPage>(`/api/bookings/my${q ? `?${q}` : ''}`);
  },

  getById: (id: string) => api.get<Booking>(`/api/bookings/${id}`),

  accept: (id: string, payload?: { acceptedBudget?: number }) =>
    api.patch<Booking>(`/api/bookings/${id}/accept`, payload ?? {}),

  complete: (id: string) => api.patch<Booking>(`/api/bookings/${id}/complete`, {}),

  cancel: (id: string) => api.patch<Booking>(`/api/bookings/${id}/cancel`, {}),
};
