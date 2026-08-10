import React from 'react';
import { format, isToday } from 'date-fns';
import type { RosterStaff, RosterEntry, HotelShift } from '../schemas/rosterSchema';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Calendar, Coffee, Umbrella, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RosterGridProps {
  dates: string[];
  staff: RosterStaff[];
  cells: Record<string, RosterEntry>;
  shifts?: HotelShift[];
  onCellClick: (userId: number, date: string, entry?: RosterEntry) => void;
  onSwapClick: (entry: RosterEntry) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'week_off': return <Home className="w-3 h-3" />;
    case 'on_leave': return <Umbrella className="w-3 h-3" />;
    case 'holiday': return <Calendar className="w-3 h-3" />;
    case 'absent': return <span className="font-bold text-[10px]">X</span>;
    case 'attended': return <span className="font-bold text-[10px]">?</span>;
    default: return null;
  }
};

export function RosterGrid({ dates, staff, cells, shifts, onCellClick, onSwapClick }: RosterGridProps) {
  return (
    <div className="w-full overflow-x-auto border rounded-xl bg-white dark:bg-slate-900 shadow-sm relative">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-950 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="p-3 border-b border-r font-semibold sticky left-0 bg-slate-50 dark:bg-slate-950 z-20 min-w-[200px]">
              Staff Member
            </th>
            {dates.map(date => {
              const d = new Date(date);
              const today = isToday(d);
              return (
                <th key={date} className={cn("p-3 border-b border-r text-center min-w-[120px]", today && "bg-blue-50/50 dark:bg-blue-900/20")}>
                  <div className={cn("font-bold", today ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300")}>
                    {format(d, 'EEE')}
                  </div>
                  <div className="text-xs text-slate-500 font-normal">
                    {format(d, 'MMM d')}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {staff.map(user => (
            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
              <td className="p-3 border-b border-r sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 z-10 flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <UserCircle className="w-8 h-8 text-slate-300" />
                )}
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">{user.name}</div>
                  {user.phone && <div className="text-xs text-slate-500">{user.phone}</div>}
                </div>
              </td>
              {dates.map(date => {
                const key = `${user.id}_${date}`;
                const entry = cells[key];
                const shift = entry?.shift;
                
                // Styling based on status
                const isNonWorking = ['week_off', 'holiday', 'on_leave'].includes(entry?.status || '');
                const isAbsent = entry?.status === 'absent';

                return (
                  <td 
                    key={date} 
                    className={cn(
                      "p-2 border-b border-r relative cursor-pointer group/cell h-[60px] align-middle text-center",
                      isToday(new Date(date)) && "bg-blue-50/10 dark:bg-blue-900/10"
                    )}
                    onClick={() => onCellClick(user.id, date, entry)}
                  >
                    <div className="w-full h-full min-h-[40px] flex items-center justify-center relative">
                      {!entry ? (
                        <div className="opacity-0 group-hover/cell:opacity-100 text-slate-300 hover:text-blue-500 transition-opacity">
                          + Add
                        </div>
                      ) : (
                        <div 
                          className={cn(
                            "w-full px-2 py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all hover:brightness-105",
                            isNonWorking ? "bg-slate-100 text-slate-500 border border-slate-200" :
                            isAbsent ? "bg-red-50 text-red-600 border border-red-200" :
                            "text-white shadow-sm ring-1 ring-black/10 dark:ring-white/10"
                          )}
                          style={(!isNonWorking && !isAbsent && shift) ? { backgroundColor: shift.color } : undefined}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(entry.status)}
                            {isNonWorking ? (
                              entry.status.replace('_', ' ').toUpperCase()
                            ) : isAbsent ? (
                              'ABSENT'
                            ) : (
                              shift?.name.substring(0, 3).toUpperCase() || 'SHIFT'
                            )}
                          </div>
                          
                          {shift && !isNonWorking && !isAbsent && (
                            <div className="text-[10px] opacity-90 font-mono font-normal tracking-tighter">
                              {shift.start_time.substring(0,5)}-{shift.end_time.substring(0,5)}
                            </div>
                          )}

                          {entry.swap_status === 'pending' && (
                            <div 
                              className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md border-2 border-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSwapClick(entry);
                              }}
                              title="Pending Swap Request"
                            >
                              ?
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          {staff.length === 0 && (
            <tr>
              <td colSpan={dates.length + 1} className="p-8 text-center text-slate-500 bg-slate-50">
                No staff members found for this department.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

