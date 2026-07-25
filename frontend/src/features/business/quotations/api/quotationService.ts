import api from '@/lib/api';

export const quotationService = {
  list: async (params?: any) => {
    const response = await api.get('/business/quotations', { params });
    return response.data.data;
  },

  get: async (id: number) => {
    const response = await api.get(`/business/quotations/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/business/quotations/${id}/status`, { status });
    return response.data.data;
  },

  convert: async (id: number, type: 'invoice' | 'proforma' = 'invoice') => {
    const response = await api.post(`/business/quotations/${id}/convert`, { type });
    return response.data.data;
  },
};
