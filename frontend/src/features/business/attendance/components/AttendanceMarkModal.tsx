import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMarkAttendance, useImportAttendance, type BusinessHoliday } from '../api/useAttendance';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { FilterSelect } from '@/components/ui/filter-controls';
import { format } from 'date-fns';
import { Gift, Calendar, Clock, AlertCircle } from 'lucide-react';

interface AttendanceMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: any[];
  holidays?: BusinessHoliday[];
}

export const AttendanceMarkModal = ({ isOpen, onClose, staffList, holidays = [] }: AttendanceMarkModalProps) => {
  const markMutation = useMarkAttendance();
  const importMutation = useImportAttendance();
  const [lateMinutes, setLateMinutes] = React.useState<number>(30);
  const [manualOtHours, setManualOtHours] = React.useState<number>(0);
  const [checkInTime, setCheckInTime] = React.useState<string>('09:00');
  const [checkOutTime, setCheckOutTime] = React.useState<string>('18:00');
  const [lunchMinutes, setLunchMinutes] = React.useState<number>(60);
  const [enableDutyTimings, setEnableDutyTimings] = React.useState<boolean>(true);

  const computedTimes = React.useMemo(() => {
    if (!checkInTime || !checkOutTime) {
      return { grossHours: 0, lunchHours: 0, netHours: 0 };
    }
    const [ih, im] = checkInTime.split(':').map(Number);
    const [oh, om] = checkOutTime.split(':').map(Number);
    let inMins = ih * 60 + im;
    let outMins = oh * 60 + om;
    if (outMins <= inMins) outMins += 24 * 60;
    const grossMinutes = outMins - inMins;
    const grossHours = Math.round((grossMinutes / 60) * 100) / 100;
    const lunchHours = Math.round((lunchMinutes / 60) * 100) / 100;
    const netHours = Math.max(0, Math.round((grossHours - lunchHours) * 100) / 100);
    return { grossHours, lunchHours, netHours };
  }, [checkInTime, checkOutTime, lunchMinutes]);

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      user_id: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'present',
      notes: ''
    }
  });

  const selectedDate = watch('date');
  const holiday = React.useMemo(() => {
    if (!selectedDate || !holidays) return null;
    return holidays.find(h => {
      const d = h.date.includes('T') ? h.date.split('T')[0] : h.date;
      return d === selectedDate;
    });
  }, [holidays, selectedDate]);

  const isSunday = React.useMemo(() => {
    if (!selectedDate) return false;
    const parts = selectedDate.split('-').map(Number);
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]).getDay() === 0;
    }
    return false;
  }, [selectedDate]);

  React.useEffect(() => {
    if (holiday) {
      setValue('status', 'holiday');
      setValue('notes', holiday.name);
    } else if (isSunday) {
      setValue('status', 'week_off');
      setValue('notes', 'Sunday Off');
    }
  }, [holiday, isSunday, setValue]);

  const watchedStatus = watch('status');

  const onSubmit = (data: any) => {
    const isLate = data.status === 'late';
    const lateMins = isLate ? (lateMinutes || 30) : undefined;
    const finalNotes = data.notes || (isLate ? `Late Entry (${lateMins}m late)` : undefined);

    const isDuty = data.status === 'present' || data.status === 'late' || data.status === 'half_day';
    const timeFields = (enableDutyTimings && isDuty) ? {
      check_in_time: checkInTime ? (checkInTime.length === 5 ? `${checkInTime}:00` : checkInTime) : undefined,
      check_out_time: checkOutTime ? (checkOutTime.length === 5 ? `${checkOutTime}:00` : checkOutTime) : undefined,
      lunch_minutes: lunchMinutes >= 0 ? lunchMinutes : 0,
    } : {};

    if (data.user_id === 'all') {
      const records = staffList.map(staff => ({
        user_id: staff.id,
        date: data.date,
        status: data.status,
        late_mark_minutes: lateMins,
        notes: finalNotes,
        overtime_hours: manualOtHours > 0 ? manualOtHours : undefined,
        overtime_approved: manualOtHours > 0 ? true : undefined,
        ...timeFields,
      }));
      importMutation.mutate(records, {
        onSuccess: () => {
          onClose();
          reset();
          setManualOtHours(0);
        }
      });
    } else {
      markMutation.mutate(
        { 
          ...data, 
          user_id: Number(data.user_id),
          late_mark_minutes: lateMins,
          notes: finalNotes,
          overtime_hours: manualOtHours > 0 ? manualOtHours : undefined,
          overtime_approved: manualOtHours > 0 ? true : undefined,
          ...timeFields,
        },
        { onSuccess: () => {
          onClose();
          reset();
          setManualOtHours(0);
        }}
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Attendance (Manual)"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-32">
        <div>
          <label className="block text-sm font-medium mb-1">Staff Member</label>
          <Controller
            name="user_id"
            control={control}
            rules={{ required: 'Please select a staff member' }}
            render={({ field }) => (
              <FilterSelect
                value={field.value}
                onChange={field.onChange}
                placeholder="Select staff member"
                searchable={true}
                options={[
                  { value: 'all', label: 'All Staff (Bulk)' },
                  ...(staffList?.map((staff) => ({ value: staff.id.toString(), label: staff.name })) || [])
                ]}
                wrapperClassName="w-full"
                className={errors.user_id ? 'border-red-500' : ''}
              />
            )}
          />
          {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                className="w-full"
              />
            )}
          />
        </div>

        {holiday ? (
          <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 p-3 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
              <Gift className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Designated Company Holiday: {holiday.name}</span>
            </div>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300">
              {holiday.type}
            </span>
          </div>
        ) : isSunday ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-3 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
              <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Sunday (Weekly Off)</span>
            </div>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300">
              Week Off
            </span>
          </div>
        ) : null}

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FilterSelect
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Status"
                options={[
                  { value: 'present', label: '🟢 Present (Full Day)' },
                  { value: 'late', label: '🟠 Late Entry (Present with Late Mark)' },
                  { value: 'half_day', label: '🟡 Half Day (0.5 Working Day)' },
                  { value: 'absent', label: '🔴 Absent' },
                  { value: 'leave', label: '🔵 Leave' },
                  { value: 'week_off', label: '🌸 Sunday / Week Off' },
                  { value: 'holiday', label: '🟣 Company Holiday' }
                ]}
                wrapperClassName="w-full"
              />
            )}
          />
        </div>

        {watchedStatus === 'late' && (
          <div className="bg-orange-50 dark:bg-orange-950/30 p-3.5 rounded-xl border border-orange-200 dark:border-orange-900/50 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-300">
              <Clock className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Late Entry Configuration</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Minutes Late
                </label>
                <Input
                  type="number"
                  min="1"
                  max="480"
                  value={lateMinutes || ''}
                  onChange={(e) => setLateMinutes(Number(e.target.value) || 0)}
                  placeholder="e.g. 30"
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quick Presets
                </label>
                <div className="flex gap-1.5 pt-0.5">
                  {[15, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setLateMinutes(mins)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
                        lateMinutes === mins
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-orange-500'
                      }`}
                    >
                      +{mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {watchedStatus === 'half_day' && (
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>⚡ Half Day Attendance: Staff is counted as 0.5 working day for payroll calculation.</span>
          </div>
        )}

        {(watchedStatus === 'present' || watchedStatus === 'late') && (
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40">
            <label className="block text-xs font-bold text-indigo-950 dark:text-indigo-200 mb-1">
              Overtime Hours (Optional)
            </label>
            <Input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={manualOtHours || ''}
              onChange={(e) => setManualOtHours(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 2.0"
              className="h-9 text-xs"
            />
          </div>
        )}

        {(watchedStatus === 'present' || watchedStatus === 'late' || watchedStatus === 'half_day') && (
          <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-200 dark:border-zinc-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary-500" />
                Office Timing & Lunch Break
              </span>
              <button
                type="button"
                onClick={() => setEnableDutyTimings(!enableDutyTimings)}
                className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
              >
                {enableDutyTimings ? 'Custom Times (On)' : 'Use Standard Defaults'}
              </button>
            </div>

            {enableDutyTimings && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Check-In Time
                    </label>
                    <Input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Check-Out Time
                    </label>
                    <Input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      Lunch Break (Minutes)
                    </label>
                    <div className="flex gap-1">
                      {[0, 30, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setLunchMinutes(mins)}
                          className={`px-2 py-0.5 text-[11px] font-bold rounded border transition-all ${
                            lunchMinutes === mins
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    max="180"
                    step="5"
                    value={lunchMinutes}
                    onChange={(e) => setLunchMinutes(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 60"
                    className="h-9 text-xs"
                  />
                </div>

                {/* Two Time Calculations Live Display */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/80 dark:border-zinc-800 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block">Office Present Time</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {computedTimes.grossHours} hrs
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">Lunch Time</span>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-300">
                      -{lunchMinutes} mins
                    </span>
                  </div>
                  <div className="bg-emerald-500/10 rounded-md py-0.5 border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">Exact Working Hour</span>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                      {computedTimes.netHours} hrs
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <Input {...register('notes')} placeholder="E.g., Approved by Manager" />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={markMutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};
