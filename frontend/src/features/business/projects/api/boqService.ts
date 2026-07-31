import api from '@/lib/api';

export interface BoqItem {
  id?: number;
  boq_section_id?: number;
  boq_id?: number;
  item_name: string;
  description?: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  product_id?: number;
  sort_order?: number;
}

export interface BoqSection {
  id?: number;
  boq_id?: number;
  section_name: string;
  sort_order?: number;
  items: BoqItem[];
}

export interface BoqTemplate {
  id: number;
  business_id: number;
  project_id?: number;
  name: string;
  client_name?: string;
  project_name?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  validity_date?: string;
  notes?: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  project?: {
    id: number;
    name: string;
    project_code?: string;
  };
  sections?: BoqSection[];
}

export interface CreateBoqPayload {
  name: string;
  client_name?: string;
  project_name?: string;
  project_id?: number;
  validity_date?: string;
  notes?: string;
  status?: string;
  sections: {
    section_name: string;
    sort_order?: number;
    items: {
      item_name: string;
      description?: string;
      unit?: string;
      quantity: number;
      rate: number;
      product_id?: number;
    }[];
  }[];
}

export const boqService = {
  getBoqs: async (params?: { status?: string; project_id?: number; search?: string }): Promise<BoqTemplate[]> => {
    const response = await api.get('/business/boq', { params });
    return response.data.data;
  },

  getBoq: async (id: number | string): Promise<BoqTemplate> => {
    const response = await api.get(`/business/boq/${id}`);
    return response.data.data;
  },

  createBoq: async (data: CreateBoqPayload): Promise<BoqTemplate> => {
    const response = await api.post('/business/boq', data);
    return response.data.data;
  },

  updateBoq: async (id: number | string, data: Partial<CreateBoqPayload>): Promise<BoqTemplate> => {
    const response = await api.put(`/business/boq/${id}`, data);
    return response.data.data;
  },

  deleteBoq: async (id: number | string): Promise<void> => {
    await api.delete(`/business/boq/${id}`);
  },

  updateStatus: async (id: number | string, status: string): Promise<BoqTemplate> => {
    const response = await api.patch(`/business/boq/${id}/status`, { status });
    return response.data.data;
  },

  duplicateBoq: async (id: number | string): Promise<BoqTemplate> => {
    const response = await api.post(`/business/boq/${id}/duplicate`);
    return response.data.data;
  },

  convertToInvoice: async (id: number | string): Promise<any> => {
    const response = await api.post(`/business/boq/${id}/convert`);
    return response.data.data;
  },

  generatePdfData: async (id: number | string): Promise<any> => {
    const response = await api.get(`/business/boq/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  },
};
