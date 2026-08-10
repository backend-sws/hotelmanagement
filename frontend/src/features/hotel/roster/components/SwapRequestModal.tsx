import { useState } from 'react';
import { useRequestSwap, useApproveSwap } from '../api/useHotelRoster';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { RosterEntry, RosterStaff } from '../schemas/rosterSchema';
import { format } from 'date-fns';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: RosterEntry;
  staff: RosterStaff[];
}

export function SwapRequestModal({ isOpen, onClose, entry, staff }: SwapRequestModalProps) {
  // Mock auth context for now to avoid the error. In real life we useAuthStore.
  const isManager = true; 
  
  const requestSwap = useRequestSwap();
  const approveSwap = useApproveSwap();

  const [swapWith, setSwapWith] = useState<string>(entry.swap_with_user_id?.toString() || '');
  const [reason, setReason] = useState(entry.swap_reason || '');

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapWith) return toast.error('Select a staff member to swap with');
    
    try {
      await requestSwap.mutateAsync({
        id: entry.id,
        swap_with_user_id: parseInt(swapWith),
        swap_reason: reason
      });
      toast.success('Swap requested');
      onClose();
    } catch (err) {
      toast.error('Failed to request swap');
    }
  };

  const handleManagerAction = async (approved: boolean) => {
    try {
      await approveSwap.mutateAsync({ id: entry.id, approved });
      toast.success(approved ? 'Swap Approved' : 'Swap Rejected');
      onClose();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const availableStaff = staff.filter(s => s.id !== entry.user_id);
  const requestedUser = staff.find(s => s.id === entry.swap_with_user_id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entry.swap_status === 'pending' ? 'Review Swap Request' : 'Request Shift Swap'}>
      {entry.swap_status === 'pending' ? (
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Pending Manager Approval</h4>
            <p className="text-sm">
              <strong>Staff</strong> wants to swap their <strong>{entry.shift?.name}</strong> shift on <strong>{format(new Date(entry.roster_date), 'MMM do, yyyy')}</strong> with <strong>{requestedUser?.name || 'Another staff'}</strong>.
            </p>
            {entry.swap_reason && (
              <p className="text-sm mt-2 italic text-slate-600">"{entry.swap_reason}"</p>
            )}
          </div>

          {isManager ? (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="destructive" onClick={() => handleManagerAction(false)} disabled={approveSwap.isPending}>
                Reject
              </Button>
              <Button type="button" onClick={() => handleManagerAction(true)} disabled={approveSwap.isPending}>
                Approve Swap
              </Button>
            </div>
          ) : (
            <div className="text-center text-slate-500 pt-4 border-t">
              Waiting for manager approval...
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm mb-4 border">
            <div><strong>Shift:</strong> {entry.shift?.name}</div>
            <div><strong>Date:</strong> {format(new Date(entry.roster_date), 'EEEE, MMM do, yyyy')}</div>
          </div>

          <div className="space-y-2">
            <Label>Swap With</Label>
            <Select value={swapWith} onChange={(e) => setSwapWith(e.target.value)}>
              <option value="">Select staff...</option>
              {availableStaff.map(s => (
                <option key={s.id} value={s.id.toString()}>{s.name}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea 
              value={reason} 
              onChange={e => setReason(e.target.value)} 
              placeholder="Why do you need this swap?"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={requestSwap.isPending}>Submit Request</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

