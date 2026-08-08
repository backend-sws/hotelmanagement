import { useState } from 'react';
import { Pencil, Trash2, Plus, Users, Wifi, AirVent, Tv } from 'lucide-react';
import { toast } from 'sonner';
import {
  useHotelRoomTypes,
  useDeleteHotelRoomType,
  type HotelRoomType,
} from '../../api/useHotelRooms';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Room Types</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Define room categories with pricing, amenities and occupancy.
          </p>
        </div>
        <Button
          onClick={() => { setEditingType(null); setModalOpen(true); }}
          className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Room Type
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : roomTypes.length === 0 ? (
        <div className="text-center py-20 text-slate-400 dark:text-slate-500">
          <div className="text-5xl mb-4">🛏️</div>
          <p className="font-medium">No room types yet</p>
          <p className="text-sm mt-1">Create room types like Deluxe, Suite, Standard etc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomTypes.map(type => (
            <div
              key={type.id}
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-5 hover:shadow-md transition-shadow group"
            >
              {/* Header row */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{type.name}</h3>
                    {type.short_code && (
                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded uppercase">
                        {type.short_code}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400 text-xs">
                    <Users className="w-3.5 h-3.5" />
                    <span>Max {type.max_occupancy} guests</span>
                    {type.rooms_count !== undefined && (
                      <span className="ml-2 text-slate-400">· {type.rooms_count} rooms</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingType(type); setModalOpen(true); }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(type)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center bg-slate-50 dark:bg-white/5 rounded-lg py-2">
                  <div className="text-xs text-slate-400 mb-0.5">Weekday</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">₹{Number(type.base_price_weekday).toLocaleString()}</div>
                </div>
                <div className="text-center bg-slate-50 dark:bg-white/5 rounded-lg py-2">
                  <div className="text-xs text-slate-400 mb-0.5">Weekend</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">₹{Number(type.base_price_weekend || type.base_price_weekday).toLocaleString()}</div>
                </div>
                <div className="text-center bg-amber-50 dark:bg-amber-900/20 rounded-lg py-2">
                  <div className="text-xs text-amber-600 dark:text-amber-400 mb-0.5">Peak</div>
                  <div className="font-bold text-amber-700 dark:text-amber-300 text-sm">₹{Number(type.base_price_peak || type.base_price_weekday).toLocaleString()}</div>
                </div>
              </div>

              {/* Amenities */}
              {type.amenities && type.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {type.amenities.map(a => (
                    <span key={a} className="flex items-center gap-1 text-[11px] bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                      {AMENITY_ICONS[a] ?? null}
                      {a}
                    </span>
                  ))}
                </div>
              )}

              {/* Status */}
              {!type.is_active && (
                <div className="mt-3 text-xs text-red-500 font-medium">● Inactive</div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddRoomTypeModal
        isOpen={isModalOpen}
        onClose={() => { setModalOpen(false); setEditingType(null); }}
        editingType={editingType}
      />
    </div>
  );
}
