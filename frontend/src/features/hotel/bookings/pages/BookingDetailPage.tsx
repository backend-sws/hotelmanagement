import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, BedDouble, Receipt, Calendar, CreditCard, Banknote, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHotelBooking, useCheckInBooking } from '../api/useBookings';
import { format, parseISO } from 'date-fns';
import { FolioManagerModal } from '../components/FolioManagerModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { CollectPaymentModal } from '../components/CollectPaymentModal';
import { EditBookingModal } from '../components/EditBookingModal';
import { FolioPrintTemplate } from '../components/FolioPrintTemplate';
import { PageLoadingSkeleton } from '@/components/ui/PageLoadingSkeleton';
import { toast } from 'sonner';

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading } = useHotelBooking(id ? parseInt(id) : null);
  const checkIn = useCheckInBooking();
  
  const [isFolioOpen, setFolioOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isCollectPaymentOpen, setCollectPaymentOpen] = useState(false);
  const [isEditBookingOpen, setEditBookingOpen] = useState(false);

  if (isLoading) return <PageLoadingSkeleton />;
  if (!booking) return <div className="p-8 text-center text-red-500">Booking not found</div>;

  const handleCheckIn = async () => {
    if (!confirm('Mark this reservation as Checked-in?')) return;
    try {
      await checkIn.mutateAsync(booking.id!);
      toast.success('Successfully checked in');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to check in');
    }
  };

  return (
    <>
      <FolioPrintTemplate booking={booking} />
      <div className="no-print min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
          
          {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/hotel/front-desk')} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black">{booking.booking_number}</h1>
                <div className={`px-3 py-0.5 rounded-full text-xs font-bold
                  ${booking.status === 'checked_in' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                    booking.status === 'reserved' || booking.status === 'confirmed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                    booking.status === 'checked_out' ? 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}
                >
                  {booking.status.toUpperCase().replace('_', ' ')}
                </div>
              </div>
              <p className="text-sm text-slate-500">Source: {booking.booking_source.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setEditBookingOpen(true)} className="rounded-xl font-bold">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Booking
            </Button>

            {(booking.balance_due || 0) > 0 && booking.status !== 'cancelled' && (
              <Button onClick={() => setCollectPaymentOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md rounded-xl">
                <CreditCard className="w-4 h-4 mr-2" />
                Collect Payment
              </Button>
            )}

            {(booking.status === 'reserved' || booking.status === 'confirmed') && (
              <Button onClick={handleCheckIn} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-xl font-bold">
                <ArrowLeft className="w-4 h-4 mr-2 rotate-90" />
                Check In Now
              </Button>
            )}

            {booking.status === 'checked_in' && (
              <>
                <Button variant="outline" onClick={() => setFolioOpen(true)} className="rounded-xl font-bold">
                  <Receipt className="w-4 h-4 mr-2" />
                  Add Charge
                </Button>
                <Button onClick={() => setCheckoutOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg rounded-xl font-bold">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Check Out
                </Button>
              </>
            )}
            {booking.status === 'checked_out' && (
              <Button variant="outline" onClick={() => window.print()} className="rounded-xl font-bold">
                <Receipt className="w-4 h-4 mr-2" />
                Print Invoice
              </Button>
            )}
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1: Guest & Room */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-500" />
                Guest Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-500 text-xs">Name</div>
                  <div className="font-bold text-base">{booking.guest?.name}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">Phone</div>
                  <div className="font-semibold">{booking.guest?.phone}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">ID Proof</div>
                  <div className="font-semibold uppercase">{booking.guest?.id_proof_type || 'N/A'} - {booking.guest?.id_proof_number}</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <BedDouble className="w-5 h-5 text-indigo-500" />
                Stay Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-slate-500 text-xs mb-0.5">Check In</div>
                  <div className="font-bold">{format(parseISO(booking.check_in_date), 'dd MMM yyyy')}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-0.5">Check Out</div>
                  <div className="font-bold">{format(parseISO(booking.check_out_date), 'dd MMM yyyy')}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm pt-4 border-t border-slate-100 dark:border-white/10">
                <div className="flex justify-between">
                  <span className="text-slate-500">Room</span>
                  <span className="font-bold">Room {booking.room?.room_number} ({booking.room?.room_type?.short_code})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Guests</span>
                  <span className="font-bold">{booking.adults} Adults, {booking.children} Kids</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-bold">{booking.total_nights} Nights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2 & 3: Financials & Folio */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Banknote className="w-5 h-5 text-emerald-500" />
                Billing Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                  <div className="text-slate-500 text-xs font-semibold mb-1">Room Charges</div>
                  <div className="text-lg font-bold">₹{(booking.total_room_charges || 0).toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                  <div className="text-slate-500 text-xs font-semibold mb-1">Extra/Folio</div>
                  <div className="text-lg font-bold">₹{(booking.total_extra_charges || 0).toLocaleString()}</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <div className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-1">Total Paid</div>
                  <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">₹{(booking.amount_paid || 0).toLocaleString()}</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                  <div className="text-red-700 dark:text-red-400 text-xs font-semibold mb-1">Balance Due</div>
                  <div className="text-lg font-bold text-red-700 dark:text-red-400">₹{(booking.balance_due || 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Folio Table */}
              <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Date</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Description</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    <tr>
                      <td className="px-4 py-3 text-slate-500">{format(parseISO(booking.check_in_date), 'dd MMM')}</td>
                      <td className="px-4 py-3 font-semibold">
                        Room Rent ({booking.total_nights} nights @ ₹{booking.room_rate_per_night})
                      </td>
                      <td className="px-4 py-3 font-bold text-right text-slate-900 dark:text-white">
                        ₹{(booking.total_room_charges || 0).toLocaleString()}
                      </td>
                    </tr>
                    {booking.folio_charges?.map(charge => (
                      <tr key={charge.id}>
                        <td className="px-4 py-3 text-slate-500">{format(parseISO(charge.charge_date), 'dd MMM')}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">{charge.description}</span>
                          <span className="block text-xs text-slate-500 uppercase">{charge.charge_type.replace('_', ' ')}</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-right text-slate-900 dark:text-white">
                          ₹{(charge.grand_total || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {booking.folio_charges?.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">No extra charges added</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-purple-500" />
                Payment Receipts
              </h3>
              <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Date</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Mode</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Notes</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {booking.payments?.map(payment => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 text-slate-500">{format(new Date(payment.created_at!), 'dd MMM, HH:mm')}</td>
                        <td className="px-4 py-3 font-semibold uppercase text-xs">{payment.payment_mode}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{payment.notes || '-'}</td>
                        <td className="px-4 py-3 font-bold text-right text-emerald-600 dark:text-emerald-400">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {booking.payments?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">No payments recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

      <FolioManagerModal
        isOpen={isFolioOpen}
        onClose={() => setFolioOpen(false)}
        bookingId={booking.id!}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        booking={booking}
      />

      <CollectPaymentModal
        isOpen={isCollectPaymentOpen}
        onClose={() => setCollectPaymentOpen(false)}
        booking={booking}
      />

      <EditBookingModal
        isOpen={isEditBookingOpen}
        onClose={() => setEditBookingOpen(false)}
        booking={booking}
      />
      </div>
    </>
  );
}
