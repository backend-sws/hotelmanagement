import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { HousekeepingTask } from '../schemas/housekeepingSchema';
import { AlertTriangle } from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: HousekeepingTask;
  onReport: (issueDescription: string) => Promise<void>;
}

export function ReportIssueModal({ isOpen, onClose, task, onReport }: ReportIssueModalProps) {
  const [description, setDescription] = useState(task.issue_description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    try {
      await onReport(description);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Issue" maxWidth="sm">
      <div className="space-y-4">
        <div className="bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-200 dark:border-rose-500/20 flex gap-3 text-rose-700 dark:text-rose-400 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>Reporting an issue will change this room's status to <strong>Maintenance</strong>.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            Issue Description
          </label>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g., AC not cooling, Leaking tap in bathroom..."
            className="h-24 resize-none"
          />
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-white/5">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button 
            className="bg-rose-600 hover:bg-rose-700 text-white" 
            onClick={handleSave} 
            disabled={isLoading || !description.trim()}
          >
            Report Issue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
