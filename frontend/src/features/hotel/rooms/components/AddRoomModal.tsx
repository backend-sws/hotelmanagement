import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  useHotelRoomTypes,
  useCreateHotelRoom,
  useUpdateHotelRoom,
  useDeleteHotelRoom,
  type HotelRoom,
} from '../../api/useHotelRooms';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRoom?: HotelRoom | null;
}

interface FormValues {
  room_number: string;
  floor: string;
  room_type_id: number;
  is_ac: boolean;
  current_tariff: number;
  status: string;
  view_type: string;
  bed_type: string;
  max_occupancy: number | '';
  notes: string;
}

const VIEW_TYPES = ['none', 'city', 'garden', 'pool', 'sea', 'mountain', 'courtyard'];
const BED_TYPES = ['single', 'double', 'twin', 'king', 'queen'];
const STATUSES = ['available', 'occupied', 'reserved', 'dirty', 'maintenance', 'blocked'];

export function AddRoomModal({ isOpen, onClose, editingRoom }: AddRoomModalProps) {
  const { data: roomTypes = [] } = useHotelRoomTypes();
  const createRoom = useCreateHotelRoom();
  const updateRoom = useUpdateHotelRoom();
  const deleteRoom = useDeleteHotelRoom();
  const isEdit = !!editingRoom;

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset } = useForm<FormValues>({
    defaultValues: {
      room_number: editingRoom?.room_number || '',
      floor: editingRoom?.floor || '',
      room_type_id: editingRoom?.room_type_id || (roomTypes[0]?.id ?? 0),
      is_ac: editingRoom?.is_ac ?? true,
      current_tariff: editingRoom?.current_tariff || 0,
      status: editingRoom?.status || 'available',
      view_type: editingRoom?.view_type || 'none',
      bed_type: editingRoom?.bed_type || 'double',
      max_occupancy: editingRoom?.max_occupancy || '',
      notes: editingRoom?.notes || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        max_occupancy: data.max_occupancy === '' ? null : Number(data.max_occupancy),
        room_type_id: Number(data.room_type_id),
      };
      if (isEdit && editingRoom) {
        await updateRoom.mutateAsync({ id: editingRoom.id, data: payload });
        toast.success('Room updated');
      } else {
        await createRoom.mutateAsync(payload);
        toast.success('Room created');
      }
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!editingRoom || !confirm(`Delete room ${editingRoom.room_number}?`)) return;
    try {
      await deleteRoom.mutateAsync(editingRoom.id);
      toast.success('Room deleted');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot delete');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Room ${editingRoom?.room_number}` : 'Add Room'}
      maxWidth="xl"
      footer={
        <div className="flex justify-between w-full">
          <div>
            {isEdit && (
              <Button variant="destructive" size="sm" type="button" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button size="sm" form="room-form" type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600 text-white">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Save' : 'Create Room'}
            </Button>
          </div>
        </div>
      }
    >
      <form id="room-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Room No + Floor */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Room Number *</label>
            <Input {...register('room_number', { required: 'Required' })} placeholder="101" />
            {errors.room_number && <p className="text-red-500 text-xs mt-1">{errors.room_number.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Floor</label>
            <Input {...register('floor')} placeholder="Ground, 1st, 2nd..." />
          </div>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Room Type *</label>
          <Select {...register('room_type_id', { required: 'Required', valueAsNumber: true })}>
            <option value="">Select room type...</option>
            {roomTypes.map(t => (
              <option key={t.id} value={t.id}>{t.name} {t.short_code ? `(${t.short_code})` : ''}</option>
            ))}
          </Select>
          {errors.room_type_id && <p className="text-red-500 text-xs mt-1">{errors.room_type_id.message}</p>}
        </div>

        {/* Tariff + AC */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Override Tariff ₹/night</label>
            <Input type="number" {...register('current_tariff', { valueAsNumber: true, min: 0 })} placeholder="0 = use room type price" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Max Occupancy (override)</label>
            <Input type="number" {...register('max_occupancy')} placeholder="Leave blank = use type default" min={1} />
          </div>
        </div>

        {/* View + Bed + AC */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">View Type</label>
            <Select {...register('view_type')}>
              {VIEW_TYPES.map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Bed Type</label>
            <Select {...register('bed_type')}>
              {BED_TYPES.map(b => <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
            <Select {...register('status')}>
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </Select>
          </div>
        </div>

        {/* AC Toggle */}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_ac" {...register('is_ac')} className="w-4 h-4 accent-amber-500" />
          <label htmlFor="is_ac" className="text-sm text-slate-600 dark:text-slate-400">Air Conditioned Room</label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Notes</label>
          <textarea
            {...register('notes')}
            rows={2}
            placeholder="Any special notes about this room..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 text-sm text-slate-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
      </form>
    </Modal>
  );
}
