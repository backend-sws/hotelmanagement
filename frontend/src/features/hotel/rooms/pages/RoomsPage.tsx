import { useState } from 'react';
import { Plus, Filter, BedDouble, AirVent, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useHotelRooms, useUpdateHotelRoomStatus } from '../api/useHotelRooms';
import type { HotelRoom } from '../schemas/roomSchema';
import { STATUS_CONFIG, STATUS_LIST } from '../constants/roomConstants';
import { AddRoomModal } from '../components/AddRoomModal';
import { Button } from '@/components/ui/button';

export function RoomsPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<HotelRoom | null>(null);

  const { data: rooms = [], isLoading } = useHotelRooms(
    filterStatus !== 'all' ? { status: filterStatus } : undefined
  );
  const updateStatus = useUpdateHotelRoomStatus();

  const counts = rooms.reduce((acc: Record<string, number>, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const handleStatusChange = async (room: HotelRoom, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: room.id, status: newStatus });
      toast.success(`Room ${room.room_number} → ${newStatus}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-500/10 dark:bg-primary-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary-500/10 dark:bg-primary-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center">
                <BedDouble className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Room Status Board <span className="text-primary-600 dark:text-primary-400 text-base font-bold px-2 py-0.5 rounded-md bg-primary-500/10">Live View</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {rooms.length} room{rooms.length !== 1 ? 's' : ''} · Track real-time occupancy status and quickly update room availability.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button 
              onClick={() => { setEditingRoom(null); setAddOpen(true); }}
              className="rounded-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-md shadow-primary-500/20 px-4 h-10 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Room
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="w-full flex flex-wrap gap-2 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          {STATUS_LIST.map(s => {
            const cfg = STATUS_CONFIG[s];
            const count = s === 'all' ? rooms.length : (counts[s] || 0);
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filterStatus === s
                    ? 'bg-primary-500 border-primary-500 text-white shadow-sm'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary-300'
                }`}
              >
                {cfg && <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
                {s === 'all' ? 'All' : cfg.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  filterStatus === s ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Rooms Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl border border-slate-200/80 dark:border-white/10" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-24 bg-white/50 dark:bg-[#111118]/50 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20 text-slate-400 dark:text-slate-500">
            <div className="text-6xl mb-4 opacity-50">🚪</div>
            <p className="font-bold text-lg text-slate-700 dark:text-slate-300">No rooms found</p>
            <p className="text-sm mt-1">
              {filterStatus !== 'all' ? `No ${filterStatus} rooms right now.` : 'Add your first room to get started.'}
            </p>
            {filterStatus === 'all' && (
              <Button 
                onClick={() => { setEditingRoom(null); setAddOpen(true); }}
                className="mt-6 rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white px-6"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Your First Room
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {rooms.map(room => {
              const cfg = STATUS_CONFIG[room.status];
              return (
                <div
                  key={room.id}
                  className={`relative group bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md border-2 rounded-2xl p-3 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${cfg.color}`}
                  onClick={() => { setEditingRoom(room); setAddOpen(true); }}
                >
                  {/* Status dot */}
                  <div className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full ${cfg.dot} ring-2 ring-white dark:ring-black`} />

                  {/* Room number */}
                  <div className="text-2xl font-black mb-1 text-slate-900 dark:text-white tracking-tight">{room.room_number}</div>

                  {/* Floor */}
                  {room.floor && (
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">{room.floor} Floor</div>
                  )}

                  {/* Room type */}
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{room.room_type?.name || '—'}</div>

                  {/* Icons */}
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    {room.is_ac && <AirVent className="w-3.5 h-3.5 text-blue-500" />}
                    <BedDouble className="w-3.5 h-3.5" />
                    <span className="ml-auto text-emerald-600 dark:text-emerald-400">₹{Number(room.current_tariff || room.room_type?.base_price_weekday || 0).toLocaleString()}</span>
                  </div>

                  {/* Status badge */}
                  <div className="mt-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider">{cfg.label}</span>
                  </div>

                  {/* Status quick-change dropdown on hover */}
                  <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <select
                      className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 border-0 shadow-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      value={room.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); handleStatusChange(room, e.target.value); }}
                    >
                      {Object.entries(STATUS_CONFIG).map(([val, c]) => (
                        <option key={val} value={val}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddRoomModal
        isOpen={isAddOpen}
        onClose={() => { setAddOpen(false); setEditingRoom(null); }}
        editingRoom={editingRoom}
      />
    </div>
  );
}
