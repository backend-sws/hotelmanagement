import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Loader2, DollarSign, User, Building2, Landmark, CreditCard, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cashbookService, type CashBankEntryPayload } from '../api/cashbookService';
import { useCustomers } from '@/features/business/customers/api/useCustomers';
import { useSuppliers } from '@/features/business/suppliers/api/useSuppliers';
import { toast } from 'sonner';

interface CashEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bankAccounts: any[];
  defaultEntryType?: 'cash_receipt' | 'cash_payment' | 'bank_receipt' | 'bank_payment';
}

export const CashEntryForm: React.FC<CashEntryFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bankAccounts,
  defaultEntryType = 'cash_receipt'
}) => {
  const [entryType, setEntryType] = useState<'cash_receipt' | 'cash_payment' | 'bank_receipt' | 'bank_payment'>(defaultEntryType);
  const [bankAccountId, setBankAccountId] = useState<number | undefined>(undefined);
  const [partyType, setPartyType] = useState<string>('none'); // none, customer, supplier, other, expense
  const [partyId, setPartyId] = useState<number | undefined>(undefined);
  const [amount, setAmount] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<string>('cash');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [narration, setNarration] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load Customers & Suppliers when partyType changes
  const { data: customersResponse } = useCustomers(1, 100);
  const { data: suppliersResponse } = useSuppliers(1);
  const customers = customersResponse?.data || [];
  const suppliers = suppliersResponse?.data || [];

  useEffect(() => {
    if (isOpen) {
      setEntryType(defaultEntryType);
      if (defaultEntryType.startsWith('bank')) {
        setPaymentMode('upi');
        if (bankAccounts.length > 0 && !bankAccountId) {
          setBankAccountId(bankAccounts[0].id);
        }
      } else {
        setPaymentMode('cash');
      }
    }
  }, [isOpen, defaultEntryType, bankAccounts]);

  const handleTypeChange = (newType: 'cash_receipt' | 'cash_payment' | 'bank_receipt' | 'bank_payment') => {
    setEntryType(newType);
    if (newType.startsWith('bank')) {
      setPaymentMode('upi');
      if (bankAccounts.length > 0 && !bankAccountId) {
        setBankAccountId(bankAccounts[0].id);
      }
    } else {
      setPaymentMode('cash');
      setBankAccountId(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!numAmt || numAmt <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    if (entryType.startsWith('bank') && !bankAccountId && bankAccounts.length > 0) {
      toast.error('Please select a bank account');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CashBankEntryPayload = {
        entry_type: entryType,
        account_type: entryType.startsWith('bank') ? 'bank' : 'cash',
        bank_account_id: entryType.startsWith('bank') ? bankAccountId : undefined,
        party_type: partyType === 'none' ? undefined : (partyType as any),
        party_id: partyType !== 'none' ? partyId : undefined,
        amount: numAmt,
        payment_mode: paymentMode,
        reference_no: referenceNo || undefined,
        narration: narration || (entryType.includes('receipt') ? 'Amount Received' : 'Amount Paid'),
        date: date
      };

      await cashbookService.store(payload);
      toast.success('Transaction recorded & ledgers synced successfully!');
      onSuccess();
      onClose();
      // Reset form
      setAmount('');
      setReferenceNo('');
      setNarration('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to record transaction');
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
              Record Cash or Bank Entry
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Updates your day book, bank running balances & party Khata automatically.
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
          {/* Entry Type Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Entry Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { 
                  id: 'cash_receipt', 
                  label: 'Cash Receipt (+)', 
                  icon: <ArrowDownRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
                  active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-sm font-extrabold' 
                },
                { 
                  id: 'cash_payment', 
                  label: 'Cash Payment (-)', 
                  icon: <ArrowUpRight className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
                  active: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/80 ring-2 ring-rose-500/20 shadow-sm font-extrabold' 
                },
                { 
                  id: 'bank_receipt', 
                  label: 'Bank Receipt (+)', 
                  icon: <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
                  active: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/80 ring-2 ring-blue-500/20 shadow-sm font-extrabold' 
                },
                { 
                  id: 'bank_payment', 
                  label: 'Bank Payment (-)', 
                  icon: <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
                  active: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/80 ring-2 ring-amber-500/20 shadow-sm font-extrabold' 
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTypeChange(t.id as any)}
                  className={`py-3 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    entryType === t.id
                      ? t.active
                      : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5 bg-white dark:bg-zinc-900'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bank Account dropdown if Bank Entry */}
          {entryType.startsWith('bank') && (
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Select Bank Account *
              </label>
              <select
                value={bankAccountId || ''}
                onChange={(e) => setBankAccountId(Number(e.target.value))}
                required={entryType.startsWith('bank')}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">-- Choose Bank Account --</option>
                {bankAccounts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.account_name} ({b.bank_name} - ₹{b.current_balance})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount and Date Grid */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Party Linkage Section */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                Link to Party Khata (Optional)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setPartyType('none'); setPartyId(undefined); }}
                className={`h-9.5 py-2 px-2 text-xs rounded-xl font-bold flex items-center justify-center transition-all border ${
                  partyType === 'none' 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm font-extrabold' 
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                None
              </button>
              <button
                type="button"
                onClick={() => { setPartyType('customer'); setPartyId(undefined); }}
                className={`h-9.5 py-2 px-2.5 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  partyType === 'customer' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-extrabold' 
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Customer Udhar</span>
              </button>
              <button
                type="button"
                onClick={() => { setPartyType('supplier'); setPartyId(undefined); }}
                className={`h-9.5 py-2 px-2.5 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  partyType === 'supplier' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-extrabold' 
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Supplier Payables</span>
              </button>
            </div>

            {partyType === 'customer' && (
              <div>
                <select
                  value={partyId || ''}
                  onChange={(e) => setPartyId(Number(e.target.value))}
                  required
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-medium text-sm"
                >
                  <option value="">-- Choose Customer Account --</option>
                  {(customers || []).map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone || 'No phone'} | Balance: ₹{c.current_balance || 0})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {partyType === 'supplier' && (
              <div>
                <select
                  value={partyId || ''}
                  onChange={(e) => setPartyId(Number(e.target.value))}
                  required
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-medium text-sm"
                >
                  <option value="">-- Choose Supplier Account --</option>
                  {(suppliers || []).map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Balance Due: ₹{s.balance_due || 0})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Payment Mode and Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI / PhonePe / GPay</option>
                <option value="neft">NEFT / RTGS / IMPS</option>
                <option value="cheque">Cheque</option>
                <option value="dd">Demand Draft (DD)</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Ref / UPI / UTR No.
              </label>
              <input
                type="text"
                placeholder="e.g., UTR12345 or CHQ# 98765"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm"
              />
            </div>
          </div>

          {/* Narration */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Narration / Description *
            </label>
            <input
              type="text"
              placeholder="e.g., Cash received against old dues / Office tea & snack expense"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-medium text-sm"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-6">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 px-5 rounded-xl font-bold uppercase text-xs border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl font-black uppercase tracking-wider text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Transaction
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
