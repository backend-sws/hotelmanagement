import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HardHat, X, Check, Loader2, DollarSign, Calendar, Building2, User, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { projectService } from '../api/projectService';
import { labourService } from '../api/labourService';
import { toast } from 'sonner';

interface RecordLabourPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: number;
  onSuccess?: () => void;
}

export const RecordLabourPaymentModal: React.FC<RecordLabourPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultProjectId,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [projectId, setProjectId] = useState<number | undefined>(defaultProjectId);
  const [workerName, setWorkerName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (defaultProjectId) setProjectId(defaultProjectId);
      setWorkerName('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMode('Cash');
      setNotes('');
    }
  }, [isOpen, defaultProjectId]);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: (payload: {
      project_id?: number;
      worker_name: string;
      amount: number;
      date: string;
      payment_mode?: string;
      notes?: string;
    }) => labourService.recordPayment(payload),
    onSuccess: () => {
      toast.success('🎉 Labour wage & disbursement recorded successfully!');
      queryClient.invalidateQueries({ queryKey: ['labour-summary'] });
      queryClient.invalidateQueries({ queryKey: ['project-labour'] });
      queryClient.invalidateQueries({ queryKey: ['project-expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to record labour payment');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim()) {
      toast.error('Please enter worker or contractor name');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Please enter a valid wage amount greater than 0');
      return;
    }

    mutation.mutate({
      project_id: projectId ? Number(projectId) : undefined,
      worker_name: workerName.trim(),
      amount: parsedAmount,
      date,
      payment_mode: paymentMode,
      notes: notes.trim() || undefined,
    });
  };

  const paymentModes = ['Cash', 'Bank Transfer', 'UPI', 'Cheque'];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111118] rounded-3xl border border-slate-200 dark:border-white/10 max-w-lg w-full p-6 sm:p-8 shadow-2xl ring-1 ring-slate-900/5 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-white/5 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                Record Labour & Wage Payment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Quickly record daily wage disbursements or site contractor charges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto flex-1 pr-1">
          {/* Site / Project Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              Site / Project Link (Optional)
            </label>
            <select
              value={projectId || ''}
              onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
              disabled={!!defaultProjectId && !projectsLoading}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <option value="">-- No Specific Site (General Business Wage) --</option>
              {projects?.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.project_code ? `[${proj.project_code}] ` : ''}{proj.name} ({proj.city || 'Site'})
                </option>
              ))}
            </select>
            {defaultProjectId && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                Linked directly to this project site.
              </p>
            )}
          </div>

          {/* Worker / Contractor Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              Worker / Contractor Name *
            </label>
            <input
              type="text"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              placeholder="e.g., Rajesh Kumar (Maison / Contractor)"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Amount and Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-rose-500" />
                Wage Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                Payment Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                required
              />
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-purple-500" />
              Payment Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {paymentModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`h-9 rounded-xl text-xs font-bold transition-all border ${
                    paymentMode === mode
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Notes / Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Attendance / Wage Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., 2 Days masonry work, paid via advance cash to supervisor."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl px-5 font-bold h-11 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 rounded-xl px-6 font-bold h-11 flex items-center gap-2 text-sm"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recording Wage...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Record Labour Wage
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
