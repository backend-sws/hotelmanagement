import React, { useState, useMemo } from 'react';
import {
  format, getDaysInMonth, startOfMonth, getDay, parseISO,
  addMonths, subMonths, isToday, isSameMonth,
} from 'date-fns';
import {
  useHolidays,
  useAddHoliday,
  useDeleteHoliday,
  useAutoApplyHolidays,
} from '../api/useAttendance';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Badge } from '@/components/ui/badge';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Calendar, Plus, Trash2, RefreshCw, Zap, Gift,
  CheckCircle2, Sparkles, ChevronLeft, ChevronRight,
  Clock, ShieldAlert, Info,
} from 'lucide-react';
import { toast } from 'sonner';

const TYPE_CONFIG = {
  national: {
    label: 'National',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    chip: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50',
    dot: 'bg-rose-500',
  },
  optional: {
    label: 'Optional',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    chip: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
    dot: 'bg-amber-500',
  },
  custom: {
    label: 'Custom',
    badge: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
    chip: 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-900/50',
    dot: 'bg-primary-500',
  },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HolidayCalendarPage() {
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    date: '',
    name: '',
    type: 'custom' as 'national' | 'optional' | 'custom',
    is_paid: true,
    description: '',
  });

  const { data: holidays = [], isLoading, refetch } = useHolidays(month);
  const addMutation = useAddHoliday();
  const deleteMutation = useDeleteHoliday();
  const autoApplyMutation = useAutoApplyHolidays();

  // Parse current selected year and month
  const currentDate = useMemo(() => {
    const [yr, mo] = month.split('-').map(Number);
    return new Date(yr, mo - 1, 1);
  }, [month]);

  // Navigate months
  const handlePrevMonth = () => {
    setMonth(format(subMonths(currentDate, 1), 'yyyy-MM'));
  };

  const handleNextMonth = () => {
    setMonth(format(addMonths(currentDate, 1), 'yyyy-MM'));
  };

  const handleCurrentMonth = () => {
    setMonth(format(new Date(), 'yyyy-MM'));
  };

  // Build holiday map for fast lookup
  const holidayMap = useMemo(() => {
    const map: Record<string, typeof holidays[0]> = {};
    holidays.forEach(h => { map[h.date] = h; });
    return map;
  }, [holidays]);

  // Calendar grid data
  const calendarDays = useMemo(() => {
    const firstDay = getDay(startOfMonth(currentDate));
    const daysInMonth = getDaysInMonth(currentDate);
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [currentDate]);

  // Metrics calculation
  const stats = useMemo(() => {
    const total = holidays.length;
    const national = holidays.filter(h => h.type === 'national').length;
    const optional = holidays.filter(h => h.type === 'optional').length;
    const daysInMonth = getDaysInMonth(currentDate);

    // Calculate workdays excluding Sundays & holidays falling on non-Sundays
    let sundays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const [yr, mo] = month.split('-').map(Number);
      const dayOfWeek = getDay(new Date(yr, mo - 1, d));
      if (dayOfWeek === 0) sundays++;
    }
    const nonSundayHolidays = holidays.filter(h => {
      const dayOfWeek = getDay(parseISO(h.date));
      return dayOfWeek !== 0;
    }).length;

    const workingDays = Math.max(0, daysInMonth - sundays - nonSundayHolidays);
    return { total, national, optional, workingDays };
  }, [holidays, currentDate, month]);

  const dateStr = (day: number) => {
    const [yr, mo] = month.split('-');
    return `${yr}-${mo}-${String(day).padStart(2, '0')}`;
  };

  const handleOpenAddModal = (initialDate?: string) => {
    setForm({
      date: initialDate || format(new Date(), 'yyyy-MM-dd'),
      name: '',
      type: 'custom',
      is_paid: true,
      description: '',
    });
    setIsAddOpen(true);
  };

  const handleSubmit = () => {
    if (!form.date || !form.name.trim()) {
      toast.error('Date and Holiday Name are required');
      return;
    }
    addMutation.mutate(form, {
      onSuccess: () => {
        setIsAddOpen(false);
        setForm({ date: '', name: '', type: 'custom', is_paid: true, description: '' });
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Subtle Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -right-[10%] w-[45%] h-[45%] bg-primary-500/5 dark:bg-primary-500/10 blur-3xl rounded-full" />
        <div className="absolute top-[35%] -left-[15%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl rounded-full" />
      </div>

      <PageHeader
        title="Holiday Calendar"
        subtitle="Define monthly company holidays — automatically applied to staff attendance & payroll calculations"
        icon={Calendar}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => autoApplyMutation.mutate(month)}
              disabled={autoApplyMutation.isPending || holidays.length === 0}
              className="h-10 px-3.5 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
            >
              {autoApplyMutation.isPending ? (
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-emerald-500" />
              ) : (
                <Zap className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
              )}
              Auto-Apply to Attendance
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={() => handleOpenAddModal()}
              className="h-10 px-4 text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Holiday
            </Button>
          </div>
        }
      />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 pb-12 space-y-6">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Total Holidays"
            value={stats.total}
            icon={<Calendar className="w-5 h-5 text-white" />}
            glowColor="primary"
            subtitle={`In ${format(currentDate, 'MMMM yyyy')}`}
          />
          <CustomKpiCard
            title="National Holidays"
            value={stats.national}
            icon={<ShieldAlert className="w-5 h-5 text-white" />}
            glowColor="rose"
            subtitle="Gazetted / mandatory days"
          />
          <CustomKpiCard
            title="Optional Holidays"
            value={stats.optional}
            icon={<Sparkles className="w-5 h-5 text-white" />}
            glowColor="amber"
            subtitle="Festive / floating off"
          />
          <CustomKpiCard
            title="Est. Working Days"
            value={stats.workingDays}
            icon={<Clock className="w-5 h-5 text-white" />}
            glowColor="emerald"
            subtitle="Standard duty days"
          />
        </div>

        {/* Navigation & Controls Bar */}
        <div className="relative z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 border border-slate-200 dark:border-zinc-700/60">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCurrentMonth}
                className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <MonthPicker value={month} onChange={setMonth} />
          </div>

          {/* Legend Indicators */}
          <div className="flex items-center gap-3.5 flex-wrap">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span>{cfg.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-zinc-600" />
              <span>Sunday (Off)</span>
            </div>
          </div>
        </div>

        {/* Calendar and Holiday List Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar Grid */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            {/* Day Column Headers */}
            <div className="grid grid-cols-7 mb-3 text-center">
              {DAY_NAMES.map((d, i) => (
                <div
                  key={d}
                  className={`text-xs font-black uppercase tracking-wider py-2 select-none ${
                    i === 0 ? 'text-rose-500' : 'text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return (
                    <div
                      key={idx}
                      className="min-h-[90px] rounded-xl bg-slate-50/40 dark:bg-zinc-900/20 border border-transparent"
                    />
                  );
                }

                const ds = dateStr(day);
                const holiday = holidayMap[ds];
                const isSunday = (idx % 7) === 0;
                const isCurrentToday = isToday(parseISO(ds));
                const cfg = holiday ? TYPE_CONFIG[holiday.type] || TYPE_CONFIG.custom : null;

                return (
                  <div
                    key={idx}
                    onClick={() => !holiday && handleOpenAddModal(ds)}
                    className={`group relative min-h-[95px] p-2 rounded-xl border flex flex-col justify-between transition-all duration-200 select-none ${
                      holiday
                        ? `${cfg?.chip} shadow-xs`
                        : isSunday
                        ? 'bg-rose-500/[0.03] dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30'
                        : isCurrentToday
                        ? 'bg-primary-500/[0.04] dark:bg-primary-500/[0.08] border-primary-500/40 ring-1 ring-primary-500/20'
                        : 'bg-white dark:bg-zinc-900/50 border-slate-200/80 dark:border-zinc-800/80 hover:border-primary-400/50 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer'
                    }`}
                  >
                    {/* Top line with day number and badges */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isCurrentToday
                          ? 'w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center font-black shadow-xs'
                          : isSunday
                          ? 'text-rose-500'
                          : holiday
                          ? 'font-black'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {day}
                      </span>

                      {holiday ? (
                        <div className="flex items-center gap-1">
                          {!holiday.is_paid && (
                            <span className="text-[9px] font-black px-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                              Unpaid
                            </span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${cfg?.dot}`} />
                        </div>
                      ) : !isSunday ? (
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-primary-500 font-bold transition-opacity">
                          + Add
                        </span>
                      ) : null}
                    </div>

                    {/* Holiday Chip content inside cell */}
                    {holiday ? (
                      <div className="mt-1.5 space-y-1">
                        <div className="text-[11px] font-bold truncate leading-tight" title={holiday.name}>
                          {holiday.name}
                        </div>
                        <div className="flex items-center justify-between text-[10px] opacity-80">
                          <span className="capitalize">{holiday.type}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(holiday.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-rose-500 hover:text-rose-700 transition-opacity"
                            title="Remove holiday"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : isSunday ? (
                      <span className="text-[10px] font-semibold text-rose-400/70 mt-auto">
                        Sunday Off
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Month Holiday List */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Holidays in {format(currentDate, 'MMMM')}
                    </h3>
                    <p className="text-[11px] text-slate-500">{holidays.length} designated off-days</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenAddModal()}
                  className="h-8 px-2.5 text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>

              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-primary-500" />
                  <span className="text-xs">Loading holidays...</span>
                </div>
              ) : holidays.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="w-6 h-6 text-primary-500" />}
                  title="No holidays defined"
                  description={`No holiday schedule found for ${format(currentDate, 'MMMM yyyy')}. Add official or festive holidays.`}
                  action={
                    <Button
                      variant="brand"
                      size="sm"
                      onClick={() => handleOpenAddModal()}
                      className="font-bold cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add Holiday
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {holidays.map(h => {
                    const cfg = TYPE_CONFIG[h.type] || TYPE_CONFIG.custom;
                    return (
                      <div
                        key={h.id}
                        className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/40 hover:bg-slate-100 dark:hover:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/50 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] font-black uppercase text-slate-400">
                              {format(parseISO(h.date), 'EEE')}
                            </span>
                            <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                              {format(parseISO(h.date), 'dd')}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {h.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${cfg.badge}`}>
                                {cfg.label}
                              </span>
                              {!h.is_paid && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                  Unpaid
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(h.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete holiday"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Helper Note */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Click <strong>Auto-Apply to Attendance</strong> to mark all active staff attendance as Holiday for designated dates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Holiday Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <span>Add Business Holiday</span>
          </div>
        }
        description="Schedule a holiday that will be excluded from attendance and payroll penalties."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Holiday Date *
            </label>
            <Input
              type="date"
              value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Holiday Name *
            </label>
            <Input
              placeholder="e.g., Independence Day, Eid, Diwali, Annual Picnic..."
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
              Holiday Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['national', 'optional', 'custom'] as const).map(t => {
                const isSelected = form.type === t;
                const cfg = TYPE_CONFIG[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, type: t }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-500/10 border-primary-500 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500/30 shadow-xs'
                        : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Paid Holiday</span>
              <span className="text-[10px] text-slate-500">Staff receives full salary for this day</span>
            </div>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, is_paid: !p.is_paid }))}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                form.is_paid ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-700'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                form.is_paid ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Notes / Description (Optional)
            </label>
            <Input
              placeholder="e.g., Mandatory national closure..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handleSubmit}
              disabled={addMutation.isPending || !form.name.trim() || !form.date}
              isLoading={addMutation.isPending}
              className="font-bold cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Save Holiday
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
