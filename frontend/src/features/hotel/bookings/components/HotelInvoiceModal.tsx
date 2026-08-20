import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import HotelInvoiceLivePreview from '@/features/hotel/settings/components/HotelInvoiceLivePreview';
import { useHotelInvoiceSettings } from '@/features/hotel/settings/api/useHotelInvoiceSettings';

interface HotelInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function HotelInvoiceModal({
  isOpen,
  onClose,
  booking,
}: HotelInvoiceModalProps) {
  const { data: settings } = useHotelInvoiceSettings();
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Hotel_Invoice_${booking?.booking_number || 'booking'}`,
  });

  if (!isOpen || !booking) return null;

  const isPos = settings?.template === 'pos';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center justify-between w-full pr-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 dark:text-white">🏨 Hotel Folio Tax Invoice</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                {isPos ? 'POS 80mm' : 'A4 Format'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Folio #{booking.booking_number} • Guest: {booking.guest?.name || 'Guest'}
            </p>
          </div>
          <Button
            onClick={() => handlePrint()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 px-4 py-1.5 text-xs mr-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </Button>
        </div>
      }
    >
      {/* Live Printable Invoice Container */}
      <div className="p-4 sm:p-6 bg-slate-100 dark:bg-slate-950/60 flex justify-center overflow-y-auto max-h-[78vh] custom-scrollbar">
        <div
          ref={componentRef}
          className={`w-full ${isPos ? 'max-w-md' : 'max-w-3xl'} bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-xl print:p-0 print:shadow-none print:max-w-none print:w-full print:m-0`}
        >
          <HotelInvoiceLivePreview
            settings={settings}
            booking={booking}
            previewTab="invoice"
            isPrintView={true}
          />
        </div>
      </div>
    </Modal>
  );
}
