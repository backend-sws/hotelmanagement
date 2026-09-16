import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  usePendingRegularizations,
  useApproveRegularization,
  useRejectRegularization,
} from '../api/useAttendance';
import { Clock, Check, X, User, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface RegularizationAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegularizationAdminModal({ isOpen, onClose }: RegularizationAdminModalProps) {
  const { data: responseData, isLoading, refetch } = usePendingRegularizations();
  const approveMutation = useApproveRegularization();
  const rejectMutation = useRejectRegularization();

  const requests = responseData?.data || responseData || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Arrival Time Regularization Requests"
      description="Review and approve/reject staff requests for backdated arrival time correction."
      className="max-w-3xl"
    >
      <div className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="py-12 flex justify-center items-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-primary-500 mr-2" />
            <span>Loading requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">All caught up!</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No pending regularization requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {requests.map((req: any) => (
              <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                      {req.user?.name || `Staff #${req.user_id}`}
                    </span>
                    <Badge variant="outline" className="text-[10px] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {req.date}
                    </Badge>
                    <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]">
                      Pending Review
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500">Requested Arrival: </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {req.regularization_requested_checkin ? req.regularization_requested_checkin.slice(0, 5) : '—'}
                      </span>
                    </div>
                    {req.regularization_requested_checkout && (
                      <div>
                        <span className="text-slate-400 dark:text-slate-500">Requested Departure: </span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {req.regularization_requested_checkout.slice(0, 5)}
                        </span>
                      </div>
                    )}
                    {req.check_in_time && (
                      <div className="line-through text-slate-400 dark:text-slate-600">
                        Original: {req.check_in_time.slice(0, 5)}
                      </div>
                    )}
                  </div>

                  {req.regularization_reason && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                      "{req.regularization_reason}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate(req.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-8 px-3"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectMutation.mutate(req.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    className="border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-bold h-8 px-3"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
