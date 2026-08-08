import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, DollarSign, CreditCard, Banknote, QrCode, Split } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAddBookingPayment } from '../api/useBookings';
import type { HotelBooking } from '../schemas/bookingSchema';

interface CollectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: HotelBooking | null;
}

export function CollectPaymentModal({ isOpen, onClose, booking }: CollectPaymentModalProps) {
  const addPayment = useAddBookingPayment();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSplit, setIsSplit] = useState(false);

  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card' | 'bank_transfer'>('cash');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Split payment state
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitUpi, setSplitUpi] = useState<number>(0);
  const [splitCard, setSplitCard] = useState<number>(0);
  const [splitBank, setSplitBank] = useState<number>(0);

  useEffect(() => {
    if (booking && isOpen) {
      const balance = Math.max(0, (booking.balance_due || 0));
      setAmount(balance);
      setSplitCash(balance);
      setSplitUpi(0);
      setSplitCard(0);
      setSplitBank(0);
      setIsSplit(false);
      setNotes('Payment Collection');
    }
  }, [booking, isOpen]);

  if (!isOpen || !booking) return null;

  const totalSplitAmount = (Number(splitCash) || 0) + (Number(splitUpi) || 0) + (Number(splitCard) || 0) + (Number(splitBank) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (isSplit) {
        if (totalSplitAmount <= 0) {
          toast.error('Please enter an amount greater than 0');
          return;
        }
        const splits = [];
        if (splitCash > 0) splits.push({ payment_mode: 'cash', amount: Number(splitCash) });
        if (splitUpi > 0) splits.push({ payment_mode: 'upi', amount: Number(splitUpi) });
        if (splitCard > 0) splits.push({ payment_mode: 'card', amount: Number(splitCard) });
        if (splitBank > 0) splits.push({ payment_mode: 'bank_transfer', amount: Number(splitBank) });

        await addPayment.mutateAsync({
          bookingId: booking.id!,
          data: {
            split_payments: splits,
            notes: notes || 'Split Payment Collection',
          },
        });
      } else {
        if (amount <= 0) {
          toast.error('Please enter a valid payment amount');
          return;
        }
        await addPayment.mutateAsync({
          bookingId: booking.id!,
          data: {
            amount: Number(amount),
            payment_mode: paymentMode,
            notes: notes || 'Payment Collection',
          },
        });
      }
      toast.success('Payment recorded successfully');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Collect Payment — ${booking.booking_number}`}
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button size="sm" form="collect-payment-form" type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Payment (₹{(isSplit ? totalSplitAmount : amount).toLocaleString()})
          </Button>
        </div>
      }
    >
      <form id="collect-payment-form" onSubmit={handleSubmit} className="space-y-5">
        
        {/* Balance Display */}
        <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Remaining Balance</div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              ₹{(booking.balance_due || 0).toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Guest Name</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{booking.guest?.name}</div>
          </div>
        </div>

        {/* Payment Mode Selector */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Payment Type</label>
            <button
              type="button"
              onClick={() => setIsSplit(!isSplit)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 hover:underline"
            >
              <Split className="w-3.5 h-3.5" />
              {isSplit ? 'Single Payment' : 'Split Payment (Multiple Modes)'}
            </button>
          </div>

          {!isSplit ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Payment Mode</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'cash', label: 'Cash', icon: Banknote },
                    { id: 'upi', label: 'UPI', icon: QrCode },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'bank_transfer', label: 'Bank', icon: DollarSign },
                  ].map(item => {
                    const Icon = item.icon;
                    const active = paymentMode === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPaymentMode(item.id as any)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Amount to Collect (₹)</label>
                <Input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="h-11 font-black text-lg text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#111118] rounded-xl"
                />
              </div>
            </div>
          ) : (
            /* Split Payment Breakdown */
            <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-emerald-500" /> Cash (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={splitCash}
                    onChange={e => setSplitCash(Number(e.target.value))}
                    className="h-10 font-bold bg-white dark:bg-[#111118] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-blue-500" /> UPI / QR (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={splitUpi}
                    onChange={e => setSplitUpi(Number(e.target.value))}
                    className="h-10 font-bold bg-white dark:bg-[#111118] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-purple-500" /> Card (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={splitCard}
                    onChange={e => setSplitCard(Number(e.target.value))}
                    className="h-10 font-bold bg-white dark:bg-[#111118] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Bank Transfer (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={splitBank}
                    onChange={e => setSplitBank(Number(e.target.value))}
                    className="h-10 font-bold bg-white dark:bg-[#111118] rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-slate-200/50 dark:border-white/5">
                <span className="text-slate-500">Total Split Amount:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-black">₹{totalSplitAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Payment Remarks / Notes</label>
            <Input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Part payment via GPay + Cash"
              className="h-11 bg-white dark:bg-[#111118] rounded-xl"
            />
          </div>
        </div>

      </form>
    </Modal>
  );
}
