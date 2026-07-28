import api from '@/lib/api';

export interface ProjectLabourSummary {
  project_id: number;
  project_name: string;
  project_code?: string;
  worker_days: number;
  total_labour_cost: number;
}

export interface LabourSummaryResponse {
  total_worker_days: number;
  total_labour_cost: number;
  avg_daily_cost: number;
  project_summary: ProjectLabourSummary[];
  recent_payments: any[];
}

export interface RecordPaymentPayload {
  project_id?: number;
  worker_name: string;
  amount: number;
  date: string;
  payment_mode?: string;
  notes?: string;
}

export const labourService = {
  getSummary: async (): Promise<LabourSummaryResponse> => {
    const response = await api.get('/business/labour/summary');
    return response.data.data;
  },

  getProjectLabour: async (projectId: number | string): Promise<any> => {
    const response = await api.get(`/business/labour/project/${projectId}`);
    return response.data.data;
  },

  recordPayment: async (data: RecordPaymentPayload): Promise<any> => {
    const response = await api.post('/business/labour/payment', data);
    return response.data.data;
  },
};
