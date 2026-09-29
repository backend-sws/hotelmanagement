import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface BotSettings {
  bot_enabled: boolean;
  require_selfie: boolean;
  ai_vision_enabled: boolean;
  require_client_otp: boolean;
  auto_dispatch_whatsapp: boolean;
  auto_tada_tracking: boolean;
  two_wheeler_rate: number;
  four_wheeler_rate: number;
  public_transit_rate: number;
  watermark_branding: string;
  geofence_radius: number;
  site_lat: number;
  site_lng: number;
  site_name: string;
  shift_start_time: string;
  shift_end_time: string;
  late_grace_minutes: number;
}

export interface BotInfo {
  webhook_url?: string;
  verify_token?: string;
  phone_number_id?: string;
  display_phone?: string;
  wa_link?: string;
  is_meta_configured: boolean;
  is_gemini_configured: boolean;
  wallet_balance: number;
  status: 'active' | 'paused';
}

export interface CommandItem {
  command: string;
  keywords: string;
  description: string;
  description_hi: string;
  category: string;
}

export interface BotSettingsResponse {
  settings: BotSettings;
  bot_info: BotInfo;
  command_directory: CommandItem[];
}

export function useBotSettings() {
  return useQuery<BotSettingsResponse>({
    queryKey: ['business', 'fieldops', 'bot-settings'],
    queryFn: async () => {
      const { data } = await api.get('/business/fieldops/bot-settings');
      return data;
    },
    staleTime: 30000,
  });
}

export function useUpdateBotSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BotSettings) => {
      const { data } = await api.put('/business/fieldops/bot-settings', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'fieldops', 'bot-settings'] });
    },
  });
}

export function useSendTestBotMessage() {
  return useMutation({
    mutationFn: async (phone: string) => {
      const { data } = await api.post('/business/fieldops/test-bot-message', { phone });
      return data;
    },
  });
}
