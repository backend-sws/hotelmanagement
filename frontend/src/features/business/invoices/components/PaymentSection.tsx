import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Wallet, CreditCard, IndianRupee, CheckCircle2, AlertCircle } from 'lucide-react';

interface PaymentSectionProps {
  grandTotal: number;
  paidAmount: number;
  paymentMode: string;
  onPaidAmountChange: (val: number) => void;
  onPaymentModeChange: (val: string) => void;
}

export function PaymentSection({
  grandTotal, paidAmount, paymentMode,
  onPaidAmountChange, onPaymentModeChange
}: PaymentSectionProps) {
  const balanceDue = Math.max(0, grandTotal - paidAmount);

  return (
    <div className="pt-4 space-y-4 border-t border-slate-200 dark:border-white/10">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Amount Paid
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
            <Input 
              type="number" 
              min="0"
              className="h-9 pl-7 pr-2 font-bold text-sm bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10"
              value={paidAmount || ''} 
              placeholder="0.00"
              onChange={e => onPaidAmountChange(Number(e.target.value) || 0)} 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-blue-500" /> Payment Mode
          </label>
          <Select 
            value={paymentMode} 
            onChange={(e) => onPaymentModeChange(e.target.value)}
            className="h-9 text-xs bg-slate-50 dark:bg-white/[0.02]"
          >
            <option value="Cash">💵 Cash</option>
            <option value="UPI">⚡ UPI / GPay / PhonePe</option>
            <option value="Bank Transfer">🏦 Bank Transfer (NEFT/RTGS)</option>
            <option value="Cheque">📜 Cheque</option>
            <option value="Credit Card">💳 Credit Card</option>
          </Select>
        </div>
      </div>
      
      {/* Dynamic Balance Due Banner */}
      <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
        balanceDue > 0 
          ? 'bg-rose-50/80 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/30 shadow-sm shadow-rose-500/5' 
          : 'bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30 shadow-sm shadow-emerald-500/5'
      }`}>
        <div className="flex items-center gap-2">
          {balanceDue > 0 ? (
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider">
            {balanceDue > 0 ? 'Balance Due (Udhar)' : 'Fully Paid / Settled'}
          </span>
        </div>
        <span className="font-display font-black text-lg">₹{balanceDue.toFixed(2)}</span>
      </div>
    </div>
  );
}
