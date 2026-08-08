import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAddFolioCharge } from '../api/useBookings';
import { useEffect } from 'react';

interface FolioManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
}

export function FolioManagerModal({ isOpen, onClose, bookingId }: FolioManagerModalProps) {
  const addCharge = useAddFolioCharge();

  const { register, handleSubmit, formState: { isSubmitting }, reset, watch, setValue } = useForm({
    defaultValues: {
      charge_type: 'restaurant',
      description: '',
      charge_date: new Date().toISOString().substring(0, 10),
      qty: 1,
      unit_price: 0,
      tax_percent: 0,
    }
  });

  const qty = watch('qty');
  const unitPrice = watch('unit_price');
  const taxPercent = watch('tax_percent');

  const total = qty * unitPrice;
  const taxAmount = (total * taxPercent) / 100;
  const grandTotal = total + taxAmount;

  useEffect(() => {
    if (isOpen) {
      reset({
        charge_type: 'restaurant',
        description: '',
        charge_date: new Date().toISOString().substring(0, 10),
        qty: 1,
        unit_price: 0,
        tax_percent: 0,
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: any) => {
    try {
      await addCharge.mutateAsync({ bookingId, data });
      toast.success('Charge added to folio');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add charge');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Extra Charge"
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button size="sm" form="folio-form" type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Add Charge
          </Button>
        </div>
      }
    >
      <form id="folio-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Charge Category</label>
          <Select {...register('charge_type')}>
            <option value="room_service">Room Service</option>
            <option value="restaurant">Restaurant</option>
            <option value="laundry">Laundry</option>
            <option value="minibar">Mini Bar</option>
            <option value="spa">Spa & Wellness</option>
            <option value="extra_bed">Extra Bed</option>
            <option value="early_checkin">Early Check-in</option>
            <option value="late_checkout">Late Check-out</option>
            <option value="other">Other</option>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Description (Item/Service)</label>
          <Input {...register('description', { required: true })} placeholder="e.g. 2x Coffee, Sandwich" />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Date</label>
          <Input type="date" {...register('charge_date')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Quantity</label>
            <Input type="number" min="0.1" step="0.1" {...register('qty', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Unit Price (₹)</label>
            <Input type="number" min="0" {...register('unit_price', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-4 mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500">Subtotal</span>
            <span className="font-semibold">₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500">Tax (%)</span>
            <Input 
              type="number" 
              className="w-20 h-8 text-right bg-white dark:bg-black/40" 
              {...register('tax_percent', { valueAsNumber: true })} 
            />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/10">
            <span className="text-sm font-bold">Total Amount</span>
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </form>
    </Modal>
  );
}
