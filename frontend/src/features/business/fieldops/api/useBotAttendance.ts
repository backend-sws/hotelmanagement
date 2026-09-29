import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface BotAttendanceItem {
  id: number;
  user_id: number;
  business_id: number;
  date: string;
  status: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  check_in_photo: string | null;
  is_within_geofence: boolean;
  notes: string | null;
  actual_hours: number | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    phone: string;
    avatar: string | null;
  };
}

export interface BotAttendanceResponse {
  logs: {
    data: BotAttendanceItem[];
    current_page: number;
    last_page: number;
    total: number;
  };
  stats: {
    today_punches: number;
    within_geofence: number;
    compliance_rate: number;
  };
}

export const useBotAttendance = (date?: string, page: number = 1) => {
  return useQuery({
    queryKey: ['business', 'whatsapp-attendance', date, page],
    queryFn: async () => {
      const { data } = await api.get('/business/whatsapp/attendance-logs', {
        params: { date, page },
      });
      return data.data as BotAttendanceResponse;
    },
  });
};
