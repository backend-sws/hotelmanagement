import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useOccupancyReport() {
  return useQuery({
    queryKey: ['hotel-reports-occupancy'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/reports/occupancy');
      return res.data?.data || [];
    },
  });
}

export function useRevenueReport() {
  return useQuery({
    queryKey: ['hotel-reports-revenue'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/reports/revenue');
      return res.data?.data || [];
    },
  });
}

export function useChannelWiseReport() {
  return useQuery({
    queryKey: ['hotel-reports-channel-wise'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/reports/channel-wise');
      return res.data?.data || [];
    },
  });
}

export function useMisSummaryReport() {
  return useQuery({
    queryKey: ['hotel-reports-mis-summary'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/reports/mis-summary');
      return res.data?.data;
    },
  });
}
