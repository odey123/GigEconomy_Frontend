import { api } from '../api';
import type { Booking } from '../../types';

export interface SalesEarnings {
  ownerEarnings: number;
  helperEarnings: number;
  paymentStatus: string;
  totalAmount: number;
  // normalised extras used by ContractDetailSales
  totalSales: number;
  totalEarnings: number;
  commissionRate: number;
  paymentUrl: string;
  recentSales: {
    time: string;
    amount: number;
    businessCut: number;
    helperCut: number;
    customer: string;
  }[];
  pickupLog: {
    date: string;
    quantity: number;
    value: string;
    remaining: number;
  }[];
}

function normaliseContract(c: Record<string, unknown>): Booking {
  return { ...(c as Booking), id: (c._id as string) ?? (c.id as string) };
}

export const contractsService = {
  getAll: async (params?: { role?: 'owner' | 'helper'; status?: string }): Promise<Booking[]> => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
    // Response: { status, data: { contracts, total } }
    const raw = await api.get<{
      status: string;
      data: { contracts: Record<string, unknown>[] };
    }>(`/api/contracts${q ? `?${q}` : ''}`);
    return (raw.data?.contracts ?? []).map(normaliseContract);
  },

  getById: async (id: string): Promise<Booking> => {
    // Response: { status, data: { contract: { ... } } }
    const raw = await api.get<{
      status: string;
      data: { contract: Record<string, unknown> };
    }>(`/api/contracts/${id}`);
    return normaliseContract(raw.data.contract);
  },

  // --- Sales ---
  getSalesEarnings: async (id: string): Promise<SalesEarnings> => {
    // Response: { status, data: { ownerEarnings, helperEarnings, paymentStatus, totalAmount } }
    const raw = await api.get<{
      status: string;
      data: {
        ownerEarnings: number;
        helperEarnings: number;
        paymentStatus: string;
        totalAmount: number;
      };
    }>(`/api/contracts/${id}/sales/earnings`);
    const d = raw.data;
    return {
      ownerEarnings: d.ownerEarnings,
      helperEarnings: d.helperEarnings,
      paymentStatus: d.paymentStatus,
      totalAmount: d.totalAmount,
      // Map to fields used by ContractDetailSales UI
      totalSales: 0,
      totalEarnings: d.helperEarnings ?? 0,
      commissionRate: 0,
      paymentUrl: '',
      recentSales: [],
      pickupLog: [],
    };
  },

  generatePaymentLink: async (id: string, payload: { customerEmail: string }) => {
    // Response: { status, data: { paymentUrl, qrCode } }
    const raw = await api.post<{
      status: string;
      data: { paymentUrl: string; qrCode: string };
    }>(`/api/contracts/${id}/sales/payment-link`, payload);
    return raw.data;
  },

  recordPickup: (id: string, payload: { stockQuantity: number; stockValue: number }) =>
    api.post<{ status: string }>(`/api/contracts/${id}/sales/record-pickup`, payload),

  // --- Task ---
  fundEscrow: (id: string) =>
    api.post<{ status: string }>(`/api/contracts/${id}/task/fund-escrow`),

  submitTask: (id: string, payload: { deliverableNotes: string; attachments?: string[] }) =>
    api.post<{ status: string }>(`/api/contracts/${id}/task/submit`, payload),

  approveTask: (id: string) =>
    api.post<{ status: string }>(`/api/contracts/${id}/task/approve`),

  disputeTask: (id: string, payload: { reason: string }) =>
    api.post<{ status: string }>(`/api/contracts/${id}/task/dispute`, payload),
};
