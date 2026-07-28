import api from '@/lib/api';

export interface AgingRow {
  party_id: number;
  party_type: 'customer' | 'supplier';
  name: string;
  phone?: string;
  gstin?: string;
  credit_limit?: number;
  total_outstanding: number;
  current_0_30: number;
  overdue_31_60: number;
  overdue_61_90: number;
  overdue_90_plus: number;
  last_invoice_date?: string;
}

export const outstandingService = {
  getCustomers: async (params?: { search?: string; show_zero?: boolean }) => {
    const response = await api.get('/business/outstanding/customers', { params });
    return response.data;
  },

  getSuppliers: async (params?: { search?: string; show_zero?: boolean }) => {
    const response = await api.get('/business/outstanding/suppliers', { params });
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/business/outstanding/summary');
    return response.data;
  },

  sendReminder: async (partyType: 'customer' | 'supplier', partyId: number | string) => {
    const response = await api.post(`/business/outstanding/reminder/${partyType}/${partyId}`);
    return response.data;
  },
};
