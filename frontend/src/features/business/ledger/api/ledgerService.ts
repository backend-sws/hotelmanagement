import api from '@/lib/api';

export interface LedgerEntryItem {
  id: number;
  date: string;
  entry_type: string;
  reference_type?: string;
  reference_id?: number;
  narration?: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface LedgerStatement {
  party_type: 'customer' | 'supplier';
  party: {
    id: number;
    name: string;
    phone?: string;
    address?: string;
    gstin?: string;
    state_name?: string;
  };
  period: {
    from?: string;
    to?: string;
  };
  opening_balance: number;
  closing_balance: number;
  total_debit: number;
  total_credit: number;
  entries: LedgerEntryItem[];
}

export const ledgerService = {
  getCustomerStatement: async (id: number | string, params?: { from_date?: string; to_date?: string }): Promise<LedgerStatement> => {
    const response = await api.get(`/business/ledger/customer/${id}`, { params });
    return response.data.data;
  },

  getSupplierStatement: async (id: number | string, params?: { from_date?: string; to_date?: string }): Promise<LedgerStatement> => {
    const response = await api.get(`/business/ledger/supplier/${id}`, { params });
    return response.data.data;
  },

  getCustomerBalance: async (id: number | string) => {
    const response = await api.get(`/business/ledger/customer/${id}/balance`);
    return response.data;
  },

  getSupplierBalance: async (id: number | string) => {
    const response = await api.get(`/business/ledger/supplier/${id}/balance`);
    return response.data;
  },

  getCustomerPdf: async (id: number | string, params?: { from_date?: string; to_date?: string }) => {
    const response = await api.get(`/business/ledger/customer/${id}/pdf`, { params });
    return response.data;
  },

  getSupplierPdf: async (id: number | string, params?: { from_date?: string; to_date?: string }) => {
    const response = await api.get(`/business/ledger/supplier/${id}/pdf`, { params });
    return response.data;
  },
};
