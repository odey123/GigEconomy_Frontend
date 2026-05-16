import { api } from '../api';
import type { Gig } from '../../types';

export interface GigsPage {
  gigs: Gig[];
  total: number;
  page: number;
}

function buildQuery(params?: Record<string, string | number | undefined>) {
  const q = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    ),
  ).toString();
  return q ? `?${q}` : '';
}

// Backend wraps all gig objects under { _id, ... } — normalise _id → id
function normaliseGig(g: Record<string, unknown>): Gig {
  return {
    ...(g as Gig),
    id: (g._id as string) ?? (g.id as string),
    // backend uses workType; our Gig type uses type
    type: ((g.workType ?? g.type) as 'sales' | 'task') ?? 'sales',
  };
}

export const gigsService = {
  getMatched: async (params?: { workType?: string; limit?: number; page?: number }): Promise<GigsPage> => {
    // Response: { status, data: { gigs, count, pagination } }
    const raw = await api.get<{
      status: string;
      data: { gigs: Record<string, unknown>[]; count: number; pagination: { total: number; page: number } };
    }>(`/api/gigs/matched${buildQuery(params)}`);
    return {
      gigs: (raw.data.gigs ?? []).map(normaliseGig),
      total: raw.data.pagination?.total ?? raw.data.count ?? 0,
      page: raw.data.pagination?.page ?? 1,
    };
  },

  getMine: async (): Promise<Gig[]> => {
    // Response: { status, data: { gigs, pagination } }
    const raw = await api.get<{
      status: string;
      data: { gigs: Record<string, unknown>[] };
    }>('/api/gigs/mine');
    return (raw.data?.gigs ?? []).map(normaliseGig);
  },

  getAll: async (params?: { workType?: string; page?: number; limit?: number }): Promise<GigsPage> => {
    const raw = await api.get<{
      status: string;
      data: { gigs: Record<string, unknown>[]; pagination: { page: number; total: number } };
    }>(`/api/gigs${buildQuery(params)}`);
    return {
      gigs: (raw.data.gigs ?? []).map(normaliseGig),
      total: raw.data.pagination?.total ?? 0,
      page: raw.data.pagination?.page ?? 1,
    };
  },

  getById: async (id: string): Promise<Gig> => {
    // Response: { status, data: { gig: { ... } } }
    const raw = await api.get<{
      status: string;
      data: { gig: Record<string, unknown> };
    }>(`/api/gigs/${id}`);
    return normaliseGig(raw.data.gig);
  },

  create: (payload: Record<string, unknown>) =>
    api.post<{ status: string; data: { _id: string } }>('/api/gigs', payload),

  update: (id: string, payload: Partial<Gig>) =>
    api.patch<{ status: string }>(`/api/gigs/${id}`, payload),

  delete: (id: string) => api.delete<{ status: string }>(`/api/gigs/${id}`),
};
