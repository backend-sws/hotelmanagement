import api from '@/lib/api';

export interface ChequePayload {
  cheque_number: string;
  bank_name: string;
  branch?: string;
  cheque_date: string;
  amount: number;
  type: 'received' | 'issued';
  party_type?: string;
  party_id?: number;
  in_favour_of?: string;
  bank_account_id?: number;
  reference_invoice_id?: number;
  notes?: string;
}

export const chequeService = {
  list: async (params?: any) => {
    const response = await api.get('/business/cheques', { params });
    return response.data;
  },

  store: async (payload: ChequePayload) => {
    const response = await api.post('/business/cheques', payload);
    return response.data;
  },

  updateStatus: async (id: number | string, payload: {
    status: 'pending' | 'deposited' | 'cleared' | 'bounced' | 'cancelled';
    deposit_date?: string;
    clearance_date?: string;
    bounce_date?: string;
    bounce_reason?: string;
    bank_account_id?: number;
  }) => {
    const response = await api.patch(`/business/cheques/${id}/status`, payload);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(`/business/cheques/${id}`);
    return response.data;
  },

  getPending: async () => {
    const response = await api.get('/business/cheques/pending');
    return response.data;
  },

  getUpcoming: async () => {
    const response = await api.get('/business/cheques/upcoming');
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/business/cheques/summary');
    return response.data;
  },
};
