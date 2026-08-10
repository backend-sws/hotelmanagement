import { useState, useMemo } from 'react';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import { 
  useWeeklyRoster, 
  useDepartments, 
  useShifts 
} from '../api/useHotelRoster';
import { RosterGrid } from '../components/RosterGrid';
import { AssignShiftModal } from '../components/AssignShiftModal';
import { BulkAssignModal } from '../components/BulkAssignModal';
import { SwapRequestModal } from '../components/SwapRequestModal';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronLeft, ChevronRight, Filter, Users, Loader2, CalendarCheck, UserX, Umbrella } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import type { RosterEntry, HotelDepartment } from '../schemas/rosterSchema';

export function ShiftRosterPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDept, setSelectedDept] = useState<string>('all');
  
  const weekStart = useMemo(() => format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd'), [currentDate]);
  
  const { data: rosterData, isLoading, isFetching } = useWeeklyRoster(weekStart, selectedDept !== 'all' ? parseInt(selectedDept) : undefined);
  const { data: departments } = useDepartments();
  const { data: shifts } = useShifts();

  const [assignModal, setAssignModal] = useState<{ isOpen: boolean; userId: number; date: string; userName: string; entry?: RosterEntry }>({
    isOpen: false, userId: 0, date: '', userName: ''
  });
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [swapModal, setSwapModal] = useState<{ isOpen: boolean; entry?: RosterEntry }>({ isOpen: false });

  const handlePrevWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleCellClick = (userId: number, date: string, entry?: RosterEntry) => {
    const user = rosterData?.staff.find((s: any) => s.id === userId);
    setAssignModal({
      isOpen: true,
      userId,
      date,
      userName: user?.name || 'Unknown',
      entry
    });
  };

  const handleSwapClick = (entry: RosterEntry) => {
    setSwapModal({ isOpen: true, entry });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  const staff = rosterData?.staff || [];
  const dates = rosterData?.dates || [];
  const cells = rosterData?.cells || {};

  // Stats calculation
  let scheduled = 0;
  let absent = 0;
  let onLeave = 0;
  
  Object.values(cells).forEach((entry: any) => {
    if (entry.status === 'absent') absent++;
    else if (entry.status === 'on_leave') onLeave++;
    else if (['scheduled', 'attended', 'swapped'].includes(entry.status)) scheduled++;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            <CalendarDays className="w-7 h-7 text-indigo-500" />
            Staff Shift Roster
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage weekly staff schedules and shift swaps</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={() => setBulkModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-105 rounded-xl px-5 h-10">
            <Users className="w-4 h-4 mr-2" />
            Bulk Assign
          </Button>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center shadow-inner">
            <Button variant="ghost" size="icon" onClick={handlePrevWeek} className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="h-8 font-medium px-4 flex items-center gap-2 w-32 justify-center" onClick={handleToday}>
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin text-slate-500" /> : format(currentDate, 'MMM yyyy')}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextWeek} className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 shadow-sm border-slate-200/60 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-3 h-full bg-slate-50/50 dark:bg-slate-900/50">
            <Filter className="w-5 h-5 text-indigo-400" />
            <Select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="border-0 shadow-none focus:ring-0 px-0 bg-transparent font-medium text-slate-700 dark:text-slate-300">
              <option value="all">All Departments</option>
              {departments?.map((d: HotelDepartment) => (
                <option key={d.id} value={d.id.toString()}>{d.name}</option>
              ))}
            </Select>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <Card className="group border-slate-200/60 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-5 flex items-center gap-4 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-900/10 h-full">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Scheduled Shifts</div>
                <div className="text-3xl font-black text-slate-800 dark:text-white leading-none">{scheduled}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="group border-slate-200/60 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-5 flex items-center gap-4 bg-gradient-to-br from-white to-red-50/30 dark:from-slate-900 dark:to-red-900/10 h-full">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <UserX className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Absences</div>
                <div className="text-3xl font-black text-slate-800 dark:text-white leading-none">{absent}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="group border-slate-200/60 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-5 flex items-center gap-4 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-900/10 h-full">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Umbrella className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">On Leave</div>
                <div className="text-3xl font-black text-slate-800 dark:text-white leading-none">{onLeave}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-xl shadow-sm overflow-hidden p-1">
        <RosterGrid 
          dates={dates}
          staff={staff}
          cells={cells}
          shifts={shifts}
          onCellClick={handleCellClick}
          onSwapClick={handleSwapClick}
        />
      </div>

      {assignModal.isOpen && (
        <AssignShiftModal 
          isOpen={assignModal.isOpen}
          onClose={() => setAssignModal({ ...assignModal, isOpen: false })}
          userId={assignModal.userId}
          userName={assignModal.userName}
          date={assignModal.date}
          currentEntry={assignModal.entry}
          departments={departments || []}
        />
      )}

      {bulkModalOpen && (
        <BulkAssignModal 
          isOpen={bulkModalOpen}
          onClose={() => setBulkModalOpen(false)}
          staff={staff}
          departments={departments || []}
        />
      )}

      {swapModal.isOpen && swapModal.entry && (
        <SwapRequestModal 
          isOpen={swapModal.isOpen}
          onClose={() => setSwapModal({ isOpen: false })}
          entry={swapModal.entry}
          staff={staff}
        />
      )}

    </div>
  );
}

