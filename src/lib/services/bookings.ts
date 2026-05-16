import { api } from '../api';
import type { Booking } from '../../types';

export interface BookingsPage {
  bookings: Booking[];
  total: number;
}

function normalise(b: Record<string, unknown>): Booking {
  return { ...(b as Booking), id: (b._id as string) ?? (b.id as string) };
}

export const bookingsService = {
  create: async (payload: { jobId: string; proposedBudget?: number; deliverables?: string }) => {
    // Response: { status, data: { booking: { ... } } }
    const raw = await api.post<{
      status: string;
      data: { booking: Record<string, unknown> };
    }>('/api/bookings', payload);
    return normalise(raw.data.booking);
  },

  getMy: async (params?: {
    role?: 'worker' | 'client';
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<BookingsPage> => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
    // Response: { status, data: { bookings, total } }  (shape inferred from pattern)
    const raw = await api.get<{
      status: string;
      data: { bookings: Record<string, unknown>[]; total: number };
    }>(`/api/bookings/my${q ? `?${q}` : ''}`);
    return {
      bookings: (raw.data?.bookings ?? []).map(normalise),
      total: raw.data?.total ?? 0,
    };
  },

  getById: async (id: string): Promise<Booking> => {
    const raw = await api.get<{
      status: string;
      data: { booking: Record<string, unknown> };
    }>(`/api/bookings/${id}`);
    return normalise(raw.data.booking);
  },

  accept: (id: string, payload?: { acceptedBudget?: number }) =>
    api.patch<{ status: string }>(`/api/bookings/${id}/accept`, payload ?? {}),

  complete: (id: string) =>
    api.patch<{ status: string }>(`/api/bookings/${id}/complete`, {}),

  cancel: (id: string) =>
    api.patch<{ status: string }>(`/api/bookings/${id}/cancel`, {}),
};
