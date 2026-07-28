import api from '@/lib/api';

export interface ConsumptionItem {
  id?: number;
  consumption_id?: number;
  product_id: number;
  quantity: number;
  unit?: string;
  rate?: number;
  amount?: number;
  notes?: string;
  product?: {
    id: number;
    name: string;
    item_code?: string;
    unit?: string;
  };
}

export interface MaterialConsumption {
  id: number;
  business_id: number;
  project_id: number;
  consumption_number: string;
  date: string;
  notes?: string;
  entered_by?: number;
  created_at: string;
  updated_at: string;
  total_items_count?: number;
  total_cost?: number;
  project?: {
    id: number;
    name: string;
    project_code?: string;
  };
  entered_by_user?: {
    id: number;
    name: string;
  };
  items?: ConsumptionItem[];
}

export interface CreateConsumptionPayload {
  project_id: number;
  date: string;
  notes?: string;
  location_id?: number;
  items: {
    product_id: number;
    quantity: number;
    unit?: string;
    rate?: number;
    notes?: string;
  }[];
}

export interface ProjectConsumptionSummary {
  project: {
    id: number;
    name: string;
    project_code?: string;
  };
  items_summary: {
    product_id: number;
    unit: string;
    total_quantity: number;
    total_amount: number;
    avg_rate: number;
    product?: {
      id: number;
      name: string;
      item_code?: string;
    };
  }[];
  total_material_cost: number;
}

export const consumptionService = {
  getConsumptions: async (params?: { project_id?: number; date?: string; start_date?: string; end_date?: string }): Promise<MaterialConsumption[]> => {
    const response = await api.get('/business/material-consumptions', { params });
    return response.data.data;
  },

  getConsumption: async (id: number | string): Promise<MaterialConsumption> => {
    const response = await api.get(`/business/material-consumptions/${id}`);
    return response.data.data;
  },

  createConsumption: async (data: CreateConsumptionPayload): Promise<MaterialConsumption> => {
    const response = await api.post('/business/material-consumptions', data);
    return response.data.data;
  },

  getProjectConsumptionSummary: async (projectId: number | string): Promise<ProjectConsumptionSummary> => {
    const response = await api.get(`/business/material-consumptions/project/${projectId}/summary`);
    return response.data.data;
  },

  generateSlipData: async (id: number | string): Promise<any> => {
    const response = await api.get(`/business/material-consumptions/${id}/slip`);
    return response.data.data;
  },
};
