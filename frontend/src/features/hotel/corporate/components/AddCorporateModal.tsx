import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCorporateAccount } from '../api/useCorporate';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddCorporateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCorporateModal({ isOpen, onClose }: AddCorporateModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const createAccount = useCreateCorporateAccount();

  const onSubmit = (data: any) => {
    // Format numbers
    const payload = {
      ...data,
      credit_limit: Number(data.credit_limit || 0),
      credit_days: Number(data.credit_days || 30),
      discount_percent: Number(data.discount_percent || 0),
    };

    createAccount.mutate(payload, {
      onSuccess: () => {
        toast.success('Corporate account created successfully');
        reset();
        onClose();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to create account');
      }
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="New Corporate Account" 
      description="Create a city ledger account for a business client."
      maxWidth="xl"
    >
      <form id="add-corporate-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Company Name *</label>
            <Input {...register('company_name', { required: true })} placeholder="e.g. Infosys Ltd." />
            {errors.company_name && <span className="text-xs text-red-500">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">GST Number</label>
            <Input {...register('gst_number')} placeholder="27AADCB2230M1Z2" className="uppercase" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Contact Person</label>
            <Input {...register('contact_person')} placeholder="John Doe" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Contact Phone</label>
            <Input {...register('contact_phone')} placeholder="+91 9876543210" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Contact Email</label>
            <Input type="email" {...register('contact_email')} placeholder="john@company.com" />
          </div>

          <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-white/5">
            <h4 className="font-bold text-sm mb-4">Financial Terms</h4>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Credit Limit (₹) *</label>
            <Input type="number" {...register('credit_limit', { required: true })} placeholder="50000" />
            {errors.credit_limit && <span className="text-xs text-red-500">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Billing Cycle *</label>
            <select 
              {...register('billing_cycle', { required: true })}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-[#09090b] dark:ring-offset-slate-950 dark:focus:ring-slate-300"
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Credit Days *</label>
            <Input type="number" {...register('credit_days', { required: true })} defaultValue={30} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Discount (%)</label>
            <Input type="number" step="0.01" {...register('discount_percent')} defaultValue={0} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-slate-100 dark:border-white/5">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={createAccount.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {createAccount.isPending ? 'Creating...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
