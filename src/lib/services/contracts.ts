import { api } from '../api';
import type { Booking, Transaction } from '../../types';

export interface SalesEarnings {
  totalSales: number;
  totalEarnings: number;
  commissionRate: number;
  paymentUrl: string;
  recentSales: Array<{
    time: string;
    amount: number;
    businessCut: number;
    helperCut: number;
    customer: string;
  }>;
  pickupLog: Array<{
    date: string;
    quantity: number;
    value: string;
    remaining: number;
  }>;
  liveSales: Transaction[];
}

export const contractsService = {
  getAll: (params?: { role?: 'owner' | 'helper'; status?: string }) => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
    return api.get<Booking[]>(`/api/contracts${q ? `?${q}` : ''}`);
  },

  getById: (id: string) => api.get<Booking>(`/api/contracts/${id}`),

  // --- Sales ---
  getSalesEarnings: (id: string) =>
    api.get<SalesEarnings>(`/api/contracts/${id}/sales/earnings`),

  recordPickup: (id: string, payload: { stockQuantity: number; stockValue: number }) =>
    api.post<void>(`/api/contracts/${id}/sales/record-pickup`, payload),

  generatePaymentLink: (id: string, payload: { customerEmail: string }) =>
    api.post<{ paymentUrl: string; qrCode: string }>(
      `/api/contracts/${id}/sales/payment-link`,
      payload,
    ),

  // --- Task ---
  fundEscrow: (id: string) => api.post<void>(`/api/contracts/${id}/task/fund-escrow`),

  submitTask: (id: string, payload: { deliverableNotes: string; attachments?: string[] }) =>
    api.post<void>(`/api/contracts/${id}/task/submit`, payload),

  approveTask: (id: string) => api.post<void>(`/api/contracts/${id}/task/approve`),

  disputeTask: (id: string, payload: { reason: string }) =>
    api.post<void>(`/api/contracts/${id}/task/dispute`, payload),
};
