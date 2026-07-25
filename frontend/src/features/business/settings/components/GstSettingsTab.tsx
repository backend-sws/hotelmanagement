import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { DynamicForm } from '@/components/ui/dynamic-form';
import { useGstSettings, useUpdateGstSettings } from '../api/useGstSettings';
import { toast } from 'sonner';
import { useTenantStore } from '@/store/tenantStore';

export function GstSettingsTab() {
  const { data: gstData, isLoading } = useGstSettings();
  const updateMutation = useUpdateGstSettings();
  const { activeBusiness } = useTenantStore();

  const form = useForm({
    defaultValues: {
      gstin: '',
      legal_name: '',
      trade_name: '',
      composition_scheme: false,
      default_hsn: '',
      default_gst_rate: 18,
      business_type: activeBusiness?.settings?.business_type || 'dealer',
    }
  });

  const { reset, formState: { isSubmitting } } = form;

  useEffect(() => {
    if (gstData?.data) {
      reset({
        ...gstData.data,
        business_type: activeBusiness?.settings?.business_type || 'dealer',
      });
    }
  }, [gstData, reset, activeBusiness]);

  const onSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success('GST settings updated successfully');
    } catch (error) {
      toast.error('Failed to update GST settings');
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tax & Billing Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure your GSTIN and default tax rates for billing.</p>
      </div>

      <DynamicForm
        id="gst-settings-form"
        form={form}
        onSubmit={onSubmit}
        sections={[
          {
            title: 'Business Classification',
            fields: [
              {
                name: 'business_type',
                label: 'Business Type',
                type: 'select',
                options: [
                  { value: 'dealer', label: 'Retailer / Dealer' },
                  { value: 'contractor', label: 'Contractor / Builder' },
                  { value: 'interior', label: 'Interior Designer' },
                  { value: 'mixed', label: 'Mixed Operations' },
                ],
                required: true,
                colSpan: 2,
              }
            ]
          },
          {
            title: 'GST Details',
            fields: [
              {
                name: 'gstin',
                label: 'GSTIN',
                type: 'text',
                placeholder: 'e.g. 22AAAAA0000A1Z5',
              },
              {
                name: 'composition_scheme',
                label: 'Composition Scheme',
                type: 'checkbox',
                tooltip: 'Enable if your business is registered under the GST Composition Scheme.',
              },
              {
                name: 'legal_name',
                label: 'Legal Name',
                type: 'text',
              },
              {
                name: 'trade_name',
                label: 'Trade Name',
                type: 'text',
              },
            ]
          },
          {
            title: 'Default Tax Settings',
            fields: [
              {
                name: 'default_hsn',
                label: 'Default HSN Code',
                type: 'text',
              },
              {
                name: 'default_gst_rate',
                label: 'Default GST Rate (%)',
                type: 'number',
              },
            ]
          }
        ]}
      />

      <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex justify-end">
        <Button 
          type="submit" 
          form="gst-settings-form" 
          disabled={isSubmitting} 
          className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 px-10 h-12 rounded-xl text-sm font-bold tracking-wide transition-all hover:scale-[1.02]"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Save GST Settings
        </Button>
      </div>
    </div>
  );
}
