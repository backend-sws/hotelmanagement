import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRequestRegularization } from '../api/useAttendance';
import { Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RegularizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  staffList?: { id: number; name: string }[];
  defaultUserId?: number;
}

export function RegularizationModal({ isOpen, onClose, defaultDate, staffList, defaultUserId }: RegularizationModalProps) {
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [userId, setUserId] = useState<string>(defaultUserId ? String(defaultUserId) : '');
  const [requestedCheckin, setRequestedCheckin] = useState('09:30');
  const [requestedCheckout, setRequestedCheckout] = useState('18:30');
  const [reason, setReason] = useState('');

  const regularizeMutation = useRequestRegularization();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error('Date is required');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please specify a reason (e.g., Forgot to check-in on arrival)');
      return;
    }

    regularizeMutation.mutate(
      {
        date,
        user_id: userId ? parseInt(userId) : undefined,
        requested_checkin: requestedCheckin ? `${requestedCheckin}:00` : undefined,
        requested_checkout: requestedCheckout ? `${requestedCheckout}:00` : undefined,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          setReason('');
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Arrival Time Correction"
      description="If you forgot to check in on arrival, submit your actual arrival time for manager approval."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>
            Your manager will review and approve this correction. Once approved, your working hours and attendance will be automatically recalculated.
          </span>
        </div>

        {staffList && staffList.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Staff Member
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Myself (Logged-in Account)</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Actual Arrival (Check-In)
            </label>
            <Input
              type="time"
              value={requestedCheckin}
              onChange={(e) => setRequestedCheckin(e.target.value)}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Actual Departure (Check-Out)
            </label>
            <Input
              type="time"
              value={requestedCheckout}
              onChange={(e) => setRequestedCheckout(e.target.value)}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Reason for Late/Missed Mark
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Arrived on time at 9:30 AM but forgot to check in on phone / internet issues."
            className="w-full h-24 text-sm rounded-xl p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={regularizeMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={regularizeMutation.isPending}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold"
          >
            <Clock className="w-4 h-4 mr-1.5" />
            {regularizeMutation.isPending ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
