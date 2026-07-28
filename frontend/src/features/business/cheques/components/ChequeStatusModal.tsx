import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Loader2, Landmark, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chequeService } from '../api/chequeService';
import { toast } from 'sonner';

interface ChequeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cheque: any;
  targetStatus: 'deposited' | 'cleared' | 'bounced' | 'cancelled' | null;
  bankAccounts: any[];
}

export const ChequeStatusModal: React.FC<ChequeStatusModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  cheque,
  targetStatus,
  bankAccounts
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bounceReason, setBounceReason] = useState<string>('Insufficient funds / Signature mismatch');
  const [bankAccountId, setBankAccountId] = useState<number | undefined>(cheque?.bank_account_id || undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !cheque || !targetStatus) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = { status: targetStatus };
      if (bankAccountId) payload.bank_account_id = bankAccountId;

      if (targetStatus === 'deposited') payload.deposit_date = date;
      if (targetStatus === 'cleared') payload.clearance_date = date;
      if (targetStatus === 'bounced') {
        payload.bounce_date = date;
        payload.bounce_reason = bounceReason;
      }

      await chequeService.updateStatus(cheque.id, payload);
      
      if (targetStatus === 'cleared') {
        toast.success('🎉 Cheque CLEARED! Bank account balance credited & Party Khata updated automatically!');
      } else if (targetStatus === 'bounced') {
        toast.error('⚠️ Cheque marked as BOUNCED. Outstanding ledger adjusted.');
      } else {
        toast.success(`Cheque status updated to ${targetStatus.toUpperCase()}`);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update cheque status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    if (targetStatus === 'deposited') return 'Mark Cheque as Deposited in Bank';
    if (targetStatus === 'cleared') return 'Mark Cheque as Cleared & Realized';
    if (targetStatus === 'bounced') return 'Mark Cheque as Bounced / Dishonoured';
    return 'Update Cheque Status';
  };

  const getIcon = () => {
    if (targetStatus === 'deposited') return <Landmark className="w-5 h-5 text-blue-500" />;
    if (targetStatus === 'cleared') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    return <AlertTriangle className="w-5 h-5 text-rose-500" />;
  };

  const getBtnColor = () => {
    if (targetStatus === 'deposited') return 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20';
    if (targetStatus === 'cleared') return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20';
    return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20';
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f0f12] rounded-3xl border border-slate-200/80 dark:border-white/10 max-w-md w-full p-6 shadow-2xl ring-1 ring-slate-900/5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-wide">
                {getTitle()}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                CHQ #{cheque.cheque_number} • ₹{cheque.amount}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {targetStatus !== 'cancelled' && (
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                {targetStatus === 'deposited' ? 'Deposit Date *' : targetStatus === 'cleared' ? 'Clearance Date *' : 'Bounce / Dishonour Date *'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm"
              />
            </div>
          )}

          {['deposited', 'cleared'].includes(targetStatus as any) && bankAccounts.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Select Bank Account
              </label>
              <select
                value={bankAccountId || ''}
                onChange={(e) => setBankAccountId(Number(e.target.value) || undefined)}
                required={targetStatus === 'cleared'}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm"
              >
                <option value="">-- Choose Account --</option>
                {bankAccounts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.account_name} ({b.bank_name} - ₹{b.current_balance})
                  </option>
                ))}
              </select>
              {targetStatus === 'cleared' && (
                <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                  ✨ The bank running balance will automatically increase by ₹{cheque.amount}!
                </p>
              )}
            </div>
          )}

          {targetStatus === 'bounced' && (
            <div>
              <label className="block text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                Bounce Reason / Remarks *
              </label>
              <input
                type="text"
                value={bounceReason}
                onChange={(e) => setBounceReason(e.target.value)}
                placeholder="e.g., Insufficient funds or Signature discrepancy"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-[11px] font-semibold text-rose-500 mt-1">
                ⚠️ The party&apos;s Udhar balance will immediately reflect this returned cheque!
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="h-11 px-5 rounded-xl font-bold uppercase text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className={`h-11 px-6 rounded-xl font-black uppercase tracking-wider text-xs shadow-md ${getBtnColor()}`}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Confirm {targetStatus}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
