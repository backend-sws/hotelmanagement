import api from '@/lib/api';

export interface PurchaseItemPayload {
  product_id: number;
  hsn_code?: string;
  unit?: string;
  quantity: number;
  purchase_price: number;
  gst_rate: number;
}

export interface CreatePurchasePayload {
  supplier_id: number;
  bill_number?: string;
  bill_date?: string;
  purchase_date: string;
  due_date?: string;
  location_id?: number;
  notes?: string;
  is_itc_eligible?: boolean;
  paid_amount?: number;
  payment_mode?: string;
  items: PurchaseItemPayload[];
}

export const purchaseService = {
  list: async (params?: any) => {
    const response = await api.get('/business/purchases', { params });
    return response.data;
  },

  get: async (id: number | string) => {
    const response = await api.get(`/business/purchases/${id}`);
    return response.data.data;
  },

  create: async (payload: CreatePurchasePayload) => {
    const response = await api.post('/business/purchases', payload);
    return response.data.data;
  },

  recordPayment: async (id: number | string, payload: { amount: number; payment_mode: string; payment_date?: string; notes?: string }) => {
    const response = await api.post(`/business/purchases/${id}/payment`, payload);
    return response.data.data;
  },

  getItcSummary: async (params?: any) => {
    const response = await api.get('/business/purchases/itc-summary', { params });
    return response.data;
  },

  toggleItcClaim: async (id: number | string, isClaimed?: boolean) => {
    const response = await api.patch(`/business/purchases/itc-summary/${id}/toggle-claim`, { is_claimed: isClaimed });
    return response.data.data;
  },

  getPdf: async (id: number | string) => {
    const response = await api.get(`/business/purchases/${id}/pdf`);
    return response.data;
  },
};
