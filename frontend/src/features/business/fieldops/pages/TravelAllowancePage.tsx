import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Navigation,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  User,
  Filter,
  Calendar,
  Layers,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Award,
  AlertCircle,
  X,
  Send,
  Zap,
  Check
} from 'lucide-react';
import {
  useTravelAllowances,
  useApproveClaim,
  useRejectClaim,
  useRecalculateClaim,
  useSyncPayroll,
  type TravelAllowanceItem
} from '../api/useTravelAllowance';
import { useFieldStaff } from '../api/useFieldTasks';

export default function TravelAllowancePage() {
  const currentYearMonth = new Date().toISOString().slice(0, 7); // '2026-09'
  const [selectedMonth, setSelectedMonth] = useState<string>(currentYearMonth);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [rejectModalClaim, setRejectModalClaim] = useState<TravelAllowanceItem | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Queries & Mutations
  const { data: claimsData, isLoading, refetch } = useTravelAllowances({
    month: selectedMonth,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    staff_id: selectedStaff !== 'all' ? Number(selectedStaff) : undefined,
  });
  const { data: staffList = [] } = useFieldStaff();

  const approveMutation = useApproveClaim();
  const rejectMutation = useRejectClaim();
  const recalculateMutation = useRecalculateClaim();
  const syncPayrollMutation = useSyncPayroll();

  const claims = claimsData?.data?.data || [];
  const metrics = claimsData?.metrics || {
    total_km: 0,
    total_amount: 0,
    approved_amount: 0,
    pending_count: 0,
    active_drivers: 0,
  };

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync(id);
      setSuccessToast(`Claim #${id} approved successfully!`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to approve claim');
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalClaim) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectModalClaim.id, notes: rejectReason });
      setRejectModalClaim(null);
      setRejectReason('');
      setSuccessToast(`Claim #${rejectModalClaim.id} marked as rejected.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to reject claim');
    }
  };

  const handleRecalculate = async (id: number) => {
    try {
      await recalculateMutation.mutateAsync(id);
      setSuccessToast(`GPS distance for claim #${id} recalculated!`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to recalculate distance');
    }
  };

  const handleSyncPayroll = async () => {
    try {
      const res = await syncPayrollMutation.mutateAsync(selectedMonth);
      setIsPayrollModalOpen(false);
      setSuccessToast(`Payroll synced! ${res.synced_count} staff travel reimbursements exported.`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Payroll sync failed');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case 'paid':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1"><Award className="w-3 h-3" /> Paid in Payroll</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const getVehicleBadge = (vehicle: string) => {
    switch (vehicle) {
      case 'car':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">🚗 Car (₹8/KM)</span>;
      case 'public_transit':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">🚌 Public (₹2.5/KM)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🏍️ Two-Wheeler (₹3.5/KM)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0c0e] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-sm">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-600 dark:text-emerald-400 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#121316] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Automated Travel Allowance (TA/DA) & Mileage
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Verified GPS route distance calculation across field check-ins. Multi-tier vehicle rates and 1-click Payroll sync.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl transition border border-slate-200 dark:border-white/10 flex items-center gap-2 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsPayrollModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center gap-2 text-sm"
          >
            <DollarSign className="w-4 h-4" />
            <span>Sync with Payroll</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Route Distance</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metrics.total_km} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">KM</span></p>
        </div>
        <div className="bg-white dark:bg-[#121316] border border-amber-500/30 dark:border-amber-500/20 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider">Total Calculated TA/DA</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">₹{Number(metrics.total_amount).toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-[#121316] border border-emerald-500/30 dark:border-emerald-500/20 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Approved TA/DA</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹{Number(metrics.approved_amount).toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-[#121316] border border-indigo-500/30 dark:border-indigo-500/20 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider">Pending Claims</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{metrics.pending_count}</p>
        </div>
        <div className="bg-white dark:bg-[#121316] border border-purple-500/30 dark:border-purple-500/20 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wider">Active Field Staff</span>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{metrics.active_drivers}</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#121316] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Month Selector */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="font-medium">Month:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid in Payroll</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Staff Filter */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <User className="w-4 h-4 text-slate-500" />
            <span className="font-medium">Staff:</span>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="all">All Staff</option>
              {staffList.map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Claims Count: <span className="text-amber-600 dark:text-amber-400 font-bold">{claims.length}</span>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white dark:bg-[#121316] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-white/[0.02] text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Route Journey</th>
                <th className="px-4 py-3">Distance & Rate</th>
                <th className="px-4 py-3">Total TA/DA</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                    No travel allowance claims found for this period. As field staff punch in, arrive at task sites, and punch out, routes and allowances calculate automatically.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {new Date(claim.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{claim.staff?.name || 'Technician'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{claim.staff?.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getVehicleBadge(claim.vehicle_type)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="font-medium text-slate-900 dark:text-slate-200">{claim.start_location || 'Base HQ'}</span>
                        <ArrowRight className="w-3 h-3 text-amber-500" />
                        <span className="font-medium text-slate-900 dark:text-slate-200">{claim.end_location || 'Final Site'}</span>
                      </div>
                      {claim.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">{claim.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{claim.total_km} KM</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">@ ₹{claim.rate_per_km}/KM</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400 text-base">
                      ₹{Number(claim.total_amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(claim.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {claim.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(claim.id)}
                              title="Approve Claim"
                              className="p-1.5 bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-lg transition"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRejectModalClaim(claim)}
                              title="Reject Claim"
                              className="p-1.5 bg-rose-50 dark:bg-rose-600/20 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 rounded-lg transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleRecalculate(claim.id)}
                          title="Recalculate from GPS Waypoints"
                          className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 rounded-lg transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECT CLAIM MODAL */}
      {rejectModalClaim && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Reject Travel Claim #{rejectModalClaim.id}</h3>
              <button onClick={() => setRejectModalClaim(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Rejection <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Unverified private detour or incorrect vehicle type selected..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalClaim(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectMutation.isPending}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* SYNC WITH PAYROLL MODAL */}
      {isPayrollModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Sync TA/DA with Payroll</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Month: {selectedMonth}</p>
                </div>
              </div>
              <button onClick={() => setIsPayrollModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4 text-xs space-y-2 text-purple-900 dark:text-purple-200">
              <p className="font-semibold text-sm text-purple-950 dark:text-purple-100">Payroll Integration Notice:</p>
              <p>
                This action aggregates all <span className="font-bold text-purple-900 dark:text-white">Approved</span> travel claims for <span className="font-bold text-purple-900 dark:text-white">{selectedMonth}</span> and exports them directly into the Payroll system as a verified Travel Reimbursement earning component.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-purple-200 dark:border-purple-500/30 font-mono text-xs">
                <span>Approved Amount to Sync:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{Number(metrics.approved_amount).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPayrollModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSyncPayroll}
                disabled={syncPayrollMutation.isPending || metrics.approved_amount === 0}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-purple-600/20"
              >
                {syncPayrollMutation.isPending ? 'Syncing...' : 'Export to Payroll Now'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
