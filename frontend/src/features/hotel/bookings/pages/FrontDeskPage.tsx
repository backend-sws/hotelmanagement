import { useState } from 'react';
import { BedDouble, Users, Plus, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';
import { useHotelBookings } from '../api/useBookings';
import { NewBookingModal } from '../components/NewBookingModal';
import { format, parseISO } from 'date-fns';
import type { HotelBooking } from '../schemas/bookingSchema';
import { useNavigate } from 'react-router-dom';

export function FrontDeskPage() {
  const [isAddOpen, setAddOpen] = useState(false);
  const [filter, setFilter] = useState('active'); // active, reserved, checked_in, checked_out
  const navigate = useNavigate();

  const { data: response, isLoading } = useHotelBookings({ status: filter === 'active' ? 'active' : filter });
  const bookings: HotelBooking[] = Array.isArray(response?.data) ? response.data : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-cyan-500/10 dark:bg-cyan-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center">
                <Users className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Front Desk <span className="text-blue-600 dark:text-blue-400 text-base font-bold px-2 py-0.5 rounded-md bg-blue-500/10">Live Dashboard</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Manage arrivals, departures, walk-ins and active stays in real-time.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button onClick={() => navigate('/hotel/calendar')} variant="outline" className="rounded-xl font-bold bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 h-10">
              <Calendar className="w-4 h-4 mr-2" />
              Timeline
            </Button>
            <Button onClick={() => setAddOpen(true)} className="rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md shadow-blue-500/20 px-4 h-10 text-xs">
              <Plus className="w-4 h-4 mr-1.5" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="w-full flex flex-wrap gap-2 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          {[
            { id: 'active', label: 'All Active' },
            { id: 'reserved', label: 'Arrivals (Reserved)' },
            { id: 'checked_in', label: 'In-House' },
            { id: 'checked_out', label: 'Departures' },
          ].map(f => {
            const count = bookings.length; // You can filter the actual count if you fetch all, but here we just style it
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  filter === f.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-300'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        <div className="relative z-30">
          {isLoading ? (
            <div className="grid gap-4">
              <CardSkeleton count={5} />
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white/50 dark:bg-[#111118]/50 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-2xl p-16 text-center shadow-sm">
              <BedDouble className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-6 opacity-50" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No {filter} bookings found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Create a new reservation or check existing bookings.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  onClick={() => navigate(`/hotel/bookings/${booking.id}`)}
                  className="group bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500/50 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full md:w-[30%]">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl shadow-sm
                      ${booking.status === 'checked_in' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20' :
                        booking.status === 'reserved' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200/50 dark:border-orange-500/20' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-white/5'}`}
                    >
                      {booking.room?.room_number}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{booking.guest?.name}</h3>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 tracking-wide uppercase">{booking.booking_number}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-[40%] text-sm bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                        <ArrowRight className="w-3 h-3 text-emerald-500"/> In
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{format(parseISO(booking.check_in_date), 'dd MMM yyyy')}</div>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-700/50" />
                    <div className="text-right">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-end gap-1 mb-1">
                        Out <ArrowLeft className="w-3 h-3 text-rose-500"/>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{format(parseISO(booking.check_out_date), 'dd MMM yyyy')}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-[30%]">
                    <div className="text-right">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Balance</div>
                      <div className={`font-black text-xl ${booking.balance_due! > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        ₹{(booking.balance_due || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest shrink-0 uppercase
                      ${booking.status === 'checked_in' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                        booking.status === 'reserved' ? 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20' :
                        'bg-slate-50 text-slate-700 border border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10'}`}
                    >
                      {booking.status === 'checked_in' ? 'In-House' : booking.status === 'reserved' ? 'Arrival' : booking.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NewBookingModal
        isOpen={isAddOpen}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}
