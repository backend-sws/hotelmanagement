import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface RadarTechnician {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar: string | null;
  status: 'active' | 'in_transit' | 'reached_site' | 'off_duty';
  lat: number | null;
  lng: number | null;
  distance_from_base: number | null;
  last_updated: string;
  battery_level: number;
  current_task: {
    id: number;
    title: string;
    site_name: string;
    status: string;
  } | null;
  attendance: {
    check_in: string | null;
    check_out: string | null;
    selfie: string | null;
  } | null;
}

export interface RadarBase {
  name: string;
  lat: number;
  lng: number;
  radius_meters: number;
}

export interface LiveRadarResponse {
  base: RadarBase;
  technicians: RadarTechnician[];
  summary: {
    total: number;
    active: number;
    in_transit: number;
    on_site: number;
    off_duty: number;
  };
}

export interface RouteWaypoint {
  order: number;
  lat: number;
  lng: number;
  source: string;
  site_name: string;
  recorded_at: string;
}

export interface RouteTrailResponse {
  staff_id: number;
  date: string;
  total_km: number;
  waypoints: RouteWaypoint[];
}

export interface FieldOpsAnalyticsResponse {
  tasks: {
    total: number;
    completed: number;
    in_transit: number;
    completion_rate: number;
    avg_turnaround_hrs: number;
  };
  mileage: {
    month: string;
    total_km: number;
    total_spend: number;
    approved_spend: number;
    burn_rate_per_day: number;
  };
  ai_fraud: {
    total_checked: number;
    avg_confidence: number;
    spoofs_prevented: number;
    estimated_savings: number;
  };
  attendance: {
    total_punches: number;
    compliance_rate: number;
  };
}

export const useLiveRadar = () => {
  return useQuery({
    queryKey: ['business', 'radar', 'live-positions'],
    queryFn: async () => {
      const { data } = await api.get('/business/radar/live-positions');
      return data.data as LiveRadarResponse;
    },
    refetchInterval: 15000, // Live poll every 15 seconds
  });
};

export const useRouteTrail = (staffId: number | null, date?: string) => {
  return useQuery({
    queryKey: ['business', 'radar', 'route-trail', staffId, date],
    queryFn: async () => {
      if (!staffId) return null;
      const { data } = await api.get('/business/radar/route-trail', {
        params: { staff_id: staffId, date },
      });
      return data.data as RouteTrailResponse;
    },
    enabled: !!staffId,
  });
};

export const useFieldOpsAnalytics = () => {
  return useQuery({
    queryKey: ['business', 'fieldops', 'analytics'],
    queryFn: async () => {
      const { data } = await api.get('/business/fieldops/analytics');
      return data.data as FieldOpsAnalyticsResponse;
    },
  });
};
