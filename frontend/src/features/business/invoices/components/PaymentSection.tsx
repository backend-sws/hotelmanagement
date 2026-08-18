import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Wallet, CreditCard, IndianRupee, CheckCircle2, AlertCircle } from 'lucide-react';

interface PaymentSectionProps {
  grandTotal: number;
  paidAmount: number;
  paymentMode: string;
  splitPayments?: { mode: string; amount: number }[];
  onPaidAmountChange: (val: number) => void;
  onPaymentModeChange: (val: string) => void;
  onSplitPaymentsChange?: (payments: { mode: string; amount: number }[]) => void;
}

export function PaymentSection({
  grandTotal, paidAmount, paymentMode, splitPayments,
  onPaidAmountChange, onPaymentModeChange, onSplitPaymentsChange
}: PaymentSectionProps) {
  const balanceDue = Math.max(0, grandTotal - paidAmount);

  return (
    <div className="pt-4 space-y-4 border-t border-slate-200 dark:border-white/10">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Amount Paid
            </span>
            {paymentMode === 'Split' && (
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded">
                Auto Sum
              </span>
            )}
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
            <Input 
              id="input-paid-amount"
              type="number" 
              min="0"
              disabled={paymentMode === 'Split'}
              className={`h-9 pl-7 pr-2 font-bold text-sm bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 ${
                paymentMode === 'Split' ? 'opacity-80 cursor-not-allowed bg-purple-50/30 dark:bg-purple-950/10 text-purple-900 dark:text-purple-300 font-black' : ''
              }`}
              value={paidAmount || ''} 
              placeholder="0.00"
              onFocus={e => e.target.select()}
              onChange={e => onPaidAmountChange(Number(e.target.value) || 0)} 
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // Trigger primary save/print action
                  document.getElementById('btn-save-pdf')?.click();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  document.getElementById('item-search-input')?.focus();
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-blue-500" /> Payment Mode
          </label>
          <Select 
            value={paymentMode} 
            onChange={(e) => {
              const val = e.target.value;
              onPaymentModeChange(val);
              if (val === 'Split' && splitPayments && onSplitPaymentsChange) {
                // Initialize split payments if zero
                const total = splitPayments.reduce((a, b) => a + Number(b.amount || 0), 0);
                if (total === 0 && grandTotal > 0) {
                  const newPayments = [
                    { mode: 'Cash', amount: Number((grandTotal / 2).toFixed(2)) },
                    { mode: 'UPI', amount: Number((grandTotal - Number((grandTotal / 2).toFixed(2))).toFixed(2)) }
                  ];
                  onSplitPaymentsChange(newPayments);
                  onPaidAmountChange(grandTotal);
                } else {
                  onPaidAmountChange(total);
                }
              }
            }}
            className="h-9 text-xs bg-slate-50 dark:bg-white/[0.02] font-semibold"
          >
            <option value="Cash">💵 Cash</option>
            <option value="UPI">⚡ UPI / GPay / PhonePe</option>
            <option value="Bank Transfer">🏦 Bank Transfer (NEFT/RTGS)</option>
            <option value="Cheque">📜 Cheque</option>
            <option value="Credit Card">💳 Credit Card</option>
            <option value="Split">🔀 Split Payment (Cash + Online)</option>
          </Select>
        </div>
      </div>

      {/* Split Payment Breakdown UI */}
      {paymentMode === 'Split' && splitPayments && onSplitPaymentsChange && (
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50/80 via-slate-50 to-indigo-50/50 dark:from-purple-950/30 dark:via-slate-900 dark:to-indigo-950/20 border border-purple-200 dark:border-purple-800/40 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <span>🔀 Split Payment Details</span>
            </h4>
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 bg-purple-100/80 dark:bg-purple-900/50 px-2 py-0.5 rounded-full">
              Total: ₹{splitPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0).toFixed(2)}
            </span>
          </div>

          <div className="space-y-2.5">
            {splitPayments.map((p, index) => (
              <div key={index} className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-[42%] sm:w-48 shrink-0">
                  {index === 0 ? (
                    <div className="h-9 px-3 bg-white dark:bg-slate-950 rounded-lg border border-purple-200 dark:border-white/10 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 w-full truncate shadow-2xs">
                      <span>💵</span> Cash Mode
                    </div>
                  ) : (
                    <Select 
                      value={p.mode} 
                      onChange={(e) => {
                        const newPayments = [...splitPayments];
                        newPayments[index].mode = e.target.value;
                        onSplitPaymentsChange(newPayments);
                      }}
                      className="h-9 text-xs bg-white dark:bg-slate-950 font-bold border-purple-200 dark:border-white/10 w-full shadow-2xs"
                    >
                      <option value="UPI">⚡ UPI / Online</option>
                      <option value="Bank Transfer">🏦 Bank Transfer</option>
                      <option value="Credit Card">💳 Credit Card</option>
                      <option value="Cheque">📜 Cheque</option>
                    </Select>
                  )}
                </div>
                
                <div className="relative flex-1 min-w-[120px]">
                  <span className="absolute left-3 top-2 text-xs font-black text-purple-600 dark:text-purple-400">₹</span>
                  <Input 
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={p.amount || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const newPayments = [...splitPayments];
                      newPayments[index].amount = val;
                      onSplitPaymentsChange(newPayments);
                      
                      const newTotal = newPayments.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
                      onPaidAmountChange(newTotal);
                    }}
                    className="h-9 pl-7 pr-3 text-sm font-black bg-white dark:bg-slate-950 border-purple-200 dark:border-white/10 text-right w-full tracking-wide shadow-2xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-purple-100 dark:border-purple-900/30">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Enter cash & online breakdown
            </span>
            <button
              type="button"
              onClick={() => {
                const cash = Number(splitPayments[0]?.amount) || 0;
                const remain = Math.max(0, grandTotal - cash);
                const newPayments = [...splitPayments];
                if (newPayments[1]) {
                  newPayments[1].amount = Number(remain.toFixed(2));
                }
                onSplitPaymentsChange(newPayments);
                onPaidAmountChange(cash + remain);
              }}
              className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 bg-white dark:bg-purple-900/40 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800/50 shadow-2xs transition-transform active:scale-95"
            >
              ⚡ Auto-Fill Online (₹{(Math.max(0, grandTotal - (Number(splitPayments[0]?.amount) || 0))).toFixed(2)})
            </button>
          </div>
        </div>
      )}
      
      {/* Dynamic Balance Due Banner */}
      <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
        balanceDue > 0 
          ? 'bg-rose-50/80 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/30 shadow-xs shadow-rose-500/5' 
          : 'bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30 shadow-xs shadow-emerald-500/5'
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
