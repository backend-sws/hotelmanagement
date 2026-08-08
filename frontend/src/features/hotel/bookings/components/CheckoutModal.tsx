import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCheckOutBooking } from '../api/useBookings';
import type { HotelBooking } from '../schemas/bookingSchema';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: HotelBooking;
}

export function CheckoutModal({ isOpen, onClose, booking }: CheckoutModalProps) {
  const checkOut = useCheckOutBooking();
  const [paymentMode, setPaymentMode] = useState('cash');
  const [amountPaid, setAmountPaid] = useState<number>(booking.balance_due || 0);

  const handleCheckout = async () => {
    try {
      await checkOut.mutateAsync({
        id: booking.id!,
        data: { payment_mode: paymentMode, amount_paid: amountPaid }
      });
      toast.success('Successfully checked out');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to check out');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Check Out & Final Settlement"
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={checkOut.isPending}>Cancel</Button>
          <Button size="sm" onClick={handleCheckout} disabled={checkOut.isPending} className="bg-red-600 hover:bg-red-700 text-white">
            {checkOut.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Checkout
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 text-sm">Grand Total</span>
            <span className="font-bold">₹{(booking.grand_total || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 text-sm">Amount Paid</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{(booking.amount_paid || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/10 mt-2">
            <span className="font-bold">Balance Due</span>
            <span className="font-bold text-xl text-red-600 dark:text-red-400">₹{(booking.balance_due || 0).toLocaleString()}</span>
          </div>
        </div>

        {booking.balance_due! > 0 && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm">Record Final Payment</h4>
            <div>
              <label className="block text-xs font-semibold mb-1">Amount Collecting Now</label>
              <Input 
                type="number" 
                value={amountPaid} 
                onChange={(e) => setAmountPaid(Number(e.target.value))} 
                max={booking.balance_due}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Payment Mode</label>
              <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="upi">UPI / QR</option>
                <option value="card">Credit/Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="corporate">Bill to Corporate (City Ledger)</option>
              </Select>
            </div>
          </div>
        )}

        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg text-xs border border-red-100 dark:border-red-900/30">
          <strong>Note:</strong> Checking out will mark the room as Dirty and close this folio. Additional charges cannot be added after checkout.
        </div>
      </div>
    </Modal>
  );
}
