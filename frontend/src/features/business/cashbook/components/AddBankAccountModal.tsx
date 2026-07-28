import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Loader2, Landmark, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cashbookService, type BankAccountPayload } from '../api/cashbookService';
import { toast } from 'sonner';

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName || !accountNumber || !bankName) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: BankAccountPayload = {
        account_name: accountName,
        account_number: accountNumber,
        ifsc_code: ifscCode || undefined,
        bank_name: bankName,
        branch: branch || undefined,
        opening_balance: parseFloat(openingBalance) || 0,
        is_default: isDefault,
      };

      await cashbookService.createBankAccount(payload);
      toast.success('Bank account created successfully!');
      onSuccess();
      onClose();
      // Reset form
      setAccountName('');
      setAccountNumber('');
      setIfscCode('');
      setBankName('');
      setBranch('');
      setOpeningBalance('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create bank account');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f0f12] rounded-3xl border border-slate-200/80 dark:border-white/10 max-w-lg w-full p-6 shadow-2xl ring-1 ring-slate-900/5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-wide">
                Add Bank Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Record company bank accounts for digital receipts and cheque deposits.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Account Display Name *
            </label>
            <input
              type="text"
              placeholder="e.g., HDFC Current A/C or SBI Savings"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Bank Name *
              </label>
              <input
                type="text"
                placeholder="e.g., HDFC Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Branch Name
              </label>
              <input
                type="text"
                placeholder="e.g., Connaught Place"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Account Number *
              </label>
              <input
                type="text"
                placeholder="000123456789"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="HDFC0001234"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-mono uppercase text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
              Opening Balance (₹)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-white font-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-white/10"
            />
            <label htmlFor="isDefault" className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Set as Default Bank Account for Cheque Deposits & UPI Receipts
            </label>
          </div>

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
              className="h-11 px-6 rounded-xl font-black uppercase tracking-wider text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Bank Account
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
