import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useStaffProductsSold = (
  staffId: string | undefined, 
  filters: { from_date: string; to_date: string; search?: string; per_page?: number; page?: number },
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['staff-products-sold', staffId, filters],
    queryFn: async () => {
      const { data } = await api.get(`/business/staff/performance/${staffId}/products`, { params: filters });
      return data;
    },
    enabled: !!staffId && (options?.enabled !== false),
  });
};
