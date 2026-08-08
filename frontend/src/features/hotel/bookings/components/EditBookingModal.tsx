import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Edit3, BedDouble } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useHotelRooms } from '../../rooms/api/useHotelRooms';
import { useUpdateHotelBooking, useCancelHotelBooking } from '../api/useBookings';
import type { HotelBooking } from '../schemas/bookingSchema';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: HotelBooking | null;
}

export function EditBookingModal({ isOpen, onClose, booking }: EditBookingModalProps) {
  const updateBooking = useUpdateHotelBooking();
  const cancelBooking = useCancelHotelBooking();
  const { data: rooms = [] } = useHotelRooms();

  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm({
    defaultValues: {
      room_id: booking?.room_id || 0,
      check_in_date: booking?.check_in_date || '',
      check_out_date: booking?.check_out_date || '',
      adults: booking?.adults || 1,
      children: booking?.children || 0,
      room_rate_per_night: booking?.room_rate_per_night || 0,
      booking_source: booking?.booking_source || 'direct',
      status: booking?.status || 'confirmed',
      notes: booking?.notes || '',
      special_requests: booking?.special_requests || '',
    },
  });

  useEffect(() => {
    if (booking && isOpen) {
      reset({
        room_id: booking.room_id,
        check_in_date: typeof booking.check_in_date === 'string' ? booking.check_in_date.substring(0, 10) : '',
        check_out_date: typeof booking.check_out_date === 'string' ? booking.check_out_date.substring(0, 10) : '',
        adults: booking.adults,
        children: booking.children || 0,
        room_rate_per_night: booking.room_rate_per_night,
        booking_source: booking.booking_source || 'direct',
        status: booking.status,
        notes: booking.notes || '',
        special_requests: booking.special_requests || '',
      });
    }
  }, [booking, isOpen, reset]);

  if (!isOpen || !booking) return null;

  const onSubmit = async (data: any) => {
    try {
      await updateBooking.mutateAsync({
        id: booking.id!,
        data: {
          ...data,
          room_id: Number(data.room_id),
          adults: Number(data.adults),
          children: Number(data.children),
          room_rate_per_night: Number(data.room_rate_per_night),
        },
      });
      toast.success('Reservation updated successfully');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update reservation');
    }
  };

  const handleCancelReservation = async () => {
    if (!confirm(`Are you sure you want to cancel reservation ${booking.booking_number}?`)) return;
    try {
      await cancelBooking.mutateAsync(booking.id!);
      toast.success('Reservation cancelled');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Reservation — ${booking.booking_number}`}
      maxWidth="2xl"
      footer={
        <div className="flex justify-between w-full items-center">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleCancelReservation}
            disabled={isSubmitting || booking.status === 'cancelled'}
            className="font-bold rounded-xl"
          >
            Cancel Reservation
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button size="sm" form="edit-booking-form" type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-5">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      }
    >
      <form id="edit-booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Status & Room */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200/60 dark:border-white/5">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Booking Status</label>
            <Select {...register('status')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-bold">
              <option value="confirmed">Confirmed / Reserved</option>
              <option value="checked_in">Checked-In</option>
              <option value="checked_out">Checked-Out</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Room Selection</label>
            <Select {...register('room_id', { valueAsNumber: true })} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-medium">
              {rooms.map((r: any) => (
                <option key={r.id} value={r.id} disabled={r.status === 'occupied' && r.id !== booking.room_id}>
                  Room {r.room_number} - {r.roomType?.name} {r.id === booking.room_id ? '(Current)' : r.status === 'occupied' ? '(Occupied)' : ''}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Dates & Guests */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Check In</label>
            <Input type="date" {...register('check_in_date')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Check Out</label>
            <Input type="date" {...register('check_out_date')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Adults</label>
            <Input type="number" min="1" {...register('adults', { valueAsNumber: true })} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Children</label>
            <Input type="number" min="0" {...register('children', { valueAsNumber: true })} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
        </div>

        {/* Pricing & Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Room Rate / Night (₹)</label>
            <Input type="number" {...register('room_rate_per_night', { valueAsNumber: true })} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-bold" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Booking Source</label>
            <Select {...register('booking_source')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl">
              <option value="direct">Direct Walk-in</option>
              <option value="phone">Phone Booking</option>
              <option value="website">Website</option>
              <option value="ota">OTA (MMT, Agoda etc.)</option>
              <option value="corporate">Corporate</option>
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Notes / Special Requests</label>
          <Input {...register('notes')} placeholder="Additional notes..." className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
        </div>

      </form>
    </Modal>
  );
}
