import React, { useState } from 'react';
import { useOtaChannels, useOtaSyncHistory, useSyncOtaRates } from '../api/useOta';
import { RefreshCw, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function RateSyncPage() {
  const { data: channels } = useOtaChannels();
  const { data: syncHistory, isLoading } = useOtaSyncHistory();
  const syncRates = useSyncOtaRates();
  
  const [channelId, setChannelId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const [endDate, setEndDate] = useState(nextWeek.toISOString().split('T')[0]);

  const handleManualSync = async () => {
    if (!channelId) {
      toast.error('Please select a channel to sync');
      return;
    }
    
    syncRates.mutate({
      channel_id: channelId,
      start_date: startDate,
      end_date: endDate
    }, {
      onSuccess: (res) => {
        toast.success(res.message || 'Synced successfully');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Sync failed');
      }
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Push Rates & Availability</h1>
        <p className="text-slate-500 text-sm mt-1">Manually force sync your inventory and rates to connected OTAs.</p>
      </div>

      <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Manual Sync</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Channel</label>
            <Select value={channelId} onChange={(e) => setChannelId(e.target.value)}>
              <option value="">Select connected channel...</option>
              {channels?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.channel_name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleManualSync} disabled={syncRates.isPending || channels?.length === 0}>
            <RefreshCw className={`w-4 h-4 mr-2 ${syncRates.isPending ? 'animate-spin' : ''}`} />
            {syncRates.isPending ? 'Pushing...' : 'Push to OTA'}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Sync History</h3>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
          </div>
        ) : syncHistory?.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl">
            <p className="text-slate-500">No sync history found. Connect a channel and push rates.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Room Type</th>
                    <th className="px-4 py-3">Available</th>
                    <th className="px-4 py-3">Rate Pushed</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {syncHistory?.slice(0, 50).map((sync: any) => (
                    <tr key={sync.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {sync.sync_date}
                      </td>
                      <td className="px-4 py-3">{sync.channel?.channel_name}</td>
                      <td className="px-4 py-3">{sync.room_type?.name}</td>
                      <td className="px-4 py-3 font-bold">{sync.available_rooms} Rooms</td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹{parseFloat(sync.rate).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {sync.sync_status === 'synced' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Synced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <AlertCircle className="w-3 h-3" /> {sync.sync_status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
