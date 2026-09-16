import React, { useState } from 'react';
import {
  useLeavePolicies,
  useCreateLeavePolicy,
  useUpdateLeavePolicy,
  useDeleteLeavePolicy,
  type LeavePolicy,
} from '../api/useLeavePolicies';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShieldAlert, Plus, Trash2, Edit2, CheckCircle2,
  Calendar, Clock, Info, Check, X,
} from 'lucide-react';

interface LeavePoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeavePoliciesModal({ isOpen, onClose }: LeavePoliciesModalProps) {
  const { data: policies = [], isLoading } = useLeavePolicies();
  const createMutation = useCreateLeavePolicy();
  const updateMutation = useUpdateLeavePolicy();
  const deleteMutation = useDeleteLeavePolicy();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    leave_type: '',
    monthly_quota: 1.0,
    is_paid: true,
  });

  const handleCreate = () => {
    if (!form.leave_type.trim()) return;
    createMutation.mutate({
      leave_type: form.leave_type.trim(),
      monthly_quota: Number(form.monthly_quota) || 0,
      is_paid: form.is_paid,
    }, {
      onSuccess: () => {
        setIsAdding(false);
        setForm({ leave_type: '', monthly_quota: 1.0, is_paid: true });
      },
    });
  };

  const handleUpdate = (id: number) => {
    if (!form.leave_type.trim()) return;
    updateMutation.mutate({
      id,
      leave_type: form.leave_type.trim(),
      monthly_quota: Number(form.monthly_quota) || 0,
      is_paid: form.is_paid,
    }, {
      onSuccess: () => {
        setEditingId(null);
        setForm({ leave_type: '', monthly_quota: 1.0, is_paid: true });
      },
    });
  };

  const startEdit = (p: LeavePolicy) => {
    setEditingId(p.id);
    setIsAdding(false);
    setForm({
      leave_type: p.leave_type,
      monthly_quota: p.monthly_quota,
      is_paid: Boolean(p.is_paid),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <span>Company Leave Policies & Quotas</span>
        </div>
      }
      description="Define annual and monthly leave entitlements for your team (Sick, Casual, Earned, etc.)"
      maxWidth="3xl"
    >
      <div className="space-y-5 pt-1">
        {/* Header Action to Add Policy */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            {policies.length} Active Leave Rule{policies.length !== 1 ? 's' : ''}
          </span>
          {!isAdding && !editingId && (
            <Button
              variant="brand"
              size="sm"
              onClick={() => {
                setIsAdding(true);
                setForm({ leave_type: '', monthly_quota: 1.0, is_paid: true });
              }}
              className="h-8 px-3 text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Leave Type
            </Button>
          )}
        </div>

        {/* Add / Edit Form Box */}
        {(isAdding || editingId) && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-primary-500/30 ring-1 ring-primary-500/20 space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {editingId ? 'Edit Leave Policy' : 'Create New Leave Policy'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Leave Type Name *
                </label>
                <Input
                  placeholder="e.g., Casual Leave (CL), Sick Leave (SL), Maternity Leave"
                  value={form.leave_type}
                  onChange={e => setForm(p => ({ ...p, leave_type: e.target.value }))}
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Monthly Quota (Days)
                </label>
                <Input
                  type="number"
                  step={0.5}
                  min={0}
                  max={31}
                  value={form.monthly_quota}
                  onChange={e => setForm(p => ({ ...p, monthly_quota: parseFloat(e.target.value) || 0 }))}
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 h-9 text-xs"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  = {(form.monthly_quota * 12).toFixed(1)} days/year
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, is_paid: !p.is_paid }))}
                  className={`relative w-10 h-5 rounded-full transition-all cursor-pointer ${
                    form.is_paid ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    form.is_paid ? 'left-5' : 'left-0.5'
                  }`} />
                </button>
                <span className={`text-xs font-bold ${form.is_paid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {form.is_paid ? 'Paid Leave (Salary protected)' : 'Unpaid Leave (Loss of Pay / LOP)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="h-8 px-2.5 text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
                  disabled={!form.leave_type.trim()}
                  className="h-8 px-3.5 text-xs font-bold cursor-pointer"
                >
                  {editingId ? 'Update Policy' : 'Save Policy'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Policies List */}
        <div className="space-y-2.5">
          {policies.map(p => {
            const annual = roundAnnual(p.monthly_quota);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    p.is_paid ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{p.leave_type}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        p.is_paid
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {p.is_paid ? 'Paid' : 'Unpaid (LOP)'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      <strong>{p.monthly_quota} days</strong>/month • <strong>{annual} days</strong>/year allowance
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    title="Edit Policy"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete Policy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helpful Info Notice */}
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Approved leaves matching these policy categories are tracked against each staff member's live balance. Leaves exceeding the allocated paid quota automatically trigger Loss of Pay (LOP) deductions during monthly payroll calculation.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function roundAnnual(monthly: number): string {
  const val = Number(monthly) * 12;
  return Number.isInteger(val) ? val.toString() : val.toFixed(1);
}
