import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import HotelInvoiceLivePreview from '@/features/hotel/settings/components/HotelInvoiceLivePreview';
import { useHotelInvoiceSettings } from '@/features/hotel/settings/api/useHotelInvoiceSettings';

interface HotelPaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  payment: any;
}

export default function HotelPaymentReceiptModal({
  isOpen,
  onClose,
  booking,
  payment,
}: HotelPaymentReceiptModalProps) {
  const { data: settings } = useHotelInvoiceSettings();
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Receipt_${payment?.payment_number || payment?.id || 'payment'}_${booking?.booking_number || ''}`,
  });

  if (!isOpen || !payment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center justify-between w-full pr-8">
          <div>
            <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              💳 Payment Receipt Voucher
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Receipt #{payment.payment_number || `REC-${payment.id}`} • Booking {booking?.booking_number}
            </p>
          </div>
          <Button
            onClick={() => handlePrint()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 px-4 py-1.5 text-xs mr-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </Button>
        </div>
      }
    >
      {/* Live Printable Receipt Container */}
      <div className="p-4 sm:p-6 bg-slate-100 dark:bg-slate-950/60 flex justify-center overflow-y-auto max-h-[78vh] custom-scrollbar">
        <div
          ref={componentRef}
          className="w-full max-w-2xl print:max-w-none print:w-full print:m-0"
        >
          <HotelInvoiceLivePreview
            settings={settings}
            booking={booking}
            payment={payment}
            previewTab="receipt"
            isPrintView={true}
          />
        </div>
      </div>
    </Modal>
  );
}
