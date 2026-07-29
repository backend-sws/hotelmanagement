import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';

export const usePublicSettings = () => {
  const setSettings = useAppStore((s) => s.setSettings);

  return useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      const response = await api.get('/settings/public');
      const data = response.data.data;
      if (data) {
        setSettings({
          appName: data.app_name || 'BillKaro ERP',
          appLogo: data.app_logo || null,
          appFavicon: data.app_favicon || null,
        });
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const setSettings = useAppStore((s) => s.setSettings);

  return useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      const response = await api.put('/superadmin/settings', { settings });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      setSettings({
        appName: data.app_name || 'BillKaro ERP',
        appLogo: data.app_logo || null,
        appFavicon: data.app_favicon || null,
      });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });
};

export const useUploadLogo = () => {
  const queryClient = useQueryClient();
  const setSettings = useAppStore((s) => s.setSettings);

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      const response = await api.post('/superadmin/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      if (data.url) {
        setSettings({ appLogo: data.url });
      }
      toast.success('Logo uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    },
  });
};

export const useUploadFavicon = () => {
  const queryClient = useQueryClient();
  const setSettings = useAppStore((s) => s.setSettings);

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('favicon', file);
      const response = await api.post('/superadmin/settings/favicon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      if (data.url) {
        setSettings({ appFavicon: data.url });
      }
      toast.success('Favicon uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload favicon');
    },
  });
};
