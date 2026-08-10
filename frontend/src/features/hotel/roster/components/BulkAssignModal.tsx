import { useState } from 'react';
import { useShifts, useBulkAssignShift } from '../api/useHotelRoster';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { HotelDepartment, RosterStaff, HotelShift } from '../schemas/rosterSchema';
import { format, addDays, parseISO } from 'date-fns';

interface BulkAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: RosterStaff[];
  departments: HotelDepartment[];
}

export function BulkAssignModal({ isOpen, onClose, staff, departments }: BulkAssignModalProps) {
  const { data: shifts } = useShifts();
  const bulkAssign = useBulkAssignShift();

  const [shiftId, setShiftId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 6), 'yyyy-MM-dd'));
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [override, setOverride] = useState(false);

  const toggleStaff = (id: number) => {
    setSelectedStaff(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedStaff.length === staff.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(staff.map(s => s.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftId) return toast.error('Please select a shift');
    if (selectedStaff.length === 0) return toast.error('Please select at least one staff member');

    // Generate dates array
    const dates: string[] = [];
    let curr = parseISO(startDate);
    const end = parseISO(endDate);
    
    if (curr > end) return toast.error('Start date must be before end date');

    while (curr <= end) {
      dates.push(format(curr, 'yyyy-MM-dd'));
      curr = addDays(curr, 1);
    }

    try {
      const res = await bulkAssign.mutateAsync({
        user_ids: selectedStaff,
        dates,
        shift_id: parseInt(shiftId),
        department_id: departmentId ? parseInt(departmentId) : undefined,
        override_existing: override,
      });

      toast.success(`Assigned ${res.created} shifts. ${res.skipped > 0 ? `Skipped ${res.skipped} existing conflicts.` : ''}`);
      onClose();
    } catch (err) {
      toast.error('Failed to bulk assign shifts');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Assign Shifts">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Shift</Label>
            <Select value={shiftId} onChange={(e) => setShiftId(e.target.value)}>
              <option value="">Choose shift...</option>
              {shifts?.map((s: HotelShift) => (
                <option key={s.id} value={s.id.toString()}>{s.name}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Department (Optional)</Label>
            <Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
              <option value="">Any department...</option>
              {departments?.map((d: HotelDepartment) => (
                <option key={d.id} value={d.id.toString()}>{d.name}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>From Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>To Date</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Select Staff ({selectedStaff.length} selected)</Label>
            <Button type="button" variant="ghost" size="sm" onClick={toggleAll}>
              {selectedStaff.length === staff.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <div className="border rounded-md max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900">
            {staff.map(user => (
              <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <input 
                  type="checkbox"
                  id={`staff-${user.id}`} 
                  checked={selectedStaff.includes(user.id)}
                  onChange={() => toggleStaff(user.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor={`staff-${user.id}`} className="font-normal cursor-pointer flex-1">
                  {user.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100">
          <input 
            type="checkbox" 
            id="override" 
            checked={override} 
            onChange={(e) => setOverride(e.target.checked)} 
            className="w-4 h-4 rounded border-orange-300"
          />
          <Label htmlFor="override" className="font-normal cursor-pointer text-orange-800 dark:text-orange-300">
            Override existing shift assignments (if staff is already assigned to a different shift on these dates, replace it).
          </Label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={bulkAssign.isPending}>Run Bulk Assign</Button>
        </div>
      </form>
    </Modal>
  );
}

