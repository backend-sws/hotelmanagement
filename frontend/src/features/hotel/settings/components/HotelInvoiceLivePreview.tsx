import React from 'react';
import type { HotelInvoiceSettings } from '../api/useHotelInvoiceSettings';
import { useTenantStore } from '@/store/tenantStore';
import { numberToIndianWords } from '@/lib/formatters';
import QRCode from 'react-qr-code';
import { format, parseISO } from 'date-fns';

export interface HotelInvoiceLivePreviewProps {
  settings?: HotelInvoiceSettings;
  business?: any;
  booking?: any;
  payment?: any;
  kotData?: any;
  previewTab?: 'invoice' | 'receipt' | 'kot';
  isPrintView?: boolean;
}

export default function HotelInvoiceLivePreview({
  settings: propSettings,
  business: propBusiness,
  booking: propBooking,
  payment: propPayment,
  kotData: propKotData,
  previewTab = 'invoice',
  isPrintView = false,
}: HotelInvoiceLivePreviewProps) {
  const { activeBusiness } = useTenantStore();

  const defaultSettings: HotelInvoiceSettings = {
    template: 'default',
    receipt_template: 'voucher',
    signature_label: 'Hotel Manager / Front Desk',
    default_terms: "1. Standard Check-In time is 12:00 PM & Check-Out time is 11:00 AM.\n2. Valid government photo ID is mandatory at the time of check-in.\n3. Goods once billed will not be refunded.\n4. Subject to local jurisdiction.",
    check_in_time: '12:00 PM',
    check_out_time: '11:00 AM',
    default_bank_details: '',
    upi_id: '',
    fields: {
      show_logo: true,
      logo_size: 50,
      show_gstin: true,
      show_stay_dates: true,
      show_guest_id_proof: true,
      show_room_details: true,
      show_folio_breakdown: true,
      show_tax_breakdown: true,
      show_payment_breakdown: true,
      show_amount_in_words: true,
      show_qr_code: true,
      show_terms: true,
      show_signature: true,
      show_receiver_signature: false,
    },
    styles: {
      primary_color: '#1e293b',
      secondary_color: '#64748b',
      border_color: '#e2e8f0',
      font_size: 12,
      font_family: 'Inter',
      line_spacing: 1.4,
      margin_top: 10,
      margin_bottom: 10,
      margin_left: 10,
      margin_right: 10,
      border_radius: 6,
      frame_style: 'none',
    },
    kot_settings: {
      show_restaurant_name: true,
      show_server_name: true,
      show_special_instructions: true,
      font_size: 12,
    },
  };

  const settings: HotelInvoiceSettings = {
    ...defaultSettings,
    ...(propSettings || {}),
    fields: { ...defaultSettings.fields, ...(propSettings?.fields || {}) },
    styles: { ...defaultSettings.styles, ...(propSettings?.styles || {}) },
    kot_settings: { ...defaultSettings.kot_settings, ...(propSettings?.kot_settings || {}) },
  };

  const business = propBusiness || {
    name: activeBusiness?.name || 'Grand Palace Hotel & Suites',
    address: activeBusiness?.address || '101 Marine Drive, Nariman Point, Mumbai 400021',
    phone: activeBusiness?.phone || '+91 98765 43210',
    email: activeBusiness?.email || 'reservations@grandpalace.com',
    gstin: activeBusiness?.gst_number || '27AABCG1234F1Z5',
    logo: activeBusiness?.logo_path ? `/storage/${activeBusiness.logo_path}` : null,
  };

  // Sample Booking fallback data
  const sampleBooking = {
    id: 101,
    booking_number: 'BK-20260808-0001',
    created_at: '2026-08-08T10:30:00Z',
    status: 'checked_out',
    booking_source: 'DIRECT',
    guest: {
      name: 'Ramesh Sharma',
      phone: '+91 98200 12345',
      email: 'ramesh.sharma@example.com',
      id_proof_type: 'AADHAAR',
      id_proof_number: 'XXXX-XXXX-9876',
      address: 'B-402, Sunshine Heights, Andheri East, Mumbai',
      gstin: '',
    },
    room: {
      room_number: '101',
      room_type: { name: 'Deluxe Suite' },
    },
    check_in_date: '2026-08-08',
    check_out_date: '2026-08-10',
    total_nights: 2,
    adults: 2,
    children: 1,
    room_rate_per_night: 2500,
    total_room_charges: 5000,
    total_folio_charges: 850,
    taxable_amount: 5850,
    tax_amount: 702,
    cgst_amount: 351,
    sgst_amount: 351,
    igst_amount: 0,
    discount_amount: 0,
    grand_total: 6552,
    paid_amount: 6552,
    balance_due: 0,
    folio_charges: [
      { id: 1, charge_date: '2026-08-08', charge_type: 'restaurant', description: 'Dinner Buffet - Room Service', quantity: 2, unit_price: 350, grand_total: 700 },
      { id: 2, charge_date: '2026-08-09', charge_type: 'laundry', description: 'Express Laundry Service', quantity: 1, unit_price: 150, grand_total: 150 },
    ],
    payments: [
      { id: 1, payment_number: 'REC-001', created_at: '2026-08-08T10:45:00Z', payment_mode: 'UPI', amount: 2000, notes: 'Advance Booking Deposit' },
      { id: 2, payment_number: 'REC-002', created_at: '2026-08-10T11:00:00Z', payment_mode: 'CARD', amount: 4552, notes: 'Checkout Settlement Payment' },
    ],
  };

  const booking = propBooking || sampleBooking;
  const guest = booking.guest || { name: 'Walk-in Guest', phone: '', id_proof_type: '', id_proof_number: '', address: '' };
  const room = booking.room || { room_number: '101', room_type: { name: 'Standard' } };

  // Sample KOT Data
  const sampleKot = {
    order_number: 'KOT-20260808-012',
    created_at: new Date().toISOString(),
    order_type: 'room_service',
    table_id: null,
    room_number: room.room_number || '101',
    server_name: 'Rahul (Captain)',
    guest_name: guest.name,
    special_instructions: 'Less spicy, serve extra lemons and mint chutney',
    items: [
      { name: 'Paneer Butter Masala', qty: 2, notes: 'Medium spicy' },
      { name: 'Butter Naan', qty: 4, notes: 'Crispy' },
      { name: 'Jeera Rice', qty: 1, notes: '' },
      { name: 'Sweet Lassi', qty: 2, notes: 'Well chilled' },
    ],
  };
  const kotData = propKotData || sampleKot;

  // Payment for receipt
  const activePayment = propPayment || (booking.payments && booking.payments.length > 0 ? booking.payments[0] : {
    id: 1,
    payment_number: 'REC-001',
    created_at: new Date().toISOString(),
    payment_mode: 'UPI',
    amount: 2000,
    notes: 'Advance Booking Deposit',
  });

  // ── Derived style tokens ──
  const pc = settings.styles.primary_color || '#1e293b';
  const sc = settings.styles.secondary_color || '#64748b';
  const bc = settings.styles.border_color || '#e2e8f0';
  const br = settings.styles.border_radius ?? 6;
  const fs = settings.styles.font_size || 12;
  const ff = `'${settings.styles.font_family || 'Inter'}', system-ui, -apple-system, sans-serif`;
  const ls = settings.styles.line_spacing || 1.4;
  const mt = settings.styles.margin_top || 10;
  const mb = settings.styles.margin_bottom || 10;
  const ml = settings.styles.margin_left || 10;
  const mr = settings.styles.margin_right || 10;
  const frameStyle = settings.styles.frame_style || 'none';

  // Frame border
  const frameBorder = frameStyle === 'none' ? 'none'
    : frameStyle === 'elegant' ? `3px double ${pc}`
    : `2px ${frameStyle} ${pc}`;

  // Helper date formatter
  const fmtDate = (dStr: string | null | undefined, fmt = 'dd MMM yyyy') => {
    if (!dStr) return '-';
    try {
      return format(parseISO(dStr), fmt);
    } catch {
      try { return format(new Date(dStr), fmt); } catch { return String(dStr); }
    }
  };

  // ── Shared sub-sections ──

  const renderLogo = (align: 'left' | 'center' = 'left') => (
    settings.fields.show_logo && business.logo ? (
      <img
        src={business.logo}
        style={{
          maxHeight: `${settings.fields.logo_size || 50}px`,
          marginBottom: '8px',
          objectFit: 'contain',
          display: align === 'center' ? 'block' : 'inline-block',
          margin: align === 'center' ? '0 auto 8px auto' : undefined
        }}
        alt="Logo"
      />
    ) : null
  );

  const renderGstinLine = (color = pc, size = fs - 1) => (
    settings.fields.show_gstin && business.gstin ? (
      <p style={{ margin: '2px 0 0 0', fontSize: `${size}px`, fontWeight: '700', color }}>GSTIN: {business.gstin}</p>
    ) : null
  );

  const renderGuestBox = (bgColor = '#f8fafc', titleColor = pc) => (
    <div style={{ flex: 1, border: `1px solid ${bc}`, borderRadius: `${br}px`, padding: '10px 14px', backgroundColor: bgColor }}>
      <p style={{ margin: '0 0 6px 0', fontSize: `${fs - 1}px`, fontWeight: 'bold', color: titleColor, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${bc}`, paddingBottom: '4px' }}>
        Guest Information
      </p>
      <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', fontSize: `${fs + 1}px` }}>{guest.name}</p>
      {guest.phone && <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 1}px`, color: '#475569' }}>Phone: {guest.phone}</p>}
      {guest.address && <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 1}px`, color: '#475569' }}>Address: {guest.address}</p>}
      {settings.fields.show_guest_id_proof && guest.id_proof_number && (
        <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 1}px`, color: '#475569' }}>
          ID: <span style={{ fontWeight: '600' }}>{guest.id_proof_type || 'ID'}: {guest.id_proof_number}</span>
        </p>
      )}
      {guest.gstin && <p style={{ margin: 0, fontSize: `${fs - 1}px`, fontWeight: 'bold', color: pc }}>GSTIN: {guest.gstin}</p>}
    </div>
  );

  const renderStayBox = (bgColor = '#f8fafc', titleColor = pc) => (
    <div style={{ flex: 1, border: `1px solid ${bc}`, borderRadius: `${br}px`, padding: '10px 14px', backgroundColor: bgColor }}>
      <p style={{ margin: '0 0 6px 0', fontSize: `${fs - 1}px`, fontWeight: 'bold', color: titleColor, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${bc}`, paddingBottom: '4px' }}>
        Stay Details
      </p>
      {settings.fields.show_room_details && (
        <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', fontSize: `${fs}px` }}>
          Room: {room.room_number} <span style={{ fontWeight: 'normal', color: '#64748b' }}>({room.room_type?.name || 'Room'})</span>
        </p>
      )}
      {settings.fields.show_stay_dates && (
        <>
          <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 1}px`, color: '#475569' }}>
            <strong>Check-In:</strong> {fmtDate(booking.check_in_date)} ({settings.check_in_time})
          </p>
          <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 1}px`, color: '#475569' }}>
            <strong>Check-Out:</strong> {fmtDate(booking.check_out_date)} ({settings.check_out_time})
          </p>
        </>
      )}
      <p style={{ margin: 0, fontSize: `${fs - 1}px`, color: '#475569' }}>
        <strong>Duration:</strong> {booking.total_nights || 1} Night(s) | {booking.adults || 1} Adult(s), {booking.children || 0} Kid(s)
      </p>
    </div>
  );

  const renderFolioTable = (headerBg = pc, headerColor = '#fff') => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', border: `1px solid ${bc}` }}>
      <thead>
        <tr style={{ backgroundColor: headerBg, color: headerColor }}>
          <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: `${fs}px`, fontWeight: 'bold' }}>#</th>
          <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: `${fs}px`, fontWeight: 'bold' }}>Particulars / Description</th>
          <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: `${fs}px`, fontWeight: 'bold' }}>Date</th>
          <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: `${fs}px`, fontWeight: 'bold' }}>Qty / Nights</th>
          <th style={{ padding: '8px 10px', textAlign: 'right', fontSize: `${fs}px`, fontWeight: 'bold' }}>Rate (₹)</th>
          <th style={{ padding: '8px 10px', textAlign: 'right', fontSize: `${fs}px`, fontWeight: 'bold' }}>Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        {/* Room Rent */}
        <tr style={{ borderBottom: `1px solid ${bc}` }}>
          <td style={{ padding: '8px 10px', fontSize: `${fs}px` }}>1</td>
          <td style={{ padding: '8px 10px', fontSize: `${fs}px`, fontWeight: '600' }}>
            Room Stay Charges - Room {room.room_number} ({room.room_type?.name})
          </td>
          <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: `${fs - 1}px`, color: '#64748b' }}>
            {fmtDate(booking.check_in_date, 'dd MMM')} - {fmtDate(booking.check_out_date, 'dd MMM')}
          </td>
          <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: `${fs}px` }}>{booking.total_nights}</td>
          <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: `${fs}px` }}>{Number(booking.room_rate_per_night || 0).toFixed(2)}</td>
          <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: `${fs}px`, fontWeight: 'bold' }}>
            {Number(booking.total_room_charges || 0).toFixed(2)}
          </td>
        </tr>

        {/* Folio Extra Charges */}
        {settings.fields.show_folio_breakdown && booking.folio_charges?.map((f: any, idx: number) => (
          <tr key={f.id || idx} style={{ borderBottom: `1px solid ${bc}`, backgroundColor: idx % 2 === 0 ? '#fcfcfc' : '#ffffff' }}>
            <td style={{ padding: '8px 10px', fontSize: `${fs}px` }}>{idx + 2}</td>
            <td style={{ padding: '8px 10px', fontSize: `${fs}px` }}>
              <span style={{ fontWeight: '600' }}>{f.description}</span>
              <span style={{ display: 'block', fontSize: `${Math.max(fs - 3, 9)}px`, color: '#64748b', textTransform: 'uppercase' }}>
                {f.charge_type?.replace('_', ' ')}
              </span>
            </td>
            <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: `${fs - 1}px`, color: '#64748b' }}>
              {fmtDate(f.charge_date, 'dd MMM')}
            </td>
            <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: `${fs}px` }}>{f.quantity || 1}</td>
            <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: `${fs}px` }}>{Number(f.unit_price || f.grand_total || 0).toFixed(2)}</td>
            <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: `${fs}px`, fontWeight: 'bold' }}>
              {Number(f.grand_total || 0).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPaymentsBreakdown = () => (
    settings.fields.show_payment_breakdown && booking.payments && booking.payments.length > 0 ? (
      <div style={{ border: `1px solid ${bc}`, borderRadius: `${br}px`, padding: '10px 12px', marginBottom: '12px', backgroundColor: '#fcfcfc' }}>
        <p style={{ margin: '0 0 6px 0', fontSize: `${fs - 1}px`, fontWeight: 'bold', color: pc, textTransform: 'uppercase' }}>
          Payment Receipts History
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${fs - 1.5}px` }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${bc}`, color: '#64748b' }}>
              <th style={{ textAlign: 'left', padding: '3px 0' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '3px 4px' }}>Receipt / Mode</th>
              <th style={{ textAlign: 'left', padding: '3px 4px' }}>Notes</th>
              <th style={{ textAlign: 'right', padding: '3px 0' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {booking.payments.map((p: any, pIdx: number) => (
              <tr key={p.id || pIdx} style={{ borderBottom: '1px dotted #e2e8f0' }}>
                <td style={{ padding: '4px 0' }}>{fmtDate(p.created_at, 'dd MMM, HH:mm')}</td>
                <td style={{ padding: '4px 4px', fontWeight: '600' }}>{p.payment_mode}</td>
                <td style={{ padding: '4px 4px', color: '#64748b' }}>{p.notes || '-'}</td>
                <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 'bold', color: '#059669' }}>₹ {Number(p.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null
  );

  const renderTotalsCard = (bgColor = '#f8fafc') => (
    <div style={{ width: '280px', border: `1px solid ${bc}`, borderRadius: `${br}px`, padding: '12px 14px', backgroundColor: bgColor }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: `${fs}px` }}>
        <span style={{ color: '#475569' }}>Room Charges:</span>
        <span style={{ fontWeight: '600' }}>₹ {Number(booking.total_room_charges || 0).toFixed(2)}</span>
      </div>

      {Number(booking.total_folio_charges || 0) > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: `${fs}px` }}>
          <span style={{ color: '#475569' }}>Extra / Folio Charges:</span>
          <span style={{ fontWeight: '600' }}>₹ {Number(booking.total_folio_charges || 0).toFixed(2)}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: `${fs}px`, borderTop: `1px solid ${bc}`, marginTop: '4px', paddingTop: '4px' }}>
        <span style={{ color: '#475569' }}>Subtotal (Taxable):</span>
        <span style={{ fontWeight: '600' }}>₹ {Number(booking.taxable_amount || (Number(booking.total_room_charges || 0) + Number(booking.total_folio_charges || 0))).toFixed(2)}</span>
      </div>

      {settings.fields.show_tax_breakdown && (
        <>
          {Number(booking.cgst_amount || 0) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: `${fs - 1}px`, color: '#64748b' }}>
              <span>CGST:</span><span>₹ {Number(booking.cgst_amount).toFixed(2)}</span>
            </div>
          )}
          {Number(booking.sgst_amount || 0) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: `${fs - 1}px`, color: '#64748b' }}>
              <span>SGST:</span><span>₹ {Number(booking.sgst_amount).toFixed(2)}</span>
            </div>
          )}
          {Number(booking.igst_amount || 0) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: `${fs - 1}px`, color: '#64748b' }}>
              <span>IGST:</span><span>₹ {Number(booking.igst_amount).toFixed(2)}</span>
            </div>
          )}
        </>
      )}

      {Number(booking.discount_amount || 0) > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: `${fs}px`, color: '#dc2626' }}>
          <span>Discount:</span><span>- ₹ {Number(booking.discount_amount).toFixed(2)}</span>
        </div>
      )}

      {/* Grand Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `2px solid ${pc}`, borderBottom: `2px solid ${pc}`, margin: '8px 0', color: pc }}>
        <span style={{ fontWeight: '900', fontSize: `${fs + 2}px` }}>GRAND TOTAL:</span>
        <span style={{ fontWeight: '900', fontSize: `${fs + 3}px` }}>₹ {Number(booking.grand_total || 0).toFixed(2)}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: `${fs}px` }}>
        <span style={{ color: '#475569' }}>Total Paid:</span>
        <span style={{ fontWeight: 'bold', color: '#059669' }}>₹ {Number(booking.paid_amount || 0).toFixed(2)}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: `${fs}px`, color: Number(booking.balance_due || 0) > 0 ? '#dc2626' : '#475569' }}>
        <span style={{ fontWeight: 'bold' }}>Balance Due:</span>
        <span style={{ fontWeight: 'bold' }}>₹ {Number(booking.balance_due || 0).toFixed(2)}</span>
      </div>
    </div>
  );

  const renderBankDetails = () => (
    (settings.default_bank_details || settings.upi_id) ? (
      <div style={{ fontSize: `${fs - 2}px`, color: '#64748b', borderTop: `1px dotted ${bc}`, paddingTop: '6px', marginTop: '6px' }}>
        {settings.upi_id && <div style={{ marginBottom: '2px' }}><strong>UPI ID:</strong> {settings.upi_id}</div>}
        {settings.default_bank_details && <div style={{ whiteSpace: 'pre-wrap' }}>{settings.default_bank_details}</div>}
      </div>
    ) : null
  );

  const renderAmountInWords = () => (
    settings.fields.show_amount_in_words ? (
      <div style={{ marginBottom: '10px' }}>
        <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 2}px`, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Amount in Words:</p>
        <p style={{ margin: 0, fontSize: `${fs}px`, fontWeight: '600', textTransform: 'capitalize', color: pc }}>
          INR {numberToIndianWords(booking.grand_total || 0)}
        </p>
      </div>
    ) : null
  );

  const renderQrCode = () => (
    settings.fields.show_qr_code ? (
      <div style={{ textAlign: 'center', padding: '0 15px' }}>
        <div style={{ display: 'inline-block', padding: '4px', backgroundColor: '#fff', border: `1px solid ${bc}`, borderRadius: '4px' }}>
          <QRCode value={`${window.location.origin}/hotel/front-desk?booking=${booking.booking_number}`} size={85} level="M" />
        </div>
        <p style={{ margin: '3px 0 0 0', fontSize: `${Math.max(fs - 3, 8)}px`, fontWeight: 'bold', color: '#64748b' }}>Scan to Verify</p>
      </div>
    ) : null
  );

  const renderSignature = (labelColor = pc) => (
    settings.fields.show_signature ? (
      <div style={{ textAlign: 'right', minWidth: '180px' }}>
        <div style={{ height: '45px', borderBottom: `1px solid ${pc}60`, width: '150px', marginLeft: 'auto', marginBottom: '4px' }} />
        <p style={{ margin: 0, fontSize: `${fs}px`, fontWeight: 'bold', color: labelColor }}>
          {settings.signature_label || 'Hotel Manager / Front Desk'}
        </p>
        <p style={{ margin: 0, fontSize: `${fs - 2}px`, color: '#64748b' }}>For {business.name}</p>
      </div>
    ) : null
  );

  // Wrapper for A4 Invoices
  const wrapContent = (children: React.ReactNode) => (
    <div style={{
      fontFamily: ff,
      fontSize: `${fs}px`,
      lineHeight: ls,
      color: '#111827',
      padding: isPrintView ? `${mt}px ${mr}px ${mb}px ${ml}px` : '4px',
      border: frameBorder,
      borderRadius: frameStyle !== 'none' ? `${br}px` : undefined,
    }}>
      {children}
    </div>
  );


  // ═════════════════════════════════════════════════════════════════════════════
  // 1A) DEFAULT — Balanced structured hotel billing layout
  // ═════════════════════════════════════════════════════════════════════════════
  const renderDefaultInvoice = () => wrapContent(
    <>
      {/* Header */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
        <tbody>
          <tr>
            <td style={{ width: '55%', verticalAlign: 'top' }}>
              {renderLogo()}
              <h2 style={{ margin: '0 0 3px 0', fontSize: `${fs + 6}px`, fontWeight: 'bold', color: pc, textTransform: 'uppercase' }}>
                {business.name}
              </h2>
              <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 1}px`, color: '#475569' }}>{business.address}</p>
              <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 1}px`, color: '#475569' }}>Ph: {business.phone} | Email: {business.email}</p>
              {renderGstinLine()}
            </td>
            <td style={{ width: '45%', verticalAlign: 'top', textAlign: 'right' }}>
              <div style={{ display: 'inline-block', textAlign: 'right' }}>
                <h1 style={{ margin: '0 0 4px 0', fontSize: `${fs + 8}px`, fontWeight: '900', color: pc, letterSpacing: '0.5px' }}>
                  TAX INVOICE / FOLIO
                </h1>
                <p style={{ margin: '0 0 2px 0', fontSize: `${fs + 1}px`, fontWeight: 'bold' }}>
                  Folio #: <span style={{ color: pc }}>{booking.booking_number}</span>
                </p>
                <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 1}px`, color: '#64748b' }}>
                  Date: {fmtDate(booking.created_at || new Date().toISOString(), 'dd MMM yyyy, HH:mm')}
                </p>
                <p style={{ margin: 0, fontSize: `${fs - 1}px`, color: '#64748b' }}>
                  Status: <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: booking.status === 'checked_out' ? '#059669' : '#d97706' }}>{booking.status?.replace('_', ' ')}</span>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Guest & Stay Details Boxes */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {renderGuestBox()}
        {renderStayBox()}
      </div>

      {renderFolioTable()}

      {/* Summary & Payments */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          {renderPaymentsBreakdown()}
          {renderAmountInWords()}
          {renderBankDetails()}
        </div>
        {renderTotalsCard()}
      </div>

      {/* Footer: Terms, QR, Signature */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${bc}`, paddingTop: '15px' }}>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          {settings.fields.show_terms && settings.default_terms && (
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: `${fs - 2}px`, fontWeight: 'bold', color: pc, textTransform: 'uppercase' }}>Terms & Hotel Policies:</p>
              <p style={{ margin: 0, fontSize: `${fs - 2.5}px`, color: '#64748b', whiteSpace: 'pre-wrap', lineHeight: 1.35 }}>{settings.default_terms}</p>
            </div>
          )}
        </div>
        {renderQrCode()}
        {renderSignature()}
      </div>
    </>
  );


  // ═════════════════════════════════════════════════════════════════════════════
  // 1B) MODERN — Minimalist clean with accent color stripe
  // ═════════════════════════════════════════════════════════════════════════════
  const renderModernInvoice = () => wrapContent(
    <>
      {/* Accent top stripe */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${pc}, ${pc}80)`, borderRadius: '4px 4px 0 0', marginBottom: '18px' }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          {renderLogo()}
          <h2 style={{ margin: '0 0 4px 0', fontSize: `${fs + 5}px`, fontWeight: '800', color: pc, letterSpacing: '-0.3px' }}>{business.name}</h2>
          <p style={{ margin: '0 0 1px 0', fontSize: `${fs - 1}px`, color: sc }}>{business.address}</p>
          <p style={{ margin: '0 0 1px 0', fontSize: `${fs - 1}px`, color: sc }}>Ph: {business.phone}</p>
          {renderGstinLine(sc)}
        </div>
        <div style={{ textAlign: 'right', padding: '12px 16px', backgroundColor: `${pc}08`, borderRadius: `${br}px`, border: `1px solid ${pc}20` }}>
          <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 2}px`, fontWeight: '700', color: sc, textTransform: 'uppercase', letterSpacing: '1px' }}>Tax Invoice</p>
          <p style={{ margin: '0 0 4px 0', fontSize: `${fs + 4}px`, fontWeight: '900', color: pc }}>{booking.booking_number}</p>
          <p style={{ margin: 0, fontSize: `${fs - 1}px`, color: sc }}>
            {fmtDate(booking.created_at || new Date().toISOString(), 'dd MMM yyyy')}
          </p>
        </div>
      </div>

      {/* Guest & Stay */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
        <div style={{ flex: 1, borderLeft: `3px solid ${pc}`, paddingLeft: '12px' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: `${fs - 1}px`, fontWeight: 'bold', color: pc, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Guest</p>
          <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', fontSize: `${fs + 1}px` }}>{guest.name}</p>
          {guest.phone && <p style={{ margin: '0 0 1px 0', fontSize: `${fs - 1}px`, color: sc }}>{guest.phone}</p>}
          {settings.fields.show_guest_id_proof && guest.id_proof_number && (
            <p style={{ margin: 0, fontSize: `${fs - 1}px`, color: sc }}>{guest.id_proof_type}: {guest.id_proof_number}</p>
          )}
        </div>
        <div style={{ flex: 1, borderLeft: `3px solid ${pc}40`, paddingLeft: '12px' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: `${fs - 1}px`, fontWeight: 'bold', color: pc, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stay</p>
          {settings.fields.show_room_details && <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', fontSize: `${fs}px` }}>Room {room.room_number} — {room.room_type?.name}</p>}
          {settings.fields.show_stay_dates && (
            <p style={{ margin: '0 0 1px 0', fontSize: `${fs - 1}px`, color: sc }}>
              {fmtDate(booking.check_in_date)} → {fmtDate(booking.check_out_date)} ({booking.total_nights}N)
            </p>
          )}
          <p style={{ margin: 0, fontSize: `${fs - 1}px`, color: sc }}>{booking.adults || 1} Adults, {booking.children || 0} Children</p>
        </div>
      </div>

      {renderFolioTable(`${pc}10`, pc)}

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          {renderPaymentsBreakdown()}
          {renderAmountInWords()}
          {renderBankDetails()}
        </div>
        {renderTotalsCard(`${pc}06`)}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${bc}`, paddingTop: '14px' }}>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          {settings.fields.show_terms && settings.default_terms && (
            <p style={{ margin: 0, fontSize: `${fs - 2.5}px`, color: sc, whiteSpace: 'pre-wrap', lineHeight: 1.35 }}>{settings.default_terms}</p>
          )}
        </div>
        {renderQrCode()}
        {renderSignature()}
      </div>

      {/* Bottom accent */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${pc}80, ${pc})`, borderRadius: '0 0 4px 4px', marginTop: '14px' }} />
    </>
  );


  // ═════════════════════════════════════════════════════════════════════════════
  // 1C) CLASSIC — Traditional boxed ledger with double-border header
  // ═════════════════════════════════════════════════════════════════════════════
  const renderClassicInvoice = () => wrapContent(
    <>
      {/* Double-bordered header band */}
      <div style={{ border: `3px double ${pc}`, padding: '14px 16px', marginBottom: '16px', textAlign: 'center' }}>
        {renderLogo('center')}
        <h1 style={{ margin: '0 0 2px 0', fontSize: `${fs + 8}px`, fontWeight: '900', color: pc, textTransform: 'uppercase', letterSpacing: '2px' }}>
          {business.name}
        </h1>
        <p style={{ margin: '0 0 1px 0', fontSize: `${fs - 1}px`, color: '#475569' }}>{business.address}</p>
        <p style={{ margin: '0 0 1px 0', fontSize: `${fs - 1}px`, color: '#475569' }}>Ph: {business.phone} | Email: {business.email}</p>
        {renderGstinLine(pc, fs)}
        <div style={{ marginTop: '8px', padding: '4px 0', borderTop: `1px solid ${bc}`, borderBottom: `1px solid ${bc}` }}>
          <span style={{ fontSize: `${fs + 2}px`, fontWeight: '900', letterSpacing: '3px', color: pc, textTransform: 'uppercase' }}>
            Hotel Folio / Tax Invoice
          </span>
        </div>
      </div>

      {/* Invoice meta line */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${fs}px`, marginBottom: '14px', padding: '6px 10px', backgroundColor: '#f1f5f9', borderRadius: `${br}px`, border: `1px solid ${bc}` }}>
        <span><strong>Folio No:</strong> {booking.booking_number}</span>
        <span><strong>Date:</strong> {fmtDate(booking.created_at, 'dd MMM yyyy')}</span>
        <span><strong>Status:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: booking.status === 'checked_out' ? '#059669' : '#d97706' }}>{booking.status?.replace('_', ' ')}</span></span>
      </div>

      {/* Guest & Stay */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {renderGuestBox('#f1f5f9', pc)}
        {renderStayBox('#f1f5f9', pc)}
      </div>

      {renderFolioTable(pc, '#fff')}

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '18px' }}>
        <div style={{ flex: 1 }}>
          {renderPaymentsBreakdown()}
          {renderAmountInWords()}
          {renderBankDetails()}
        </div>
        {renderTotalsCard('#f1f5f9')}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `2px solid ${pc}`, paddingTop: '14px' }}>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          {settings.fields.show_terms && settings.default_terms && (
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: `${fs - 2}px`, fontWeight: 'bold', textTransform: 'uppercase', color: pc }}>Terms & Conditions:</p>
              <p style={{ margin: 0, fontSize: `${fs - 2.5}px`, color: '#64748b', whiteSpace: 'pre-wrap', lineHeight: 1.35 }}>{settings.default_terms}</p>
            </div>
          )}
        </div>
        {renderQrCode()}
        {renderSignature()}
      </div>

      {/* Bottom double border */}
      <div style={{ borderBottom: `3px double ${pc}`, marginTop: '14px' }} />
    </>
  );


  // ═════════════════════════════════════════════════════════════════════════════
  // 1D) PREMIUM — Luxury dark header for 5-star look
  // ═════════════════════════════════════════════════════════════════════════════
  const renderPremiumInvoice = () => wrapContent(
    <>
      {/* Dark header block */}
      <div style={{ backgroundColor: pc, color: '#ffffff', padding: '20px 22px', marginBottom: '18px', borderRadius: `${br}px ${br}px 0 0`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {settings.fields.show_logo && business.logo && (
            <img src={business.logo} style={{ maxHeight: `${settings.fields.logo_size || 50}px`, marginBottom: '6px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} alt="Logo" />
          )}
          <h1 style={{ margin: '0 0 4px 0', fontSize: `${fs + 7}px`, fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>{business.name}</h1>
          <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 1}px`, opacity: 0.8 }}>{business.address}</p>
          <p style={{ margin: 0, fontSize: `${fs - 1}px`, opacity: 0.8 }}>Ph: {business.phone} | Email: {business.email}</p>
          {settings.fields.show_gstin && business.gstin && (
            <p style={{ margin: '4px 0 0 0', fontSize: `${fs - 1}px`, fontWeight: 'bold', opacity: 0.9 }}>GSTIN: {business.gstin}</p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ padding: '8px 14px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: `${br}px`, backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p style={{ margin: '0 0 2px 0', fontSize: `${fs - 2}px`, fontWeight: '600', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Tax Invoice / Folio</p>
            <p style={{ margin: '0 0 4px 0', fontSize: `${fs + 5}px`, fontWeight: '900' }}>{booking.booking_number}</p>
            <p style={{ margin: 0, fontSize: `${fs - 1}px`, opacity: 0.75 }}>{fmtDate(booking.created_at, 'dd MMM yyyy, HH:mm')}</p>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #c9a84c, #d4af37, #c9a84c)', marginBottom: '16px', borderRadius: '2px' }} />

      {/* Guest & Stay */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {renderGuestBox('#faf9f6', pc)}
        {renderStayBox('#faf9f6', pc)}
      </div>

      {renderFolioTable(pc, '#ffffff')}

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          {renderPaymentsBreakdown()}
          {renderAmountInWords()}
          {renderBankDetails()}
        </div>
        {renderTotalsCard('#faf9f6')}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${bc}`, paddingTop: '14px' }}>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          {settings.fields.show_terms && settings.default_terms && (
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: `${fs - 2}px`, fontWeight: 'bold', textTransform: 'uppercase', color: pc }}>Terms & Policies:</p>
              <p style={{ margin: 0, fontSize: `${fs - 2.5}px`, color: '#64748b', whiteSpace: 'pre-wrap', lineHeight: 1.35 }}>{settings.default_terms}</p>
            </div>
          )}
        </div>
        {renderQrCode()}
        {renderSignature()}
      </div>

      {/* Bottom gold accent */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #c9a84c, #d4af37, #c9a84c)', marginTop: '14px', borderRadius: '2px' }} />
    </>
  );


  // ═════════════════════════════════════════════════════════════════════════════
  // 1E) POS THERMAL (80mm) HOTEL FOLIO
  // ═════════════════════════════════════════════════════════════════════════════
  const renderPosInvoice = () => (
    <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto', fontFamily: "'Courier New', Courier, monospace", fontSize: `${fs - 0.5}px`, lineHeight: 1.35, color: '#111827', padding: isPrintView ? `${mt}px ${mr}px ${mb}px ${ml}px` : '4px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        {settings.fields.show_logo && business.logo && (
          <img src={business.logo} style={{ maxHeight: '40px', maxWidth: '120px', margin: '0 auto 4px auto', display: 'block', objectFit: 'contain' }} alt="Logo" />
        )}
        <h2 style={{ fontSize: `${fs + 3}px`, fontWeight: '900', margin: '0 0 2px 0', textTransform: 'uppercase', color: pc }}>{business.name}</h2>
        <p style={{ margin: '0 0 1px 0', fontSize: `${Math.max(fs - 2, 8.5)}px` }}>{business.address}</p>
        <p style={{ margin: '0 0 1px 0', fontSize: `${Math.max(fs - 2, 8.5)}px` }}>Ph: {business.phone}</p>
        {settings.fields.show_gstin && business.gstin && (
          <p style={{ margin: 0, fontSize: `${Math.max(fs - 2, 8.5)}px`, fontWeight: 'bold' }}>GSTIN: {business.gstin}</p>
        )}
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: `${fs}px`, margin: '4px 0', color: pc }}>
        *** HOTEL ROOM FOLIO BILL ***
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${fs - 1}px` }}>
        <span>Folio: <strong>{booking.booking_number}</strong></span>
        <span>Date: {fmtDate(booking.created_at, 'dd-MM-yy')}</span>
      </div>
      <div style={{ fontSize: `${fs - 1}px`, marginTop: '3px', lineHeight: '1.4' }}>
        <div>Guest: <strong>{guest.name}</strong></div>
        {guest.phone && <div>Ph: {guest.phone}</div>}
        <div>Room: <strong>{room.room_number} ({room.room_type?.name})</strong></div>
        <div>Stay: {fmtDate(booking.check_in_date, 'dd/MM')} to {fmtDate(booking.check_out_date, 'dd/MM')} ({booking.total_nights}N)</div>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

      {/* Items */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${fs - 1}px` }}>
        <thead>
          <tr style={{ borderBottom: '1px dashed #000' }}>
            <th style={{ textAlign: 'left', padding: '3px 0' }}>ITEM / CHARGE</th>
            <th style={{ textAlign: 'center', padding: '3px 2px', width: '35px' }}>QTY</th>
            <th style={{ textAlign: 'right', padding: '3px 0', width: '60px' }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '4px 0' }}>
              <div style={{ fontWeight: '600' }}>Room Stay ({booking.total_nights}N)</div>
              <div style={{ fontSize: '9px', color: '#555' }}>@ ₹{booking.room_rate_per_night}/night</div>
            </td>
            <td style={{ textAlign: 'center', padding: '4px 2px' }}>{booking.total_nights}</td>
            <td style={{ textAlign: 'right', padding: '4px 0', fontWeight: 'bold' }}>{Number(booking.total_room_charges || 0).toFixed(2)}</td>
          </tr>
          {booking.folio_charges?.map((f: any, idx: number) => (
            <tr key={idx} style={{ borderTop: '1px dotted #ccc' }}>
              <td style={{ padding: '4px 0' }}>
                <div style={{ fontWeight: '600' }}>{f.description}</div>
                <div style={{ fontSize: '9px', color: '#555', textTransform: 'uppercase' }}>{f.charge_type}</div>
              </td>
              <td style={{ textAlign: 'center', padding: '4px 2px' }}>{f.quantity || 1}</td>
              <td style={{ textAlign: 'right', padding: '4px 0', fontWeight: 'bold' }}>{Number(f.grand_total || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

      {/* Totals */}
      <div style={{ fontSize: `${fs - 1}px`, lineHeight: 1.4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal (Taxable):</span>
          <span>₹ {Number(booking.taxable_amount || (Number(booking.total_room_charges || 0) + Number(booking.total_folio_charges || 0))).toFixed(2)}</span>
        </div>
        {settings.fields.show_tax_breakdown && (
          <>
            {Number(booking.cgst_amount || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <span>CGST:</span><span>₹ {Number(booking.cgst_amount).toFixed(2)}</span>
              </div>
            )}
            {Number(booking.sgst_amount || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <span>SGST:</span><span>₹ {Number(booking.sgst_amount).toFixed(2)}</span>
              </div>
            )}
          </>
        )}

        <div style={{ borderTop: '2px dashed #000', borderBottom: '2px dashed #000', padding: '5px 0', margin: '5px 0', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: `${fs + 2}px` }}>
          <span>GRAND TOTAL:</span>
          <span>₹ {Number(booking.grand_total || 0).toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Paid:</span>
          <span style={{ fontWeight: 'bold' }}>₹ {Number(booking.paid_amount || 0).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Balance Due:</span>
          <span style={{ fontWeight: 'bold' }}>₹ {Number(booking.balance_due || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* QR */}
      {settings.fields.show_qr_code && (
        <div style={{ textAlign: 'center', margin: '10px 0 6px 0' }}>
          <QRCode value={`${window.location.origin}/hotel/front-desk?booking=${booking.booking_number}`} size={80} level="M" />
          <div style={{ fontSize: '8px', marginTop: '3px', fontWeight: 'bold' }}>Scan to Verify Folio</div>
        </div>
      )}

      <div style={{ borderTop: '1px dashed #000', margin: '8px 0 4px 0', textAlign: 'center', paddingTop: '4px' }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: `${fs - 1}px` }}>*** THANK YOU FOR YOUR STAY ***</p>
        <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: '#555' }}>Front Desk: {business.phone}</p>
      </div>
    </div>
  );


  // ═════════════════════════════════════════════════════════════════════════════
  // 2. LUXURY MONEY PAYMENT RECEIPT VOUCHER (Clean, Crisp & Beautiful)
  // ═════════════════════════════════════════════════════════════════════════════
  const renderPaymentReceipt = () => {
    const isSettled = Number(booking.balance_due || 0) <= 0;
    const paymentModeUpper = (activePayment.payment_mode || 'CASH').toUpperCase();

    return (
      <div
        style={{
          width: '100%',
          maxWidth: '650px',
          margin: '0 auto',
          fontFamily: ff,
          fontSize: `${fs}px`,
          lineHeight: ls,
          color: '#1e293b',
          backgroundColor: '#ffffff',
          borderRadius: `${br}px`,
          border: `1.5px solid ${bc}`,
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Accent Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${pc} 0%, ${pc}dd 100%)`,
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            {settings.fields.show_logo && business.logo && (
              <img
                src={business.logo}
                style={{
                  maxHeight: '40px',
                  marginBottom: '6px',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                }}
                alt="Logo"
              />
            )}
            <h2
              style={{
                margin: 0,
                fontSize: `${fs + 4}px`,
                fontWeight: '900',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {business.name}
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: `${fs - 2}px`, opacity: 0.85 }}>
              {business.address} {business.phone ? `• Ph: ${business.phone}` : ''}
            </p>
            {settings.fields.show_gstin && business.gstin && (
              <p style={{ margin: '2px 0 0 0', fontSize: `${fs - 2}px`, fontWeight: '700', opacity: 0.9 }}>
                GSTIN: {business.gstin}
              </p>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '6px 14px',
                borderRadius: '8px',
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  fontSize: `${fs - 3}px`,
                  fontWeight: '800',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  opacity: 0.9,
                }}
              >
                Payment Receipt
              </div>
              <div style={{ fontSize: `${fs + 3}px`, fontWeight: '900', letterSpacing: '0.5px' }}>
                {activePayment.payment_number || `REC-${String(activePayment.id || '001').padStart(3, '0')}`}
              </div>
            </div>
            <div style={{ fontSize: `${fs - 2}px`, marginTop: '4px', opacity: 0.8 }}>
              {fmtDate(activePayment.created_at || new Date().toISOString(), 'dd MMM yyyy, HH:mm')}
            </div>
          </div>
        </div>

        {/* Inner Content Area */}
        <div style={{ padding: '20px' }}>
          
          {/* Guest & Folio Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              backgroundColor: '#f8fafc',
              border: `1px solid ${bc}`,
              borderRadius: `${br}px`,
              padding: '12px 16px',
              marginBottom: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: `${fs - 2}px`, color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
                Guest Name
              </span>
              <div style={{ fontSize: `${fs + 1}px`, fontWeight: '800', color: pc, marginTop: '1px' }}>
                {guest.name}
              </div>
              {guest.phone && (
                <div style={{ fontSize: `${fs - 1}px`, color: '#475569', marginTop: '1px' }}>
                  Ph: {guest.phone}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: `${fs - 2}px`, color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
                Assigned Room &amp; Folio
              </span>
              <div style={{ fontSize: `${fs + 1}px`, fontWeight: '800', color: pc, marginTop: '1px' }}>
                Room {room.room_number} <span style={{ fontSize: `${fs - 1}px`, fontWeight: '600', color: '#64748b' }}>({room.room_type?.name})</span>
              </div>
              <div style={{ fontSize: `${fs - 1}px`, color: '#475569', marginTop: '1px' }}>
                Folio #: <strong>{booking.booking_number}</strong>
              </div>
            </div>
          </div>

          {/* Payment Amount Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: '1.5px solid #a7f3d0',
              borderRadius: `${br}px`,
              padding: '16px 20px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: `${fs - 2}px`, color: '#166534', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Amount Received
                </span>
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    border: '1px solid #86efac',
                    color: '#15803d',
                    fontSize: `${fs - 3}px`,
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                  }}
                >
                  {paymentModeUpper}
                </span>
              </div>
              <div style={{ fontSize: `${fs + 12}px`, fontWeight: '900', color: '#15803d', letterSpacing: '-0.5px' }}>
                ₹ {Number(activePayment.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ textAlign: 'right', maxWidth: '50%' }}>
              <div style={{ fontSize: `${fs - 2}px`, color: '#64748b', fontWeight: '600' }}>
                Payment Reference / Notes:
              </div>
              <div style={{ fontSize: `${fs}px`, fontWeight: '700', color: '#166534', marginTop: '2px' }}>
                {activePayment.notes || 'Received towards Hotel Room Folio'}
              </div>
            </div>
          </div>

          {/* Amount In Words */}
          {settings.fields.show_amount_in_words && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                border: `1px solid ${bc}`,
                borderRadius: `${br}px`,
                marginBottom: '16px',
                fontSize: `${fs}px`,
              }}
            >
              <span style={{ fontSize: `${fs - 2}px`, color: '#64748b', textTransform: 'uppercase', fontWeight: '700', marginRight: '6px' }}>
                In Words:
              </span>
              <strong style={{ color: pc, textTransform: 'capitalize', fontWeight: '800' }}>
                INR {numberToIndianWords(activePayment.amount || 0)}
              </strong>
            </div>
          )}

          {/* Folio Billing Summary Bar (3 Columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              padding: '12px',
              backgroundColor: '#f8fafc',
              border: `1px solid ${bc}`,
              borderRadius: `${br}px`,
              marginBottom: '18px',
              textAlign: 'center',
            }}
          >
            <div style={{ borderRight: `1px solid ${bc}`, paddingRight: '8px' }}>
              <div style={{ fontSize: `${fs - 2.5}px`, color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                Total Folio Bill
              </div>
              <div style={{ fontSize: `${fs + 2}px`, fontWeight: '900', color: pc, marginTop: '2px' }}>
                ₹ {Number(booking.grand_total || 0).toFixed(2)}
              </div>
            </div>

            <div style={{ borderRight: `1px solid ${bc}`, paddingRight: '8px' }}>
              <div style={{ fontSize: `${fs - 2.5}px`, color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                Paid Till Date
              </div>
              <div style={{ fontSize: `${fs + 2}px`, fontWeight: '900', color: '#059669', marginTop: '2px' }}>
                ₹ {Number(booking.paid_amount || 0).toFixed(2)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: `${fs - 2.5}px`, color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                Balance Due
              </div>
              <div style={{ fontSize: `${fs + 2}px`, fontWeight: '900', color: isSettled ? '#059669' : '#dc2626', marginTop: '2px' }}>
                {isSettled ? '₹ 0.00 (Settled)' : `₹ ${Number(booking.balance_due || 0).toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* Footer: Digital QR & Authorized Signatory */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: `1px solid ${bc}`,
              paddingTop: '14px',
            }}
          >
            {/* Left: Notes & QR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {settings.fields.show_qr_code && (
                <div
                  style={{
                    padding: '4px',
                    backgroundColor: '#ffffff',
                    border: `1px solid ${bc}`,
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <QRCode
                    value={`${window.location.origin}/hotel/front-desk?receipt=${activePayment.payment_number || activePayment.id}&booking=${booking.booking_number}`}
                    size={65}
                    level="M"
                  />
                  <div style={{ fontSize: '7.5px', fontWeight: '700', color: '#64748b', marginTop: '2px' }}>
                    Scan to Verify
                  </div>
                </div>
              )}
              <div style={{ fontSize: `${fs - 2.5}px`, color: '#94a3b8', maxWidth: '240px', lineHeight: 1.35 }}>
                * This is a verified electronic money receipt voucher issued by front desk billing.
              </div>
            </div>

            {/* Right: Signature */}
            <div style={{ textAlign: 'right', minWidth: '160px' }}>
              <div
                style={{
                  height: '35px',
                  borderBottom: `1.5px solid ${pc}60`,
                  width: '140px',
                  marginLeft: 'auto',
                  marginBottom: '4px',
                }}
              />
              <p style={{ margin: 0, fontSize: `${fs}px`, fontWeight: '800', color: pc }}>
                {settings.signature_label || 'Authorized Signatory'}
              </p>
              <p style={{ margin: '1px 0 0 0', fontSize: `${fs - 2.5}px`, color: '#64748b' }}>
                For {business.name}
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  };


  // ═════════════════════════════════════════════════════════════════════════════
  // 3. KOT (KITCHEN ORDER TICKET) POS THERMAL
  // ═════════════════════════════════════════════════════════════════════════════
  const renderKot = () => {
    const kfs = settings.kot_settings?.font_size || 12;

    return (
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          margin: '0 auto',
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: `${kfs}px`,
          lineHeight: 1.35,
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: isPrintView ? `${mt}px ${mr}px ${mb}px ${ml}px` : '10px 14px',
        }}
      >
        {/* KOT Title Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '6px', marginBottom: '6px' }}>
          {settings.kot_settings?.show_restaurant_name && (
            <div style={{ fontSize: `${kfs + 1}px`, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {business.name}
            </div>
          )}
          <div style={{ fontSize: `${kfs + 8}px`, fontWeight: '900', letterSpacing: '3px', margin: '4px 0 2px 0' }}>
            *** K. O. T ***
          </div>
          <div style={{ fontSize: `${kfs - 2}px`, fontWeight: 'bold' }}>KITCHEN ORDER TICKET</div>
        </div>

        {/* KOT Meta */}
        <div style={{ fontSize: `${kfs - 1}px`, lineHeight: 1.4, marginBottom: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>KOT #: <strong>{kotData.order_number}</strong></span>
            <span>{fmtDate(kotData.created_at, 'HH:mm:ss')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: `${kfs + 2}px`, margin: '4px 0' }}>
            <span>TYPE: {kotData.order_type === 'room_service' ? `ROOM ${kotData.room_number || room.room_number}` : `TABLE ${kotData.table_id || 'T-1'}`}</span>
            <span style={{ fontSize: `${kfs}px`, fontWeight: 'normal' }}>{fmtDate(kotData.created_at, 'dd-MM-yy')}</span>
          </div>
          {settings.kot_settings?.show_server_name && kotData.server_name && (
            <div>Server/Captain: <strong>{kotData.server_name}</strong></div>
          )}
          {kotData.guest_name && (
            <div>Guest: <strong>{kotData.guest_name}</strong></div>
          )}
        </div>

        <div style={{ borderTop: '2px dashed #000', margin: '6px 0' }} />

        {/* Item List */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${kfs}px` }}>
          <thead>
            <tr style={{ borderBottom: '1.5px dashed #000' }}>
              <th style={{ textAlign: 'left', padding: '4px 0', width: '75%' }}>ITEM DESCRIPTION</th>
              <th style={{ textAlign: 'right', padding: '4px 0', width: '25%' }}>QTY</th>
            </tr>
          </thead>
          <tbody>
            {kotData.items?.map((item: any, idx: number) => (
              <tr key={idx} style={{ borderBottom: '1px dotted #888' }}>
                <td style={{ padding: '5px 0', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: '900', fontSize: `${kfs + 1}px` }}>{item.name}</div>
                  {item.notes && (
                    <div style={{ fontSize: `${kfs - 2}px`, fontStyle: 'italic', color: '#222', marginTop: '1px' }}>
                      ↳ {item.notes}
                    </div>
                  )}
                </td>
                <td style={{ textAlign: 'right', padding: '5px 0', verticalAlign: 'top', fontWeight: '900', fontSize: `${kfs + 4}px` }}>
                  {item.qty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ borderTop: '2px dashed #000', margin: '6px 0' }} />

        {/* Special Instructions */}
        {settings.kot_settings?.show_special_instructions && kotData.special_instructions && (
          <div style={{ border: '1.5px dashed #000', padding: '6px 8px', margin: '6px 0', fontSize: `${kfs - 1}px`, fontWeight: 'bold' }}>
            SPECIAL INSTRUCTION: {kotData.special_instructions}
          </div>
        )}

        {/* End of KOT */}
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: `${kfs - 2}px`, fontWeight: 'bold', letterSpacing: '1px' }}>
          === END OF ORDER ===
        </div>
      </div>
    );
  };


  // ── Template router ──
  const templateMap: Record<string, () => React.ReactNode> = {
    default: renderDefaultInvoice,
    modern: renderModernInvoice,
    classic: renderClassicInvoice,
    premium: renderPremiumInvoice,
    pos: renderPosInvoice,
  };

  // Switch between tabs / preview views
  return (
    <div style={{ width: '100%', backgroundColor: isPrintView ? '#fff' : 'transparent' }}>
      {previewTab === 'invoice' && (templateMap[settings.template] || renderDefaultInvoice)()}
      {previewTab === 'receipt' && renderPaymentReceipt()}
      {previewTab === 'kot' && renderKot()}
    </div>
  );
}
