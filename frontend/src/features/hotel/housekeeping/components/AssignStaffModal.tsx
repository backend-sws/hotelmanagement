import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useStaff } from '@/features/business/staff/api/useStaff';
import type { HousekeepingTask } from '../schemas/housekeepingSchema';

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: HousekeepingTask;
  onAssign: (userId: number | null) => Promise<void>;
}

export function AssignStaffModal({ isOpen, onClose, task, onAssign }: AssignStaffModalProps) {
  const { data: users } = useStaff();
  const [selectedUser, setSelectedUser] = useState<number | null>(task.assignee?.id || null);
  const [isLoading, setIsLoading] = useState(false);

  // We should ideally filter users who are housekeeping staff
  const staffOptions = users?.map(u => ({ label: u.name, value: u.id.toString() })) || [];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onAssign(selectedUser);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Staff" maxWidth="sm">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            Select Staff Member
          </label>
          <CustomSelect
            options={staffOptions}
            value={selectedUser?.toString()}
            onChange={(val) => setSelectedUser(Number(val))}
            placeholder="Select staff..."
          />
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-white/5">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={isLoading}>
            Assign
          </Button>
        </div>
      </div>
    </Modal>
  );
}
