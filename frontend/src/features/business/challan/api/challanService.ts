import api from '@/lib/api';

export const challanService = {
  list: async (params?: any) => {
    const response = await api.get('/business/challans', { params });
    return response.data.data;
  },

  get: async (id: number) => {
    const response = await api.get(`/business/challans/${id}`);
    return response.data.data;
  },

  pending: async (customerId?: number) => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await api.get('/business/challans/pending', { params });
    return response.data.data;
  },

  getTruckSlip: async (id: number) => {
    const response = await api.get(`/business/challans/${id}/truck-slip`, { responseType: 'blob' });
    return response.data;
  },

  convertToInvoice: async (challanIds: number[]) => {
    const response = await api.post('/business/challans/convert', { challan_ids: challanIds });
    return response.data.data;
  },
};
