import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ClipboardList,
  Plus,
  Send,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Truck,
  Camera,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  X,
  ShieldCheck,
  Calendar,
  Layers,
  List,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  useFieldTasks,
  useFieldStaff,
  useCreateFieldTask,
  useUpdateFieldTask,
  useDispatchFieldTask,
  type FieldTaskItem,
  type CreateTaskPayload
} from '../api/useFieldTasks';
import { useWhatsAppWallet } from '../api/useWhatsAppWallet';

export default function FieldTasksPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<FieldTaskItem | null>(null);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  // Queries & Mutations
  const { data: tasksData, isLoading, refetch } = useFieldTasks({
    search: searchQuery || undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
  });
  const { data: staffList = [] } = useFieldStaff();
  const { data: walletData } = useWhatsAppWallet();
  const createTaskMutation = useCreateFieldTask();
  const updateTaskMutation = useUpdateFieldTask();
  const dispatchTaskMutation = useDispatchFieldTask();

  // Create Form State
  const [formState, setFormState] = useState<CreateTaskPayload>({
    staff_id: 0,
    title: '',
    description: '',
    site_name: '',
    site_lat: undefined,
    site_lng: undefined,
    site_address: '',
    client_name: '',
    client_phone: '',
    priority: 'medium',
    due_at: '',
    auto_dispatch: true,
  });

  const tasks = tasksData?.data?.data || [];
  const counts = tasksData?.counts || {
    total: 0,
    assigned: 0,
    in_transit: 0,
    reached: 0,
    awaiting_otp: 0,
    completed: 0,
    cancelled: 0,
  };

  const walletBalance = walletData?.wallet?.balance || 0;
  const isLowBalance = walletData?.wallet?.is_low_balance;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.staff_id || !formState.title || !formState.site_name) {
      alert('Please fill required fields (Technician, Title, Site Name)');
      return;
    }

    try {
      await createTaskMutation.mutateAsync(formState);
      setIsCreateModalOpen(false);
      setFormState({
        staff_id: 0,
        title: '',
        description: '',
        site_name: '',
        site_lat: undefined,
        site_lng: undefined,
        site_address: '',
        client_name: '',
        client_phone: '',
        priority: 'medium',
        due_at: '',
        auto_dispatch: true,
      });
      setDispatchSuccessMsg('Task dispatched to Technician on WhatsApp successfully!');
      setTimeout(() => setDispatchSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create task');
    }
  };

  const handleManualDispatch = async (taskId: number) => {
    try {
      await dispatchTaskMutation.mutateAsync(taskId);
      setDispatchSuccessMsg(`Task #${taskId} alert re-sent via WhatsApp!`);
      setTimeout(() => setDispatchSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Dispatch failed');
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormState((prev) => ({
            ...prev,
            site_lat: parseFloat(position.coords.latitude.toFixed(6)),
            site_lng: parseFloat(position.coords.longitude.toFixed(6)),
          }));
        },
        () => alert('Could not retrieve GPS coordinates.')
      );
    }
  };

  const kanbanColumns: Array<{
    id: FieldTaskItem['status'];
    label: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    bg: string;
  }> = [
    { id: 'assigned', label: 'Assigned', icon: <ClipboardList className="w-4 h-4" />, color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/10' },
    { id: 'in_transit', label: 'In Transit', icon: <Truck className="w-4 h-4" />, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
    { id: 'reached', label: 'Reached Site', icon: <MapPin className="w-4 h-4" />, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' },
    { id: 'awaiting_otp', label: 'Awaiting OTP', icon: <ShieldCheck className="w-4 h-4" />, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">High</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/30">Low</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">Medium</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0c0e] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Top Banner / Notification */}
      {dispatchSuccessMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-sm">{dispatchSuccessMsg}</span>
          </div>
          <button onClick={() => setDispatchSuccessMsg(null)} className="text-emerald-600 dark:text-emerald-400 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#121316] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Field Tasks & WhatsApp Dispatch
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Dispatch field operations directly to technicians' WhatsApp. Geofence arrival check & Client OTP verification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl transition border border-slate-200 dark:border-white/10 flex items-center gap-2 text-sm"
            title="Refresh Tasks"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'kanban' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'list' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Table
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create & Dispatch Task</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Tasks</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{counts.total}</p>
        </div>
        <div className="bg-white dark:bg-[#121316] border border-sky-200 dark:border-sky-500/20 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-sky-600 dark:text-sky-400 font-medium uppercase tracking-wider">Assigned</span>
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">{counts.assigned}</p>
        </div>
        <div className="bg-white dark:bg-[#121316] border border-amber-200 dark:border-amber-500/20 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider">In Transit</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{counts.in_transit}</p>
        </div>
        <div className="bg-white dark:bg-[#121316] border border-indigo-200 dark:border-indigo-500/20 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider">Reached Site</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{counts.reached}</p>
        </div>
        <div className="bg-white dark:bg-[#121316] border border-purple-200 dark:border-purple-500/20 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wider">Awaiting OTP</span>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{counts.awaiting_otp}</p>
        </div>
        <div className="bg-white dark:bg-[#121316] border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Completed</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{counts.completed}</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#121316] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, client, site..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Filter className="w-4 h-4" />
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View: Kanban or Table */}
      {viewMode === 'kanban' ? (
        /* KANBAN BOARD */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="bg-slate-100/70 dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-3 flex flex-col gap-3 min-h-[500px]">
                {/* Column Header */}
                <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${col.bg} border ${col.border}`}>
                  <div className="flex items-center gap-2">
                    <span className={col.color}>{col.icon}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{col.label}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${col.bg} ${col.color}`}>
                    {columnTasks.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex flex-col gap-3">
                  {columnTasks.length === 0 ? (
                    <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-xl p-6 text-center text-slate-400 dark:text-slate-600 text-xs">
                      No tasks in this stage
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 p-3.5 rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md space-y-3 group"
                      >
                        {/* Card Header: Title & Priority */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug line-clamp-2">
                            {task.title}
                          </h3>
                          {getPriorityBadge(task.priority)}
                        </div>

                        {/* Technician Assigned */}
                        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {task.staff?.name?.charAt(0) || 'T'}
                          </div>
                          <span className="font-medium truncate">{task.staff?.name || 'Unassigned'}</span>
                        </div>

                        {/* Location / Site */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{task.site_name}</span>
                        </div>

                        {/* Client details if any */}
                        {task.client_name && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{task.client_name}</span>
                          </div>
                        )}

                        {/* Card Footer */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{task.due_at ? new Date(task.due_at).toLocaleDateString() : 'Today'}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {task.proofs && task.proofs.length > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] flex items-center gap-0.5">
                                <Camera className="w-3 h-3" />
                                {task.proofs.length}
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleManualDispatch(task.id);
                              }}
                              title="Re-dispatch alert via WhatsApp"
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-[#121316] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Task & Priority</th>
                  <th className="px-4 py-3">Technician</th>
                  <th className="px-4 py-3">Site Location</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
                      No field tasks found. Click "Create & Dispatch Task" to get started!
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">{task.title}</span>
                          {getPriorityBadge(task.priority)}
                        </div>
                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{task.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 dark:text-slate-200">{task.staff?.name || 'Unassigned'}</div>
                        <div className="text-xs text-slate-500">{task.staff?.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800 dark:text-slate-200">{task.site_name}</div>
                        {task.site_lat && task.site_lng && (
                          <a
                            href={`https://maps.google.com/?q=${task.site_lat},${task.site_lng}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono mt-0.5"
                          >
                            <MapPin className="w-3 h-3" />
                            GPS Pin
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {task.client_name ? (
                          <div>
                            <div className="text-slate-800 dark:text-slate-200">{task.client_name}</div>
                            <div className="text-xs text-slate-500">{task.client_phone}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-800 border border-slate-700">
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {task.due_at ? new Date(task.due_at).toLocaleDateString() : 'Today'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManualDispatch(task.id);
                          }}
                          className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition"
                        >
                          <Send className="w-3 h-3" />
                          Dispatch
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {isCreateModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create & Dispatch Field Task</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Assign task to technician with auto WhatsApp dispatch</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet Balance notice */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Prepaid Wallet Balance:</span>
              <span className={`font-bold ${isLowBalance ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                ₹{Number(walletBalance).toFixed(2)} {isLowBalance && '(Low)'}
              </span>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC Filter Replacement & Compressor Check"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Technician Dropdown & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assign Technician <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formState.staff_id}
                    onChange={(e) => setFormState({ ...formState, staff_id: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value={0}>Select Technician</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.phone || 'No phone'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={formState.priority}
                    onChange={(e) => setFormState({ ...formState, priority: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Site Name & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Site / Client Location Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tower B, Floor 4 or Room 302"
                    value={formState.site_name}
                    onChange={(e) => setFormState({ ...formState, site_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Site Address</label>
                  <input
                    type="text"
                    placeholder="e.g. DLF Phase 2, Gurugram"
                    value={formState.site_address}
                    onChange={(e) => setFormState({ ...formState, site_address: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Client Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formState.client_name}
                    onChange={(e) => setFormState({ ...formState, client_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Phone (For OTP Verification)</label>
                  <input
                    type="text"
                    placeholder="e.g. 919876543210"
                    value={formState.client_phone}
                    onChange={(e) => setFormState({ ...formState, client_phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* GPS Coordinates Geofencing */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Geofence Site Coordinates (Optional)</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Use My Current Location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude (e.g. 28.4595)"
                    value={formState.site_lat || ''}
                    onChange={(e) => setFormState({ ...formState, site_lat: parseFloat(e.target.value) || undefined })}
                    className="px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude (e.g. 77.0266)"
                    value={formState.site_lng || ''}
                    onChange={(e) => setFormState({ ...formState, site_lng: parseFloat(e.target.value) || undefined })}
                    className="px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date / Completion Target</label>
                <input
                  type="datetime-local"
                  value={formState.due_at}
                  onChange={(e) => setFormState({ ...formState, due_at: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Instructions / Scope</label>
                <textarea
                  rows={3}
                  placeholder="Specific physical checks, safety guidelines or equipment requirements..."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Auto Dispatch Toggle */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Send WhatsApp Notification Immediately</span>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400/80">
                      Dispatches interactive template with [Start Journey] & [Reached Site] buttons (₹0.75 utility rate)
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formState.auto_dispatch}
                  onChange={(e) => setFormState({ ...formState, auto_dispatch: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTaskMutation.isPending}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {createTaskMutation.isPending ? 'Dispatching...' : 'Confirm & Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* TASK DETAILS / PROOFS MODAL */}
      {selectedTask && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedTask.title}</h2>
                  {getPriorityBadge(selectedTask.priority)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Task ID: #{selectedTask.id} • Created on {new Date(selectedTask.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & OTP Banner */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lifecycle Status</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">{selectedTask.status}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Client Verification OTP</span>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                  {selectedTask.client_otp ? (
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      {selectedTask.otp_verified_at ? `Verified (${selectedTask.client_otp}) ✅` : `Sent (${selectedTask.client_otp}) ⏳`}
                    </span>
                  ) : (
                    'Not required'
                  )}
                </p>
              </div>
            </div>

            {/* Key Metadata */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Assigned Technician:</span>
                <span className="text-slate-900 dark:text-slate-200 font-medium">{selectedTask.staff?.name} ({selectedTask.staff?.phone})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Site Name:</span>
                <span className="text-slate-900 dark:text-slate-200 font-medium">{selectedTask.site_name}</span>
              </div>
              {selectedTask.site_address && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Address:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-medium">{selectedTask.site_address}</span>
                </div>
              )}
              {selectedTask.client_name && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Client Contact:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-medium">{selectedTask.client_name} ({selectedTask.client_phone})</span>
                </div>
              )}
              {selectedTask.site_lat && selectedTask.site_lng && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">GPS Coordinates:</span>
                  <a
                    href={`https://maps.google.com/?q=${selectedTask.site_lat},${selectedTask.site_lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono text-xs"
                  >
                    {selectedTask.site_lat}, {selectedTask.site_lng}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Watermarked Proofs Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Submitted Proof Photos ({selectedTask.proofs?.length || 0})
              </h3>
              {!selectedTask.proofs || selectedTask.proofs.length === 0 ? (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 text-xs">
                  Technician has not uploaded any work proof photo yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {selectedTask.proofs.map((proof) => (
                    <div key={proof.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                      <img
                        src={proof.watermarked_photo_url || proof.raw_photo_url}
                        alt="Work proof"
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-2.5 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 font-medium">
                          <span>Verified Proof #{proof.id}</span>
                          <span className="text-emerald-600 dark:text-emerald-400">Watermarked</span>
                        </div>
                        <div className="text-slate-500 text-[10px]">
                          {new Date(proof.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleManualDispatch(selectedTask.id)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Re-dispatch WhatsApp Alert
              </button>

              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
