import { useState } from 'react';
import { Plus, Filter, BedDouble, AirVent, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useHotelRooms, useUpdateHotelRoomStatus, type HotelRoom } from '../../api/useHotelRooms';
import { AddRoomModal } from '../components/AddRoomModal';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  available:    { label: 'Available',    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  occupied:     { label: 'Occupied',     color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  reserved:     { label: 'Reserved',     color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  dirty:        { label: 'Dirty',        color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
  maintenance:  { label: 'Maintenance',  color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50 text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
  blocked:      { label: 'Blocked',      color: 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-500', dot: 'bg-slate-400' },
};

const STATUS_LIST = ['all', 'available', 'occupied', 'reserved', 'dirty', 'maintenance', 'blocked'];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Room Status Board</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} · Live status view
          </p>
        </div>
        <Button
          onClick={() => { setEditingRoom(null); setAddOpen(true); }}
          className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </Button>
      </div>

      {/* Status Legend / Filter pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_LIST.map(s => {
          const cfg = STATUS_CONFIG[s];
          const count = s === 'all' ? rooms.length : (counts[s] || 0);
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filterStatus === s
                  ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-amber-300'
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
            <div key={i} className="h-28 bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 text-slate-400 dark:text-slate-500">
          <div className="text-5xl mb-4">🚪</div>
          <p className="font-medium">No rooms found</p>
          <p className="text-sm mt-1">
            {filterStatus !== 'all' ? `No ${filterStatus} rooms right now.` : 'Add your first room to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {rooms.map(room => {
            const cfg = STATUS_CONFIG[room.status];
            return (
              <div
                key={room.id}
                className={`relative group border-2 rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${cfg.color}`}
                onClick={() => { setEditingRoom(room); setAddOpen(true); }}
              >
                {/* Status dot */}
                <div className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full ${cfg.dot} ring-2 ring-white dark:ring-black`} />

                {/* Room number */}
                <div className="text-2xl font-black mb-1">{room.room_number}</div>

                {/* Floor */}
                {room.floor && (
                  <div className="text-[10px] font-medium opacity-70 mb-2">{room.floor} Floor</div>
                )}

                {/* Room type */}
                <div className="text-[11px] font-semibold truncate">{room.room_type?.name || '—'}</div>

                {/* Icons */}
                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] opacity-60">
                  {room.is_ac && <AirVent className="w-3 h-3" />}
                  <BedDouble className="w-3 h-3" />
                  <span>₹{Number(room.current_tariff || room.room_type?.base_price_weekday || 0).toLocaleString()}</span>
                </div>

                {/* Status badge */}
                <div className="mt-2">
                  <span className="text-[10px] font-bold uppercase">{cfg.label}</span>
                </div>

                {/* Status quick-change dropdown on hover */}
                <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <select
                    className="text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-2 py-1.5 border-0 shadow-lg font-semibold cursor-pointer"
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

      <AddRoomModal
        isOpen={isAddOpen}
        onClose={() => { setAddOpen(false); setEditingRoom(null); }}
        editingRoom={editingRoom}
      />
    </div>
  );
}
