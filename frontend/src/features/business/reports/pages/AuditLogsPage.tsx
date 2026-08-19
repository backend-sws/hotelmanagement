import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Database, Eye, Activity, Edit, Trash2, PlusCircle, ArrowRight, Search, Calendar, RotateCcw, Layers, Sparkles } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useAuditLogs } from '../api/useAuditLogs';
import { format } from 'date-fns';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useStaff } from '../../staff/api/useStaff';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { SearchableSelect } from '@/components/ui/searchable-select';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data: staffList } = useStaff();
  const { data, isLoading } = useAuditLogs({ 
    page, 
    per_page: 20, 
    search: search || undefined,
    module: moduleFilter || undefined,
    action: actionFilter || undefined, 
    user_id: userFilter || undefined,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
  });

  const handleResetFilters = () => {
    setSearch('');
    setModuleFilter('');
    setActionFilter('');
    setUserFilter('');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || moduleFilter || actionFilter || userFilter || fromDate || toDate);

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
      case 'updated':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
      case 'deleted':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800';
      case 'check_in':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800';
      case 'check_out':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800';
      case 'night_audit':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800';
      case 'billed':
      case 'post_to_room':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800';
      case 'cheque_cleared':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300 dark:border-teal-800';
      case 'cheque_bounced':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700';
    }
  };

  const formatModelName = (modelType?: string) => {
    if (!modelType) return 'N/A';
    const base = modelType.split('\\').pop() || modelType;
    return base.replace(/([A-Z])/g, ' $1').trim();
  };

  const columns = [
    {
      header: 'Time',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
            {format(new Date(row.created_at), 'dd MMM yyyy')}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {format(new Date(row.created_at), 'hh:mm a')}
          </span>
        </div>
      ),
    },
    {
      header: 'User',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-xs text-slate-900 dark:text-slate-200">
            {row.user?.name || 'System / Auto'}
          </span>
          {row.user?.email && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {row.user.email}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Action',
      cell: (row: any) => (
        <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md inline-block ${getActionBadgeClass(row.action)}`}>
          {row.action.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Module / Target',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>{formatModelName(row.model_type)}</span>
          {row.model_id && (
            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">#{row.model_id}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Description',
      cell: (row: any) => (
        <span className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 max-w-md font-medium">
          {row.description || 'Action performed'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedLog(row)} className="h-8 px-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
          <Eye className="w-3.5 h-3.5 mr-1.5" /> View Details
        </Button>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <PageHeader 
          icon={Database}
          title="System Audit Logs"
          subtitle="Comprehensive real-time tracking of hotel operations, front-desk, billing, purchases, banking, and system activities"
        />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-2 pb-6 space-y-6">
          
          {/* Analytics KPI Cards */}
          {data?.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <CustomKpiCard
                title="Total Logs"
                value={data.stats.total}
                subtitle="All logged records"
                icon={<Activity />}
                glowColor="indigo"
              />
              <CustomKpiCard
                title="Created"
                value={data.stats.created}
                subtitle="New records added"
                icon={<PlusCircle />}
                glowColor="emerald"
              />
              <CustomKpiCard
                title="Updated"
                value={data.stats.updated}
                subtitle="Modifications made"
                icon={<Edit />}
                glowColor="amber"
              />
              <CustomKpiCard
                title="Deleted"
                value={data.stats.deleted}
                subtitle="Records removed"
                icon={<Trash2 />}
                glowColor="rose"
              />
              <CustomKpiCard
                title="Business Events"
                value={data.stats.events ?? 0}
                subtitle="Check-in/out, POS, Audits"
                icon={<Sparkles />}
                glowColor="indigo"
              />
            </div>
          )}

          {/* Search & Filters Bar */}
          <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30 space-y-3.5">
            
            {/* Top row: Search & Module Filter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              
              {/* Keyword Search */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search descriptions, logs, staff, #ref..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Module Filter */}
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 shrink-0">
                  <Layers className="w-3.5 h-3.5 inline mr-1" />
                  Module
                </span>
                <CustomSelect
                  options={[
                    { value: '', label: 'All Modules' },
                    { value: 'hotel', label: '🏨 Hotel Management (Bookings, Rooms, POS, Housekeeping)' },
                    { value: 'sales', label: '🧾 Sales & Invoices' },
                    { value: 'purchases_inventory', label: '📦 Purchases & Inventory' },
                    { value: 'finance', label: '💳 Banking, Cash & Cheques' },
                    { value: 'hrm', label: '👥 Staff & Payroll' },
                    { value: 'settings', label: '⚙️ Settings & Configuration' },
                  ]}
                  value={moduleFilter}
                  onChange={(val) => { setModuleFilter(val); setPage(1); }}
                  placeholder="Filter by Module"
                  className="w-full"
                />
              </div>

              {/* Staff Filter */}
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 shrink-0">Staff</span>
                <SearchableSelect
                  options={[{ value: '', label: 'All Staff' }, ...(staffList?.map((s: any) => ({ value: s.id.toString(), label: s.name })) || [])]}
                  value={userFilter}
                  onChange={(val) => { setUserFilter(String(val)); setPage(1); }}
                  placeholder="Filter by Staff"
                  className="w-full"
                  controlSize="sm"
                />
              </div>

              {/* Action Filter */}
              <div className="md:col-span-2 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 shrink-0">Action</span>
                <CustomSelect
                  options={[
                    { value: '', label: 'All Actions' },
                    { value: 'created', label: 'Created' },
                    { value: 'updated', label: 'Updated' },
                    { value: 'deleted', label: 'Deleted' },
                    { value: 'check_in', label: 'Check-In' },
                    { value: 'check_out', label: 'Check-Out' },
                    { value: 'night_audit', label: 'Night Audit' },
                    { value: 'billed', label: 'POS Billed' },
                    { value: 'post_to_room', label: 'Posted to Room' },
                    { value: 'cheque_cleared', label: 'Cheque Cleared' },
                    { value: 'cheque_bounced', label: 'Cheque Bounced' },
                  ]}
                  value={actionFilter}
                  onChange={(val) => { setActionFilter(val); setPage(1); }}
                  placeholder="All Actions"
                  className="w-full"
                />
              </div>

            </div>

            {/* Bottom row: Date Filters & Clear Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">From</span>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">To</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetFilters}
                  className="text-xs h-7 px-2.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border-dashed"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" /> Clear Filters
                </Button>
              )}
            </div>

          </div>

          {/* Logs Data Table */}
          <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-black/40 overflow-hidden">
            <DataTable 
              columns={columns} 
              data={data?.data || []} 
              isLoading={isLoading}
              serverSide={true}
              totalItems={data?.total || 0}
              page={page}
              itemsPerPage={20}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedLog} 
        onClose={() => setSelectedLog(null)} 
        title="Audit Log Details"
        maxWidth="lg"
      >
        {selectedLog && (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50/50 dark:bg-zinc-900/50 p-4 border border-slate-200/50 dark:border-white/5 rounded-xl">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-zinc-500 mb-1">Time</p>
                <p className="font-semibold text-slate-900 dark:text-white">{format(new Date(selectedLog.created_at), 'dd MMM yyyy, hh:mm a')}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-zinc-500 mb-1">User</p>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedLog.user?.name || 'System / Automated'}</p>
                <p className="text-[10px] text-slate-500 font-medium">{selectedLog.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-zinc-500 mb-1">Action</p>
                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${getActionBadgeClass(selectedLog.action)}`}>
                  {selectedLog.action.replace(/_/g, ' ')}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-zinc-500 mb-1">Target Entity</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatModelName(selectedLog.model_type)} <span className="text-zinc-400 font-medium">#{selectedLog.model_id}</span>
                </p>
              </div>
              {selectedLog.description && (
                <div className="col-span-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-zinc-500 mb-1">Summary</p>
                  <p className="font-medium text-xs text-slate-800 dark:text-slate-200">{selectedLog.description}</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-white/10 pt-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white mb-4">Properties & Data Changes</p>
              {selectedLog.properties ? (
                selectedLog.action === 'updated' && selectedLog.properties.old && selectedLog.properties.new ? (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <div>Old Values</div>
                      <div>New Values</div>
                    </div>
                    {Object.keys(selectedLog.properties.new).map(key => (
                      <div key={key} className="grid grid-cols-2 gap-3 items-center bg-slate-50/50 dark:bg-zinc-900/40 p-3 border border-slate-100 dark:border-white/5 rounded-xl">
                        <div className="text-xs text-rose-600 dark:text-rose-400 break-all flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-widest">{key.replace(/_/g, ' ')}</span> 
                          <span className="font-medium">{selectedLog.properties.old[key] === null ? 'None' : String(selectedLog.properties.old[key])}</span>
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 break-all flex flex-col gap-1 relative pl-2">
                          <ArrowRight className="w-3.5 h-3.5 absolute -left-2 top-1/2 -translate-y-1/2 text-slate-350 dark:text-zinc-600" />
                          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-widest">{key.replace(/_/g, ' ')}</span>
                          <span className="font-semibold">{selectedLog.properties.new[key] === null ? 'None' : String(selectedLog.properties.new[key])}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(selectedLog.properties.attributes || selectedLog.properties.old || selectedLog.properties).map(([key, value]) => (
                       <div key={key} className="flex flex-col sm:flex-row sm:items-center bg-slate-50/50 dark:bg-zinc-900/40 p-3 border border-slate-100 dark:border-white/5 rounded-xl gap-2 text-xs">
                         <span className="text-[9px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-widest w-36 shrink-0">{key.replace(/_/g, ' ')}</span>
                         <span className="text-slate-700 dark:text-slate-300 font-semibold break-all">{value === null ? 'None' : (typeof value === 'object' ? JSON.stringify(value) : String(value))}</span>
                       </div>
                    ))}
                  </div>
                )
              ) : (
                <p className="text-sm text-slate-500">No properties recorded for this action.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

