import { api } from '../api';
import type { Transaction } from '../../types';

export interface WalletBalance {
  balance: number;
  accountNumber: string;
}

export interface TransactionsPage {
  transactions: Transaction[];
  total: number;
}

export const walletService = {
  create: async (payload: {
    bvn: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;  // mm/dd/yyyy — Squad format
    gender: string;        // "1" = Male, "2" = Female
    address: string;
  }) => {
    // Response: { status, message, data: { wallet: { ... } } }
    return api.post<{ status: string; message: string }>('/api/users/wallet/create', payload);
  },

  getBalance: async (): Promise<WalletBalance> => {
    // Response: { status, data: { balance: { balance, accountNumber } } }
    const raw = await api.get<{ status: string; data: { balance: WalletBalance } }>(
      '/api/users/wallet/balance',
    );
    return raw.data.balance;
  },

  getTransactions: async (params?: { limit?: number; offset?: number }): Promise<TransactionsPage> => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
    // Response: { status, data: { transactions, total, limit, offset } }
    const raw = await api.get<{
      status: string;
      data: { transactions: Transaction[]; total: number };
    }>(`/api/users/wallet/transactions${q ? `?${q}` : ''}`);
    return { transactions: raw.data.transactions ?? [], total: raw.data.total ?? 0 };
  },

  withdraw: (payload: { amount: number; bankAccount: { accountNumber: string; bankCode: string } }) =>
    api.post<{ status: string; message: string }>('/api/users/wallet/withdraw', payload),
};
