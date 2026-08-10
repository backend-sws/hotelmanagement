import React from 'react';
import type { HotelBooking, HotelFolioCharge, HotelBookingPayment } from '../schemas/bookingSchema';
import { format, parseISO } from 'date-fns';

interface FolioPrintTemplateProps {
  booking: HotelBooking;
}

export function FolioPrintTemplate({ booking }: FolioPrintTemplateProps) {
  return (
    <div className="hidden print-only bg-white text-black p-8 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Guest Folio</h1>
          <p className="text-sm font-medium mt-1 uppercase">Tax Invoice / Bill of Supply</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">Booking #{booking.booking_number}</h2>
          <p className="text-sm mt-1">Date: {format(new Date(), 'dd MMM yyyy')}</p>
        </div>
      </div>

      {/* Guest & Stay Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold border-b border-black pb-1 mb-2">Guest Details</h3>
          <p className="font-semibold text-lg">{booking.guest?.first_name} {booking.guest?.last_name}</p>
          <p className="text-sm">{booking.guest?.email}</p>
          <p className="text-sm">{booking.guest?.phone}</p>
          {booking.guest?.address && <p className="text-sm">{booking.guest.address}</p>}
        </div>
        <div>
          <h3 className="font-bold border-b border-black pb-1 mb-2">Stay Details</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="py-0.5 font-semibold">Room No:</td><td className="text-right">{booking.room?.room_number}</td></tr>
              <tr><td className="py-0.5 font-semibold">Check-in:</td><td className="text-right">{format(parseISO(booking.check_in_date), 'dd MMM yyyy')}</td></tr>
              <tr><td className="py-0.5 font-semibold">Check-out:</td><td className="text-right">{format(parseISO(booking.check_out_date), 'dd MMM yyyy')}</td></tr>
              <tr><td className="py-0.5 font-semibold">Adults / Children:</td><td className="text-right">{booking.adults} / {booking.children}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Charges Table */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-3">Charges Summary</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-black px-3 py-2 text-left">Date</th>
              <th className="border border-black px-3 py-2 text-left">Description</th>
              <th className="border border-black px-3 py-2 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-3 py-2">{format(parseISO(booking.check_in_date), 'dd MMM yyyy')}</td>
              <td className="border border-black px-3 py-2">
                <strong>Room Rent</strong> ({booking.total_nights} nights @ ₹{booking.room_rate_per_night})
              </td>
              <td className="border border-black px-3 py-2 text-right font-bold">
                {(booking.total_room_charges || 0).toLocaleString()}
              </td>
            </tr>
            {booking.folio_charges?.map((charge: HotelFolioCharge) => (
              <tr key={charge.id}>
                <td className="border border-black px-3 py-2">{format(parseISO(charge.charge_date), 'dd MMM yyyy')}</td>
                <td className="border border-black px-3 py-2">
                  {charge.description} <span className="text-xs uppercase text-gray-600 ml-2">[{charge.charge_type.replace('_', ' ')}]</span>
                </td>
                <td className="border border-black px-3 py-2 text-right">
                  {(charge.grand_total || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={2} className="border border-black px-3 py-2 text-right font-bold">Grand Total</td>
              <td className="border border-black px-3 py-2 text-right font-bold text-lg">
                ₹{(booking.grand_total || 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payments Table */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-3">Payments Received</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-black px-3 py-2 text-left">Date</th>
              <th className="border border-black px-3 py-2 text-left">Mode</th>
              <th className="border border-black px-3 py-2 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {booking.payments?.length ? (
              booking.payments.map((payment: HotelBookingPayment) => (
                <tr key={payment.id}>
                  <td className="border border-black px-3 py-2">{format(new Date(payment.created_at!), 'dd MMM yyyy, HH:mm')}</td>
                  <td className="border border-black px-3 py-2 uppercase">{payment.payment_mode.replace('_', ' ')}</td>
                  <td className="border border-black px-3 py-2 text-right">{(payment.amount || 0).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="border border-black px-3 py-4 text-center italic text-gray-500">No payments recorded yet</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={2} className="border border-black px-3 py-2 text-right font-bold">Total Paid</td>
              <td className="border border-black px-3 py-2 text-right font-bold">
                ₹{(booking.amount_paid || 0).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="border-t-2 border-black border-l border-black px-3 py-2 text-right font-black text-lg">Balance Due</td>
              <td className="border-t-2 border-black border-r border-b border-black px-3 py-2 text-right font-black text-xl">
                ₹{(booking.balance_due || 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-sm border-t border-black pt-4">
        <p className="font-bold uppercase tracking-widest">Thank you for your stay!</p>
        <p className="text-xs text-gray-500 mt-2">This is a computer generated invoice and does not require a physical signature.</p>
      </div>
    </div>
  );
}
