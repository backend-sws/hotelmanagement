import React, { useState } from 'react';
import { useOtaChannels, useCreateOtaChannel, useDeleteOtaChannel } from '../api/useOta';
import { Plus, Link as LinkIcon, Trash2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';

export default function OtaChannelsPage() {
  const { data: channels, isLoading } = useOtaChannels();
  const createChannel = useCreateOtaChannel();
  const deleteChannel = useDeleteOtaChannel();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    channel_name: '',
    channel_type: 'channel_manager',
    api_key: '',
    property_code: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createChannel.mutate(formData, {
      onSuccess: () => {
        setShowModal(false);
        setFormData({ channel_name: '', channel_type: 'channel_manager', api_key: '', property_code: '' });
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'connected': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending_setup': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">OTA & Channel Managers</h1>
          <p className="text-slate-500 text-sm mt-1">Connect your hotel to Makemytrip, Booking.com, or a Channel Manager.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Connect New
        </Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : channels?.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#111118] rounded-2xl border border-slate-200/80 dark:border-white/10">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Channels Connected</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Connect a channel manager like RateGain or SiteMinder to automatically sync bookings and availability.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels?.map((channel: any) => (
            <div key={channel.id} className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{channel.channel_name}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{channel.channel_type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  {getStatusIcon(channel.sync_status)}
                  <span className="capitalize text-slate-600 dark:text-slate-300">{channel.sync_status.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="mt-auto space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Property Code:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{channel.property_code || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {channel.last_sync_at ? new Date(channel.last_sync_at).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
                <Button size="sm" variant="destructive" className="h-8 text-xs bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 border-0" onClick={() => {
                  if(confirm('Are you sure you want to disconnect this channel?')) {
                    deleteChannel.mutate(channel.id);
                  }
                }}>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Disconnect
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Connect OTA / Channel Manager">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Provider Name</label>
            <Input 
              placeholder="e.g. RateGain, MakeMyTrip" 
              required 
              value={formData.channel_name} 
              onChange={e => setFormData({...formData, channel_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Integration Type</label>
            <Select required value={formData.channel_type} onChange={e => setFormData({...formData, channel_type: e.target.value})}>
              <option value="channel_manager">Channel Manager (Recommended)</option>
              <option value="ota_direct">Direct OTA Connection</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Code (Optional)</label>
            <Input 
              placeholder="Your Property ID from OTA" 
              value={formData.property_code} 
              onChange={e => setFormData({...formData, property_code: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">API Key</label>
            <Input 
              type="password"
              placeholder="API Key from Provider" 
              value={formData.api_key} 
              onChange={e => setFormData({...formData, api_key: e.target.value})}
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/10 mt-6">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={createChannel.isPending}>
              {createChannel.isPending ? 'Connecting...' : 'Connect Channel'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
