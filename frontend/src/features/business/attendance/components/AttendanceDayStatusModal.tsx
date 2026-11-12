import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useImportAttendance, type BusinessHoliday } from '../api/useAttendance';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/button';
import { FilterSelect } from '@/components/ui/filter-controls';
import { format } from 'date-fns';
import { Gift, CheckCircle2, AlertCircle } from 'lucide-react';

interface AttendanceDayStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: any[];
  holidays?: BusinessHoliday[];
}

export const AttendanceDayStatusModal = ({ isOpen, onClose, staffList, holidays = [] }: AttendanceDayStatusModalProps) => {
  const importMutation = useImportAttendance();

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'clear',
      notes: ''
    }
  });

  const selectedDate = watch('date');
  const currentStatus = watch('status');

  const holiday = React.useMemo(() => {
    if (!selectedDate || !holidays) return null;
    return holidays.find(h => {
      const d = h.date.includes('T') ? h.date.split('T')[0] : h.date;
      return d === selectedDate;
    });
  }, [holidays, selectedDate]);

  React.useEffect(() => {
    if (holiday) {
      setValue('notes', holiday.name);
    }
  }, [holiday, setValue]);

  const onSubmit = (data: any) => {
    // Apply ONLY to active staff members
    const activeStaff = (staffList || []).filter(staff => staff.status !== 'inactive');
    const records = activeStaff.map(staff => ({
      user_id: staff.id,
      date: data.date,
      status: data.status,
      notes: data.notes || (data.status === 'clear' ? 'Normal Working Day' : undefined)
    }));
    
    importMutation.mutate(records, {
      onSuccess: () => {
        onClose();
        reset();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Day Status (All Staff)"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {holiday && (
          <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 p-3 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
              <Gift className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Designated Company Holiday: {holiday.name}</span>
            </div>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300">
              {holiday.type}
            </span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Day Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FilterSelect
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Status"
                options={[
                  { value: 'clear', label: 'Normal Working Day (Revert / Clear Day Status)' },
                  { value: 'holiday', label: 'Shop Closed / Holiday' },
                  { value: 'week_off', label: 'Weekly Off' },
                  { value: 'half_day', label: 'Half Day (All Staff)' },
                  { value: 'present', label: 'Bulk Mark All Staff Present' }
                ]}
                wrapperClassName="w-full"
              />
            )}
          />
        </div>

        {/* Guidance Alert Cards */}
        {currentStatus === 'clear' && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Revert to Normal Working Day</span>
              <p className="leading-relaxed text-[11px] text-emerald-700/90 dark:text-emerald-300/90">
                This will clear any bulk holiday or off-day status for this date.
                Staff attendance will <strong>NOT</strong> be automatically registered; employees can check in normally or be marked individually.
              </p>
            </div>
          </div>
        )}

        {currentStatus === 'present' && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Bulk Attendance Registration</span>
              <p className="leading-relaxed text-[11px] text-amber-700/90 dark:text-amber-300/90">
                This will immediately record <strong>Present (Full Day)</strong> attendance for all active staff members on this date.
              </p>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Reason / Note</label>
            {currentStatus === 'clear' && (
              <span className="text-[11px] text-slate-400 font-medium">Optional</span>
            )}
          </div>
          <Input 
            {...register('notes', { required: (currentStatus !== 'clear' && currentStatus !== 'present') ? 'Please provide a reason' : false })} 
            placeholder={
              currentStatus === 'clear'
                ? "Optional note (e.g., holiday cancelled, regular workday)"
                : currentStatus === 'present'
                ? "Optional note (e.g., all present on special duty)"
                : "E.g., Diwali Holiday, Shop Closed for Maintenance..."
            } 
            className={errors.notes ? 'border-red-500' : ''}
          />
          {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message as string}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            isLoading={importMutation.isPending}
            className={currentStatus === 'clear' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
          >
            {currentStatus === 'clear' ? 'Revert to Normal Day' : currentStatus === 'present' ? 'Mark All Present' : 'Set Status'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
