import { api } from '../api';
import type { Wallet, Transaction } from '../../types';

export interface TransactionsPage {
  transactions: Transaction[];
  total: number;
}

export const walletService = {
  create: (payload: { bvn: string; fullName: string; dateOfBirth: string }) =>
    api.post<Wallet>('/api/users/wallet/create', payload),

  getBalance: () => api.get<Wallet>('/api/users/wallet/balance'),

  getTransactions: (params?: { limit?: number; offset?: number }) => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
    return api.get<TransactionsPage>(`/api/users/wallet/transactions${q ? `?${q}` : ''}`);
  },

  withdraw: (payload: {
    amount: number;
    bankAccount: { accountNumber: string; bankCode: string };
  }) => api.post<void>('/api/users/wallet/withdraw', payload),
};
