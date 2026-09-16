import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Notice {
  id: number;
  posted_by: number;
  title: string;
  body: string;
  visibility: 'public' | 'private';
  target_user_id: number | null;
  is_pinned: boolean;
  expires_at: string | null;
  created_at: string;
  is_read?: boolean;
  posted_by_user?: { id: number; name: string };
  target_user?: { id: number; name: string };
}

export const useNotices = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['notices', filters],
    queryFn: async () => {
      const { data } = await api.get('/business/notices', { params: filters });
      return data.data;
    },
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notices', 'unread-count'],
    queryFn: async () => {
      const { data } = await api.get('/business/notices/unread-count');
      return data.unread_count as number;
    },
    refetchInterval: 60000, // refresh every minute
  });
};

export const useCreateNotice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      body: string;
      visibility: 'public' | 'private';
      target_user_id?: number;
      is_pinned?: boolean;
      expires_at?: string;
    }) => {
      const { data } = await api.post('/business/notices', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Notice posted!');
      qc.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to post notice'),
  });
};

export const useMarkNoticeRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/business/notices/${id}/read`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notices'] });
    },
  });
};

export const useTogglePin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/business/notices/${id}/pin`);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

export const useDeleteNotice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/notices/${id}`);
    },
    onSuccess: () => {
      toast.success('Notice deleted.');
      qc.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });
};
