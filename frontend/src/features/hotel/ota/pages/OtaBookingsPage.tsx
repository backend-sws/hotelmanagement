import React from 'react';
import { useHotelBookings } from '../../bookings/api/useBookings';
import { Calendar, User, Search, Link as LinkIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function OtaBookingsPage() {
  const navigate = useNavigate();

  const { data: bookingsData, isLoading } = useHotelBookings();
  const bookings = bookingsData?.data || [];

  // Filter out bookings that don't have an ota_channel_id or ota_booking_ref
  const otaBookings = bookings.filter((b: any) => b.ota_booking_ref || ['makemytrip', 'goibibo', 'agoda', 'booking_com', 'expedia', 'airbnb', 'ota'].includes(b.booking_source));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">OTA Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">Bookings received from MakeMyTrip, Agoda, Booking.com, etc.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex gap-4">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search OTA Ref or Guest..." className="pl-9 h-9" />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading bookings...</div>
        ) : otaBookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No OTA Bookings</h3>
            <p className="text-slate-500 mt-2">Bookings pushed via Channel Manager will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10">
                <tr>
                  <th className="px-4 py-3">OTA Ref / Source</th>
                  <th className="px-4 py-3">Guest Details</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {otaBookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5" />
                        {booking.ota_booking_ref || 'N/A'}
                      </div>
                      <div className="text-xs uppercase text-slate-500 font-bold mt-1 tracking-wider">
                        {booking.booking_source?.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">{booking.guest?.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{booking.guest?.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        {booking.check_in_date}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        to {booking.check_out_date} ({booking.total_nights} nights)
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                      {booking.room ? `Room ${booking.room.room_number}` : 'Unassigned'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      ₹{parseFloat(booking.total_amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider
                        ${booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                          booking.status === 'checked_in' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                          'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'}`}>
                        {booking.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs font-bold"
                        onClick={() => navigate(`/app/hotel/front-desk?booking=${booking.id}`)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
