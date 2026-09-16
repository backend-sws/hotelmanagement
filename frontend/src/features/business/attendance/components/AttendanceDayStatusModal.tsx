import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useImportAttendance, type BusinessHoliday } from '../api/useAttendance';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/button';
import { FilterSelect } from '@/components/ui/filter-controls';
import { format } from 'date-fns';
import { Gift } from 'lucide-react';

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
      status: 'holiday',
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

  React.useEffect(() => {
    if (holiday) {
      setValue('status', 'holiday');
      setValue('notes', holiday.name);
    }
  }, [holiday, setValue]);

  const onSubmit = (data: any) => {
    // Apply to all active staff
    const records = staffList.map(staff => ({
      user_id: staff.id,
      date: data.date,
      status: data.status,
      notes: data.notes
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
                  { value: 'holiday', label: 'Shop Closed / Holiday' },
                  { value: 'week_off', label: 'Weekly Off' },
                  { value: 'half_day', label: 'Half Day' },
                  { value: 'present', label: 'Working Day (Present)' }
                ]}
                wrapperClassName="w-full"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reason / Note</label>
          <Input 
            {...register('notes', { required: 'Please provide a reason' })} 
            placeholder="E.g., Diwali Holiday, Shop Closed for Maintenance..." 
            className={errors.notes ? 'border-red-500' : ''}
          />
          {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message as string}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={importMutation.isPending}>Set Status</Button>
        </div>
      </form>
    </Modal>
  );
};
