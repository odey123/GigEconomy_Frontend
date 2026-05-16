import { api } from '../api';
import type { Gig } from '../../types';

export interface GigsPage {
  gigs: Gig[];
  total: number;
  page: number;
}

export const gigsService = {
  getMatched: (params?: { workType?: string; limit?: number; page?: number }) => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
    return api.get<GigsPage>(`/api/gigs/matched${q ? `?${q}` : ''}`);
  },

  getMine: () => api.get<Gig[]>('/api/gigs/mine'),

  getAll: (params?: { workType?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
    return api.get<GigsPage>(`/api/gigs${q ? `?${q}` : ''}`);
  },

  getById: (id: string) => api.get<Gig>(`/api/gigs/${id}`),

  create: (payload: Partial<Gig> & { workType: string; title: string }) =>
    api.post<Gig>('/api/gigs', payload),

  update: (id: string, payload: Partial<Gig>) =>
    api.patch<Gig>(`/api/gigs/${id}`, payload),

  delete: (id: string) => api.delete<void>(`/api/gigs/${id}`),
};
