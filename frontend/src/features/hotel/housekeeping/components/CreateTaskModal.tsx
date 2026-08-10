import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Textarea } from '@/components/ui/textarea';
import { useHotelRooms } from '../../rooms/api/useHotelRooms';
import { useStaff } from '@/features/business/staff/api/useStaff';
import { useCreateHousekeepingTask } from '../api/useHotelHousekeeping';
import { toast } from 'sonner';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const { data: rooms } = useHotelRooms();
  const { data: staff } = useStaff();
  const createTask = useCreateHousekeepingTask();

  const [roomId, setRoomId] = useState<number | null>(null);
  const [taskType, setTaskType] = useState<string>('daily_cleaning');
  const [priority, setPriority] = useState<string>('normal');
  const [assignedUserId, setAssignedUserId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  const roomOptions = rooms?.map(r => ({ label: `Room ${r.room_number} - ${r.room_type?.name}`, value: r.id.toString() })) || [];
  const staffOptions = staff?.map(s => ({ label: s.name, value: s.id.toString() })) || [];

  const handleSave = async () => {
    if (!roomId) {
      toast.error('Please select a room');
      return;
    }

    try {
      await createTask.mutateAsync({
        room_id: roomId,
        task_type: taskType,
        priority: priority,
        assigned_user_id: assignedUserId || null,
        notes: notes || null
      });
      toast.success('Task created successfully!');
      
      // Reset form
      setRoomId(null);
      setTaskType('daily_cleaning');
      setPriority('normal');
      setAssignedUserId(null);
      setNotes('');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Housekeeping Task" maxWidth="md">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            Select Room *
          </label>
          <CustomSelect
            options={roomOptions}
            value={roomId?.toString()}
            onChange={(val) => setRoomId(Number(val))}
            placeholder="Select a room..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
              Task Type *
            </label>
            <CustomSelect
              options={[
                { label: 'Daily Cleaning', value: 'daily_cleaning' },
                { label: 'Deep Cleaning', value: 'deep_cleaning' },
                { label: 'Checkout Cleaning', value: 'checkout_cleaning' },
                { label: 'Turndown Service', value: 'turndown_service' },
                { label: 'Maintenance Check', value: 'maintenance_check' },
                { label: 'Inspect', value: 'inspect' },
              ]}
              value={taskType}
              onChange={(val) => setTaskType(val as string)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
              Priority *
            </label>
            <CustomSelect
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Normal', value: 'normal' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
              ]}
              value={priority}
              onChange={(val) => setPriority(val as string)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            Assign To Staff (Optional)
          </label>
          <CustomSelect
            options={staffOptions}
            value={assignedUserId?.toString()}
            onChange={(val) => setAssignedUserId(Number(val))}
            placeholder="Select staff member..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            Additional Notes
          </label>
          <Textarea 
            placeholder="Any specific instructions..." 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
          <Button variant="ghost" onClick={onClose} disabled={createTask.isPending}>Cancel</Button>
          <Button onClick={handleSave} disabled={createTask.isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md">
            {createTask.isPending ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
