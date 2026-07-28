import api from '@/lib/api';

export interface ProjectSummary {
  contract_value: number;
  total_invoiced: number;
  total_received: number;
  material_cost: number;
  labour_cost: number;
  expense_cost: number;
  total_cost: number;
  net_profit: number;
  profit_margin: number;
}

export interface Project {
  id: number;
  business_id: number;
  name: string;
  project_code?: string;
  client_name?: string;
  client_phone?: string;
  site_address?: string;
  city?: string;
  start_date?: string;
  end_date?: string;
  contract_value: number;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  description?: string;
  notes?: string;
  location_id?: number;
  created_by?: number;
  created_at: string;
  updated_at: string;
  total_invoiced?: number;
  total_received?: number;
  total_cost?: number;
  net_profit?: number;
  summary?: ProjectSummary;
  location?: {
    id: number;
    name: string;
    address: string;
  };
}

export interface CreateProjectPayload {
  name: string;
  client_name?: string;
  client_phone?: string;
  site_address?: string;
  city?: string;
  start_date?: string;
  end_date?: string;
  contract_value?: number;
  status?: string;
  description?: string;
  notes?: string;
  create_location?: boolean;
}

export const projectService = {
  getProjects: async (params?: { status?: string; search?: string }): Promise<Project[]> => {
    const response = await api.get('/business/projects', { params });
    return response.data.data;
  },

  getProject: async (id: number | string): Promise<Project> => {
    const response = await api.get(`/business/projects/${id}`);
    return response.data.data;
  },

  createProject: async (data: CreateProjectPayload): Promise<Project> => {
    const response = await api.post('/business/projects', data);
    return response.data.data;
  },

  updateProject: async (id: number | string, data: Partial<CreateProjectPayload>): Promise<Project> => {
    const response = await api.put(`/business/projects/${id}`, data);
    return response.data.data;
  },

  deleteProject: async (id: number | string): Promise<void> => {
    await api.delete(`/business/projects/${id}`);
  },

  getStats: async (id: number | string): Promise<ProjectSummary> => {
    const response = await api.get(`/business/projects/${id}/stats`);
    return response.data.data;
  },

  getInvoices: async (id: number | string): Promise<any[]> => {
    const response = await api.get(`/business/projects/${id}/invoices`);
    return response.data.data;
  },

  getExpenses: async (id: number | string): Promise<any[]> => {
    const response = await api.get(`/business/projects/${id}/expenses`);
    return response.data.data;
  },
};
