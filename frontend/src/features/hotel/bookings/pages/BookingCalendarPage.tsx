import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageLoadingSkeleton } from '@/components/ui/PageLoadingSkeleton';
import { useHotelBookings } from '../api/useBookings';
import { useHotelRooms } from '../../rooms/api/useHotelRooms';
import { format, addDays, subDays, isWithinInterval, parseISO, startOfDay } from 'date-fns';
import type { HotelBooking } from '../schemas/bookingSchema';
import type { HotelRoom } from '../../rooms/schemas/roomSchema';
import { useNavigate } from 'react-router-dom';

export function BookingCalendarPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const daysToShow = 14;

  const dates = Array.from({ length: daysToShow }).map((_, i) => addDays(startDate, i));
  const endDate = addDays(startDate, daysToShow - 1);

  const { data: rooms = [], isLoading: isLoadingRooms } = useHotelRooms();

  // Need to fetch bookings that overlap with our date range
  const { data: bookingsResponse, isLoading: isLoadingBookings } = useHotelBookings();
  const allBookings: HotelBooking[] = bookingsResponse?.data || [];

  const handlePrev = () => setStartDate(subDays(startDate, 7));
  const handleNext = () => setStartDate(addDays(startDate, 7));
  const handleToday = () => setStartDate(startOfDay(new Date()));

  // Get booking for a specific room and date
  const getBooking = (roomId: number, date: Date) => {
    return allBookings.find(b => 
      b.room_id === roomId && 
      b.status !== 'cancelled' &&
      isWithinInterval(date, { 
        start: startOfDay(parseISO(b.check_in_date)), 
        end: startOfDay(parseISO(b.check_out_date)) 
      }) &&
      date.getTime() !== startOfDay(parseISO(b.check_out_date)).getTime() // Checkout day is empty for next check-in
    );
  };

  const isLoading = isLoadingRooms || isLoadingBookings;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Booking Calendar <span className="text-blue-600 dark:text-blue-400 text-base font-bold px-2 py-0.5 rounded-md bg-blue-500/10">14-Day View</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Visual timeline of room occupancy and availability.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shadow-inner border border-slate-200 dark:border-white/5">
              <Button variant="ghost" size="sm" onClick={handlePrev} className="rounded-lg h-8 px-2 hover:bg-white dark:hover:bg-slate-700"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" onClick={handleToday} className="rounded-lg h-8 px-4 font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700">Today</Button>
              <Button variant="ghost" size="sm" onClick={handleNext} className="rounded-lg h-8 px-2 hover:bg-white dark:hover:bg-slate-700"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="relative z-30">
          {isLoading ? (
            <div className="py-20 rounded-2xl overflow-hidden relative min-h-[400px]">
               <PageLoadingSkeleton />
            </div>
          ) : (
            <div className="bg-white/90 dark:bg-[#111118]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-600 dark:text-slate-300 w-48 sticky left-0 bg-slate-50 dark:bg-[#15151c] z-10 border-r border-slate-200/80 dark:border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_12px_rgba(0,0,0,0.2)]">
                      Room
                    </th>
                    {dates.map((date, i) => (
                      <th key={i} className="px-2 py-3 text-center border-l border-slate-200/50 dark:border-white/5 font-medium min-w-[90px]">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{format(date, 'EEE')}</div>
                        <div className={`font-black text-sm mt-0.5 ${format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-md py-0.5 mx-2' : 'text-slate-900 dark:text-white'}`}>
                          {format(date, 'dd MMM')}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {rooms.map(room => (
                    <tr key={room.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-3 font-semibold sticky left-0 bg-white dark:bg-[#111118] z-10 border-r border-slate-200/80 dark:border-white/10 group-hover:bg-slate-50/50 dark:group-hover:bg-[#15151c] transition-colors shadow-[4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_12px_rgba(0,0,0,0.2)]">
                        <div className="text-slate-900 dark:text-white font-bold">Room {room.room_number}</div>
                        <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">{room.room_type?.short_code}</div>
                      </td>
                      {dates.map((date, i) => {
                        const booking = getBooking(room.id!, date);
                        
                        return (
                          <td key={i} className="border-l border-slate-100 dark:border-white/5 p-1 min-w-[90px]">
                            {booking ? (
                              <div 
                                onClick={() => navigate(`/hotel/bookings/${booking.id}`)}
                                className={`h-11 rounded-lg flex items-center justify-center text-xs font-bold px-2 cursor-pointer truncate shadow-sm hover:scale-[1.02] transition-transform
                                  ${booking.status === 'checked_in' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/20' :
                                    booking.status === 'reserved' ? 'bg-orange-100 text-orange-700 border border-orange-200/50 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/20' :
                                    'bg-slate-100 text-slate-700 border border-slate-200/50 dark:bg-white/5 dark:text-slate-300 dark:border-white/10'}
                                `}
                                title={`${booking.guest?.name} (${booking.booking_number})`}
                              >
                                <span className="truncate">{booking.guest?.name}</span>
                              </div>
                            ) : (
                              <div className="h-11 w-full rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer">
                                {/* Future: Add + icon here to quickly open New Booking Modal for this room & date */}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
