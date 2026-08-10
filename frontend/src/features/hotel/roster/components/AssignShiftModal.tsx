import { useState, useEffect } from 'react';
import { useShifts, useAssignShift } from '../api/useHotelRoster';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select } from '@/components/ui/select';
import { format } from 'date-fns';
import type { HotelDepartment, HotelShift, RosterEntry } from '../schemas/rosterSchema';

interface AssignShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  date: string;
  currentEntry?: RosterEntry;
  departments: HotelDepartment[];
}

export function AssignShiftModal({ isOpen, onClose, userId, userName, date, currentEntry, departments }: AssignShiftModalProps) {
  const { data: shifts } = useShifts();
  const assignShift = useAssignShift();

  const [shiftId, setShiftId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [status, setStatus] = useState<string>('scheduled');

  useEffect(() => {
    if (isOpen) {
      if (currentEntry) {
        setShiftId(currentEntry.shift_id?.toString() || '');
        setDepartmentId(currentEntry.department_id?.toString() || '');
        setStatus(currentEntry.status);
      } else {
        setShiftId('');
        setDepartmentId('');
        setStatus('scheduled');
      }
    }
  }, [isOpen, currentEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignShift.mutateAsync({
        user_id: userId,
        roster_date: date,
        shift_id: shiftId ? parseInt(shiftId) : undefined,
        department_id: departmentId ? parseInt(departmentId) : undefined,
        status,
      });
      toast.success('Shift assigned successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to assign shift');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Shift">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm mb-4 border">
          <div className="text-slate-500 mb-1">Staff Member</div>
          <div className="font-semibold text-lg">{userName}</div>
          <div className="text-slate-500 mt-2 mb-1">Date</div>
          <div className="font-semibold">{date ? format(new Date(date), 'EEEE, MMM do, yyyy') : ''}</div>
        </div>

        <div className="space-y-2">
          <Label>Shift</Label>
          <Select value={shiftId} onChange={(e) => setShiftId(e.target.value)}>
            <option value="">Select a shift</option>
            {shifts?.map((s: HotelShift) => (
              <option key={s.id} value={s.id.toString()}>
                {s.name} ({s.start_time.substring(0,5)} - {s.end_time.substring(0,5)})
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">Select department</option>
            {departments?.map((d: HotelDepartment) => (
              <option key={d.id} value={d.id.toString()}>
                {d.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="scheduled">Scheduled</option>
            <option value="attended">Attended</option>
            <option value="absent">Absent</option>
            <option value="on_leave">On Leave</option>
            <option value="week_off">Week Off</option>
            <option value="holiday">Holiday</option>
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={assignShift.isPending}>Save Assignment</Button>
        </div>
      </form>
    </Modal>
  );
}

