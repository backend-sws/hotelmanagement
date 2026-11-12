import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Home, CheckCircle2, AlertTriangle, Sparkles, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useLeaveBalances } from '../api/useLeavePolicies';
import { useWorkSettings, useAllHolidays } from '@/features/business/attendance/api/useAttendance';

interface LeaveRequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export const LeaveRequestFormModal: React.FC<LeaveRequestFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [requestType, setRequestType] = useState<'leave' | 'wfh'>('leave');
  const [leaveType, setLeaveType] = useState('casual');
  const [leaveCategory, setLeaveCategory] = useState<'paid' | 'unpaid'>('paid');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');

  const { data: balanceData } = useLeaveBalances();
  const { data: workSettings } = useWorkSettings();
  const { data: holidaysList = [] } = useAllHolidays();
  const noticeDaysRequired = workSettings?.leave_notice_days_required ?? 2;
  const isNoticeRuleEnabled = workSettings?.enable_leave_notice_rule ?? true;

  const isShortNotice = useMemo(() => {
    if (!fromDate || !isNoticeRuleEnabled || noticeDaysRequired <= 0) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(fromDate + 'T00:00:00');
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays < noticeDaysRequired;
  }, [fromDate, isNoticeRuleEnabled, noticeDaysRequired]);

  // Find matching quota
  const activeBalance = useMemo(() => {
    if (!balanceData?.balances) return null;
    return balanceData.balances.find(b => 
      b.leave_type.toLowerCase() === leaveType.toLowerCase() ||
      (leaveType === 'casual' && b.leave_type.toLowerCase().includes('casual')) ||
      (leaveType === 'sick' && b.leave_type.toLowerCase().includes('sick')) ||
      (leaveType === 'earned' && (b.leave_type.toLowerCase().includes('earned') || b.leave_type.toLowerCase().includes('paid')))
    );
  }, [balanceData, leaveType]);

  // Calculate requested duration in working days (excluding Sundays AND official company holidays for leave requests)
  const durationInfo = useMemo(() => {
    if (!fromDate || !toDate) {
      return { totalDays: 0, workingDays: 0, sundaysCount: 0, holidaysCount: 0, holidayNames: [] as string[] };
    }
    const start = new Date(fromDate + 'T00:00:00');
    const end = new Date(toDate + 'T00:00:00');
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return { totalDays: 0, workingDays: 0, sundaysCount: 0, holidaysCount: 0, holidayNames: [] as string[] };
    }

    // Map of official holidays: YYYY-MM-DD -> name
    const holidayMap = new Map<string, string>();
    holidaysList.forEach(h => {
      if (h.date) {
        const dStr = typeof h.date === 'string' ? h.date.slice(0, 10) : '';
        if (dStr) holidayMap.set(dStr, h.name);
      }
    });

    let total = 0;
    let sundays = 0;
    let holidaysCount = 0;
    const holidayNames: string[] = [];

    const curr = new Date(start);
    while (curr <= end) {
      total++;
      const dateStr = format(curr, 'yyyy-MM-dd');
      const isSunday = curr.getDay() === 0;
      const isHoliday = holidayMap.has(dateStr);

      if (isSunday) {
        sundays++;
      } else if (isHoliday) {
        holidaysCount++;
        holidayNames.push(`${holidayMap.get(dateStr)} (${format(curr, 'dd MMM')})`);
      }

      curr.setDate(curr.getDate() + 1);
    }

    const workingDays = requestType === 'leave' ? Math.max(0, total - sundays - holidaysCount) : total;
    return { totalDays: total, workingDays, sundaysCount: sundays, holidaysCount, holidayNames };
  }, [fromDate, toDate, requestType, holidaysList]);

  const daysCount = durationInfo.workingDays;

  const isOverQuota = Boolean(
    requestType === 'leave' &&
    leaveCategory === 'paid' &&
    activeBalance &&
    activeBalance.is_paid &&
    daysCount > activeBalance.remaining_days
  );

  const excessDays = isOverQuota && activeBalance ? daysCount - activeBalance.remaining_days : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason.trim()) return;

    onSubmit({
      request_type: requestType,
      leave_type: requestType === 'wfh' ? 'wfh' : leaveType,
      leave_category: leaveCategory,
      from_date: fromDate,
      to_date: toDate,
      reason: reason.trim(),
    });

    // Reset form
    setReason('');
    setFromDate('');
    setToDate('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={requestType === 'wfh' ? 'Request Work From Home (WFH)' : 'Apply for Leave'}
      description={
        requestType === 'wfh'
          ? 'Submit a WFH request. Upon admin approval, your attendance can be auto-marked without geofence limits.'
          : 'Submit a paid or unpaid leave request for manager review and approval.'
      }
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Request Type Toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setRequestType('leave')}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              requestType === 'leave'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-zinc-700 font-extrabold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Leave Request</span>
          </button>
          <button
            type="button"
            onClick={() => setRequestType('wfh')}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              requestType === 'wfh'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-zinc-700 font-extrabold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Work From Home</span>
          </button>
        </div>

        {/* WFH Guidance Note */}
        {requestType === 'wfh' && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>WFH Flow:</strong> Once your manager approves this request, your attendance can be verified for the approved date(s) directly without requiring shop geofence verification.
            </span>
          </div>
        )}

        {/* Leave Type / WFH details & Paid/Unpaid category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {requestType === 'leave' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Leave Type
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="earned">Earned Leave</option>
                <option value="comp_off">Comp Off</option>
                <option value="emergency">Emergency / Other</option>
              </select>
              {activeBalance && (
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-zinc-400">Quota: <strong className="text-slate-700 dark:text-zinc-300">{activeBalance.annual_quota}d/yr</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Available: {activeBalance.remaining_days} days left</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                WFH Type
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="wfh">Full Day WFH</option>
                <option value="half_day_wfh">Half Day WFH</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Payment Category
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLeaveCategory('paid')}
                className={`flex-1 h-11 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  leaveCategory === 'paid'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Paid
              </button>
              <button
                type="button"
                onClick={() => setLeaveCategory('unpaid')}
                className={`flex-1 h-11 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  leaveCategory === 'unpaid'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                Unpaid (LOP)
              </button>
            </div>
          </div>
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              From Date
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              To Date
            </label>
            <Input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Short Notice Alert */}
        {isShortNotice && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>⚠️ Short Notice Request</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  Manager Discretion
                </span>
              </p>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90">
                Company policy requires at least <strong>{noticeDaysRequired} days advance notice</strong> for planned leaves. This request will be submitted as <strong>Short Notice</strong> and is subject to Manager/HR discretion.
              </p>
            </div>
          </div>
        )}

        {/* Duration / Quota Alert */}
        {daysCount > 0 ? (
          <div>
            {isOverQuota ? (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <p>
                    <strong>Quota Exceeded Notice:</strong> You requested <strong>{daysCount} {daysCount === 1 ? 'day' : 'days'}</strong>, but have only <strong>{activeBalance?.remaining_days || 0} paid days</strong> left in this category.
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-[11px]">
                    The excess <strong>{excessDays} day(s)</strong> will be categorized as <strong>Loss of Pay (LOP)</strong> and deducted from your monthly payroll.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Duration: <strong>{daysCount} {daysCount === 1 ? 'working day' : 'working days'}</strong>
                  {(durationInfo.sundaysCount > 0 || durationInfo.holidaysCount > 0) && requestType === 'leave' && (
                    <span className="text-[11px] font-normal text-slate-500 dark:text-zinc-400 ml-1">
                      ({[
                        durationInfo.sundaysCount > 0 ? `${durationInfo.sundaysCount} ${durationInfo.sundaysCount === 1 ? 'Sunday' : 'Sundays'}` : '',
                        durationInfo.holidaysCount > 0 ? `${durationInfo.holidaysCount} ${durationInfo.holidaysCount === 1 ? 'Holiday' : 'Holidays'}${durationInfo.holidayNames.length > 0 ? ` (${durationInfo.holidayNames.join(', ')})` : ''}` : ''
                      ].filter(Boolean).join(' & ')} excluded)
                    </span>
                  )}
                </span>
                {requestType === 'leave' && activeBalance?.is_paid && (
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Remaining after approval: <strong>{Math.max(0, activeBalance.remaining_days - daysCount)} days</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (fromDate && toDate && requestType === 'leave' && (durationInfo.sundaysCount > 0 || durationInfo.holidaysCount > 0)) ? (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-bold">All Selected Dates are Non-Working Days / Holidays</p>
              <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5 leading-relaxed">
                The selected range contains only Sundays or official holidays ({[
                  durationInfo.sundaysCount > 0 ? `${durationInfo.sundaysCount} Sunday(s)` : '',
                  durationInfo.holidaysCount > 0 ? `${durationInfo.holidaysCount} Holiday(s): ${durationInfo.holidayNames.join(', ')}` : ''
                ].filter(Boolean).join(' & ')}). 0 leave days will be deducted from your quota or salary.
              </p>
            </div>
          </div>
        ) : null}

        {/* Reason Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {requestType === 'wfh' ? 'WFH Work Plan & Tasks' : 'Reason for Leave'}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              requestType === 'wfh'
                ? 'Tasks planned to be completed remotely from home...'
                : 'Reason for requesting time off...'
            }
            className="w-full h-24 text-sm rounded-lg p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-all"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`font-bold text-white shadow-sm ${
              requestType === 'wfh'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : `Submit ${requestType === 'wfh' ? 'WFH Request' : 'Leave Request'}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
