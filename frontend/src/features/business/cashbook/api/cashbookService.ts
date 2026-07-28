import api from '@/lib/api';

export interface CashBankEntryPayload {
  entry_type: 'cash_receipt' | 'cash_payment' | 'bank_receipt' | 'bank_payment' | 'contra';
  account_type?: 'cash' | 'bank';
  bank_account_id?: number;
  account_name?: string;
  party_type?: 'customer' | 'supplier' | 'expense' | 'other';
  party_id?: number;
  amount: number;
  payment_mode?: string;
  reference_no?: string;
  narration?: string;
  date?: string;
  reference_type?: string;
  reference_id?: number;
}

export interface BankAccountPayload {
  account_name: string;
  account_number: string;
  ifsc_code?: string;
  bank_name: string;
  branch?: string;
  opening_balance?: number;
  is_default?: boolean;
}

export const cashbookService = {
  list: async (params?: any) => {
    const response = await api.get('/business/cash-bank', { params });
    return response.data;
  },

  store: async (payload: CashBankEntryPayload) => {
    const response = await api.post('/business/cash-bank', payload);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(`/business/cash-bank/${id}`);
    return response.data;
  },

  getDayBook: async (date?: string) => {
    const params = date ? { date } : {};
    const response = await api.get('/business/cash-bank/day-book', { params });
    return response.data;
  },

  getCashBalance: async () => {
    const response = await api.get('/business/cash-bank/cash-balance');
    return response.data;
  },

  listBankAccounts: async () => {
    const response = await api.get('/business/bank-accounts');
    return response.data;
  },

  createBankAccount: async (payload: BankAccountPayload) => {
    const response = await api.post('/business/bank-accounts', payload);
    return response.data;
  },

  updateBankAccount: async (id: number | string, payload: Partial<BankAccountPayload>) => {
    const response = await api.put(`/business/bank-accounts/${id}`, payload);
    return response.data;
  },

  deleteBankAccount: async (id: number | string) => {
    const response = await api.delete(`/business/bank-accounts/${id}`);
    return response.data;
  },
};
