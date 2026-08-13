import React from 'react';
import { useForm } from 'react-hook-form';
import { useRecordCorporatePayment } from '../api/useCorporate';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string | number;
}

export function RecordPaymentModal({ isOpen, onClose, accountId }: RecordPaymentModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const recordPayment = useRecordCorporatePayment();

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      amount: Number(data.amount),
    };

    recordPayment.mutate({
      id: accountId,
      data: payload
    }, {
      onSuccess: () => {
        toast.success('Payment recorded successfully');
        reset();
        onClose();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to record payment');
      }
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Record Payment" 
      description="Register a payment received from this corporate client."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div>
          <label className="block text-sm font-semibold mb-1">Payment Amount (₹) *</label>
          <Input type="number" step="0.01" {...register('amount', { required: true, min: 1 })} placeholder="e.g. 5000" />
          {errors.amount && <span className="text-xs text-red-500">Please enter a valid amount</span>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Payment Date *</label>
          <Input type="date" {...register('payment_date', { required: true })} defaultValue={new Date().toISOString().split('T')[0]} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Payment Mode *</label>
          <select 
            {...register('payment_mode', { required: true })}
            className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-[#09090b] dark:ring-offset-slate-950 dark:focus:ring-slate-300"
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cheque">Cheque</option>
            <option value="upi">UPI</option>
            <option value="neft">NEFT</option>
            <option value="rtgs">RTGS</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Transaction Ref / Cheque No.</label>
          <Input {...register('transaction_ref')} placeholder="e.g. TXN123456789" />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1">Notes (Optional)</label>
          <Input {...register('notes')} placeholder="Any additional details..." />
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-slate-100 dark:border-white/5">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={recordPayment.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {recordPayment.isPending ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
