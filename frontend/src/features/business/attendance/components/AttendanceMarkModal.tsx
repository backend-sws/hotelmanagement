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
import { Gift } from 'lucide-react';

interface AttendanceMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: any[];
  holidays?: BusinessHoliday[];
}

export const AttendanceMarkModal = ({ isOpen, onClose, staffList, holidays = [] }: AttendanceMarkModalProps) => {
  const markMutation = useMarkAttendance();
  const importMutation = useImportAttendance();

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

  React.useEffect(() => {
    if (holiday) {
      setValue('status', 'holiday');
      setValue('notes', holiday.name);
    }
  }, [holiday, setValue]);

  const onSubmit = (data: any) => {
    if (data.user_id === 'all') {
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
    } else {
      markMutation.mutate(
        { ...data, user_id: Number(data.user_id) },
        { onSuccess: () => {
          onClose();
          reset();
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
                  { value: 'present', label: 'Present' },
                  { value: 'absent', label: 'Absent' },
                  { value: 'half_day', label: 'Half Day' },
                  { value: 'leave', label: 'Leave' },
                  { value: 'week_off', label: 'Week Off' },
                  { value: 'holiday', label: 'Holiday' }
                ]}
                wrapperClassName="w-full"
              />
            )}
          />
        </div>

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
