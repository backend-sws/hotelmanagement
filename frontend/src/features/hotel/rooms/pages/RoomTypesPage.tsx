import { useState } from 'react';
import { Pencil, Trash2, Plus, Users, Wifi, AirVent, Tv } from 'lucide-react';
import { toast } from 'sonner';
import {
  useHotelRoomTypes,
  useDeleteHotelRoomType,
} from '../api/useHotelRooms';
import type { HotelRoomType } from '../schemas/roomSchema';
import { AddRoomTypeModal } from '../components/AddRoomTypeModal';
import { Button } from '@/components/ui/button';

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'AC': <AirVent className="w-3 h-3" />,
  'WiFi': <Wifi className="w-3 h-3" />,
  'TV': <Tv className="w-3 h-3" />,
};

export function RoomTypesPage() {
  const { data: roomTypes = [], isLoading } = useHotelRoomTypes();
  const deleteType = useDeleteHotelRoomType();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<HotelRoomType | null>(null);

  const handleDelete = async (type: HotelRoomType) => {
    if (type.rooms_count && type.rooms_count > 0) {
      toast.error(`Cannot delete — ${type.rooms_count} rooms use this type.`);
      return;
    }
    if (!confirm(`Delete room type "${type.name}"?`)) return;
    try {
      await deleteType.mutateAsync(type.id);
      toast.success('Room type deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                <Users className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Room Categories <span className="text-emerald-600 dark:text-emerald-400 text-base font-bold px-2 py-0.5 rounded-md bg-emerald-500/10">Base Config</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Define room categories with base pricing, amenities and max occupancy limits.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button 
              onClick={() => { setEditingType(null); setModalOpen(true); }}
              className="rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 px-4 h-10 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Room Type
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="relative z-30">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl border border-slate-200/80 dark:border-white/10" />
              ))}
            </div>
          ) : roomTypes.length === 0 ? (
            <div className="text-center py-24 bg-white/50 dark:bg-[#111118]/50 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm text-slate-400 dark:text-slate-500">
              <div className="text-6xl mb-4 opacity-50">🛏️</div>
              <p className="font-bold text-lg text-slate-700 dark:text-slate-300">No room types configured</p>
              <p className="text-sm mt-1">Create room types like Deluxe, Suite, or Standard to start adding inventory.</p>
              <Button 
                onClick={() => { setEditingType(null); setModalOpen(true); }}
                className="mt-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-6"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Configure First Room Type
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomTypes.map(type => (
                <div
                  key={type.id}
                  className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all group relative"
                >
                  {!type.is_active && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                      Inactive
                    </div>
                  )}

                  {/* Header row */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">{type.name}</h3>
                        {type.short_code && (
                          <span className="text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md uppercase tracking-wider border border-slate-200 dark:border-white/5">
                            {type.short_code}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Max {type.max_occupancy} guests</span>
                        {type.rooms_count !== undefined && (
                          <span className="ml-2 px-1.5 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md text-[10px] text-slate-600 dark:text-slate-300">
                            {type.rooms_count} Rooms Active
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingType(type); setModalOpen(true); }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(type)}
                        className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-xl p-1.5">
                    <div className="text-center rounded-lg py-1.5 hover:bg-white dark:hover:bg-white/5 transition-colors">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Weekday</div>
                      <div className="font-black text-slate-900 dark:text-white text-sm">₹{Number(type.base_price_weekday).toLocaleString()}</div>
                    </div>
                    <div className="text-center rounded-lg py-1.5 hover:bg-white dark:hover:bg-white/5 transition-colors border-x border-slate-100 dark:border-white/5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Weekend</div>
                      <div className="font-black text-slate-900 dark:text-white text-sm">₹{Number(type.base_price_weekend || type.base_price_weekday).toLocaleString()}</div>
                    </div>
                    <div className="text-center rounded-lg py-1.5 hover:bg-white dark:hover:bg-white/5 transition-colors">
                      <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Peak</div>
                      <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">₹{Number(type.base_price_peak || type.base_price_weekday).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Amenities */}
                  {type.amenities && type.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {type.amenities.map(a => (
                        <span key={a} className="flex items-center gap-1 text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200/50 dark:border-blue-800/30">
                          {AMENITY_ICONS[a] ?? null}
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-white/5 px-2.5 py-1 rounded-full inline-block">
                      No Amenities Defined
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddRoomTypeModal
        isOpen={isModalOpen}
        onClose={() => { setModalOpen(false); setEditingType(null); }}
        editingType={editingType}
      />
    </div>
  );
}
