import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface FieldStaff {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface TaskProofItem {
  id: number;
  task_id: number;
  staff_id: number;
  raw_photo_url: string;
  watermarked_photo_url: string;
  lat: number | null;
  lng: number | null;
  distance_from_site: number | null;
  is_gallery_photo: boolean;
  ai_confidence?: number | null;
  is_ai_approved?: boolean;
  ai_analysis?: {
    is_valid_proof?: boolean;
    confidence?: number;
    is_screen_spoof?: boolean;
    detected_objects?: string[];
    fraud_indicators?: string[];
    summary_hindi?: string;
    provider?: string;
  } | null;
  notes: string | null;
  created_at: string;
  task?: {
    id: number;
    title: string;
    site_name: string;
    status: string;
    client_name: string | null;
  };
  staff?: {
    id: number;
    name: string;
    phone: string;
  };
}

export interface FieldTaskItem {
  id: number;
  business_id: number;
  staff_id: number;
  title: string;
  description: string | null;
  site_name: string;
  site_lat: number | null;
  site_lng: number | null;
  site_address: string | null;
  client_name: string | null;
  client_phone: string | null;
  client_otp: string | null;
  otp_verified_at: string | null;
  status: 'assigned' | 'in_transit' | 'reached' | 'awaiting_otp' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_at: string | null;
  completed_at: string | null;
  created_at: string;
  staff?: FieldStaff;
  proofs?: TaskProofItem[];
}

export interface TaskCounts {
  total: number;
  assigned: number;
  in_transit: number;
  reached: number;
  awaiting_otp: number;
  completed: number;
  cancelled: number;
}

export interface FieldTasksResponse {
  data: {
    data: FieldTaskItem[];
    current_page: number;
    last_page: number;
    total: number;
  };
  counts: TaskCounts;
}

export interface CreateTaskPayload {
  staff_id: number;
  title: string;
  description?: string;
  site_name: string;
  site_lat?: number;
  site_lng?: number;
  site_address?: string;
  client_name?: string;
  client_phone?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_at?: string;
  auto_dispatch?: boolean;
}

export const useFieldTasks = (params?: {
  status?: string;
  search?: string;
  priority?: string;
  staff_id?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ['business', 'field-tasks', params],
    queryFn: async () => {
      const { data } = await api.get('/business/field-tasks', { params });
      return data as FieldTasksResponse;
    },
  });
};

export const useFieldStaff = () => {
  return useQuery({
    queryKey: ['business', 'field-staff'],
    queryFn: async () => {
      const { data } = await api.get('/business/field-staff');
      return (data.data || []) as FieldStaff[];
    },
  });
};

export const useCreateFieldTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const { data } = await api.post('/business/field-tasks', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'field-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['business', 'whatsapp-wallet'] });
    },
  });
};

export const useUpdateFieldTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<FieldTaskItem> }) => {
      const res = await api.put(`/business/field-tasks/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'field-tasks'] });
    },
  });
};

export const useDispatchFieldTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/business/field-tasks/${id}/dispatch`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'field-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['business', 'whatsapp-wallet'] });
    },
  });
};

export const useDeleteFieldTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/business/field-tasks/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'field-tasks'] });
    },
  });
};

export const useFieldProofs = (params?: {
  staff_id?: number;
  task_id?: number;
  date?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ['business', 'field-proofs', params],
    queryFn: async () => {
      const { data } = await api.get('/business/field-proofs', { params });
      return data.data as {
        data: TaskProofItem[];
        current_page: number;
        last_page: number;
        total: number;
      };
    },
  });
};
