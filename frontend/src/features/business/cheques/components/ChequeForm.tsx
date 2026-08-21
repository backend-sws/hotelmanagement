import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Loader2, FileText, User, Building2, Landmark, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chequeService, type ChequePayload } from '../api/chequeService';
import { useCustomers } from '@/features/business/customers/api/useCustomers';
import { useSuppliers } from '@/features/business/suppliers/api/useSuppliers';
import { toast } from 'sonner';

interface ChequeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bankAccounts: any[];
  defaultType?: 'received' | 'issued';
}

export const ChequeForm: React.FC<ChequeFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bankAccounts,
  defaultType = 'received'
}) => {
  const [type, setType] = useState<'received' | 'issued'>(defaultType);
  const [chequeNumber, setChequeNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [chequeDate, setChequeDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [partyType, setPartyType] = useState<string>('customer');
  const [partyId, setPartyId] = useState<number | undefined>(undefined);
  const [inFavourOf, setInFavourOf] = useState('');
  const [bankAccountId, setBankAccountId] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Parties
  const { data: customersResponse } = useCustomers(1, 100);
  const { data: suppliersResponse } = useSuppliers(1, 500);
  const customers = customersResponse?.data || [];
  const suppliers = suppliersResponse?.data || [];

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setPartyType(defaultType === 'received' ? 'customer' : 'supplier');
      if (bankAccounts.length > 0 && !bankAccountId) {
        setBankAccountId(bankAccounts.find(b => b.is_default)?.id || bankAccounts[0]?.id);
      }
    }
  }, [isOpen, defaultType, bankAccounts]);

  const handleTypeChange = (val: 'received' | 'issued') => {
    setType(val);
    setPartyType(val === 'received' ? 'customer' : 'supplier');
    setPartyId(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chequeNumber || !bankName || !amount || parseFloat(amount) <= 0) {
      toast.error('Please complete required cheque details & positive amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ChequePayload = {
        cheque_number: chequeNumber,
        bank_name: bankName,
        branch: branch || undefined,
        cheque_date: chequeDate,
        amount: parseFloat(amount),
        type,
        party_type: partyType,
        party_id: partyId,
        in_favour_of: inFavourOf || (type === 'received' ? 'Company Account' : undefined),
        bank_account_id: bankAccountId,
        notes: notes || undefined,
      };

      await chequeService.store(payload);
      toast.success('Cheque recorded in register successfully!');
      onSuccess();
      onClose();
      // Reset
      setChequeNumber('');
      setBankName('');
      setBranch('');
      setAmount('');
      setInFavourOf('');
      setNotes('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to record cheque');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f0f12] rounded-3xl border border-slate-200/80 dark:border-white/10 max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] ring-1 ring-slate-900/5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-5">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-wide">
              Record New Cheque Entry
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Log customer incoming cheques or supplier outgoing post-dated cheques.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('received')}
              className={`py-3 px-4 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                type === 'received'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-sm font-extrabold'
                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5 bg-white dark:bg-zinc-900'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Received from Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('issued')}
              className={`py-3 px-4 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                type === 'issued'
                  ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-sm font-extrabold'
                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5 bg-white dark:bg-zinc-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Issued to Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Cheque Number *
              </label>
              <input
                type="text"
                placeholder="e.g., 001234"
                value={chequeNumber}
                onChange={(e) => setChequeNumber(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-black text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Bank Name *
              </label>
              <input
                type="text"
                placeholder="e.g., ICICI Bank or HDFC"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Cheque Date (Printed Date) *
              </label>
              <input
                type="date"
                value={chequeDate}
                onChange={(e) => setChequeDate(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Party Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
              {type === 'received' ? 'Select Customer Account' : 'Select Supplier / Vendor Account'} (Optional)
            </label>
            <select
              value={partyId || ''}
              onChange={(e) => setPartyId(Number(e.target.value) || undefined)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm"
            >
              <option value="">-- No Party Linked --</option>
              {type === 'received'
                ? (customers || []).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} (Balance: ₹{c.current_balance || 0})</option>
                  ))
                : (suppliers || []).map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} (Payables: ₹{s.balance_due || 0})</option>
                  ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              ✨ When this cheque is cleared, the selected party&apos;s Udhar Khata will be updated automatically!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                In Favour Of (Payee Name)
              </label>
              <input
                type="text"
                placeholder={type === 'received' ? 'Your Company Name' : 'Supplier Business Name'}
                value={inFavourOf}
                onChange={(e) => setInFavourOf(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Bank Branch
              </label>
              <input
                type="text"
                placeholder="e.g., MG Road Branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Target Company Bank Account */}
          {bankAccounts.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Target Deposit Bank Account
              </label>
              <select
                value={bankAccountId || ''}
                onChange={(e) => setBankAccountId(Number(e.target.value) || undefined)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm"
              >
                <option value="">-- Default / Decide Later --</option>
                {bankAccounts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.account_name} ({b.bank_name}) - Current Bal: ₹{b.current_balance}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Notes / Memo
            </label>
            <input
              type="text"
              placeholder="e.g., PDC given against Invoice #INV-204"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 px-5 rounded-xl font-bold uppercase text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl font-black uppercase tracking-wider text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Cheque Entry
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
