import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHotelGstConfig, useUpdateHotelGstConfig } from '../api/useGst';
import { Receipt, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PageLoadingSkeleton } from '@/components/ui/PageLoadingSkeleton';

export default function GstConfigPage() {
  const { data: config, isLoading } = useHotelGstConfig();
  const updateConfig = useUpdateHotelGstConfig();

  const { register, handleSubmit, reset, watch } = useForm();

  useEffect(() => {
    if (config) {
      reset(config);
    }
  }, [config, reset]);

  const isRegistered = watch('is_gst_registered');

  const onSubmit = (data: any) => {
    // Convert strings to numbers
    const payload = {
      ...data,
      room_slab_1_upto: Number(data.room_slab_1_upto),
      room_slab_2_upto: Number(data.room_slab_2_upto),
      room_slab_3_rate: Number(data.room_slab_3_rate),
      restaurant_non_ac_rate: Number(data.restaurant_non_ac_rate),
      restaurant_ac_rate: Number(data.restaurant_ac_rate),
      luxury_tax_rate: Number(data.luxury_tax_rate),
      luxury_tax_applicable: Boolean(data.luxury_tax_applicable),
      is_gst_registered: Boolean(data.is_gst_registered),
    };

    updateConfig.mutate(payload, {
      onSuccess: () => toast.success('GST Configuration updated successfully'),
      onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update GST Config'),
    });
  };

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Receipt className="w-6 h-6 text-indigo-500" />
          GST & Tax Configuration
        </h1>
        <p className="text-slate-500 text-sm mt-1">Configure your hotel's GST rates, thresholds, and composition scheme rules.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">GST Registration</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <input 
              type="checkbox" 
              id="is_gst_registered" 
              {...register('is_gst_registered')} 
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="is_gst_registered" className="text-sm font-medium">Hotel is GST Registered</label>
          </div>

          {isRegistered && (
            <div className="max-w-md">
              <label className="block text-sm font-semibold mb-1">Hotel GSTIN</label>
              <Input 
                {...register('gstin')} 
                placeholder="27AADCB2230M1Z2" 
                className="uppercase"
              />
            </div>
          )}
        </div>

        {/* Room GST Slabs */}
        <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Room Tariff Slabs (GST)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-300">Slab 1: 0% GST</div>
              <label className="block text-xs text-slate-500 mb-1">Tariff up to (₹)</label>
              <Input type="number" {...register('room_slab_1_upto')} />
              <div className="text-[10px] text-slate-400 mt-1">Rooms priced ₹0 to this amount are exempt from GST.</div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-300">Slab 2: 12% GST</div>
              <label className="block text-xs text-slate-500 mb-1">Tariff up to (₹)</label>
              <Input type="number" {...register('room_slab_2_upto')} />
              <div className="text-[10px] text-slate-400 mt-1">Rooms priced above Slab 1 up to this amount are charged 12%.</div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-300">Slab 3: High Rate</div>
              <label className="block text-xs text-slate-500 mb-1">Tax Rate (%)</label>
              <Input type="number" step="0.01" {...register('room_slab_3_rate')} />
              <div className="text-[10px] text-slate-400 mt-1">Rate for rooms priced above Slab 2 (usually 18%).</div>
            </div>
          </div>
        </div>

        {/* Restaurant & Other */}
        <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Restaurant & Additional Taxes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Restaurant (Non-AC) Tax %</label>
              <Input type="number" step="0.01" {...register('restaurant_non_ac_rate')} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Restaurant (AC) Tax %</label>
              <Input type="number" step="0.01" {...register('restaurant_ac_rate')} />
            </div>

            <div className="col-span-full border-t border-slate-100 dark:border-white/5 pt-4 mt-2">
              <div className="flex items-center gap-4 mb-4">
                <input 
                  type="checkbox" 
                  id="luxury_tax_applicable" 
                  {...register('luxury_tax_applicable')} 
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="luxury_tax_applicable" className="text-sm font-medium">Apply State Luxury Tax (if applicable)</label>
              </div>

              {watch('luxury_tax_applicable') && (
                <div className="max-w-xs">
                  <label className="block text-sm font-semibold mb-1">Luxury Tax Rate %</label>
                  <Input type="number" step="0.01" {...register('luxury_tax_rate')} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updateConfig.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateConfig.isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>

      </form>
    </div>
  );
}
