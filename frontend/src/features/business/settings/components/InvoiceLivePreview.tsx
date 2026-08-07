import React from 'react';
import type { InvoiceSettings } from '../api/useInvoiceSettings';
import { useTenantStore } from '@/store/tenantStore';
import QRCode from 'react-qr-code';

interface InvoiceLivePreviewProps {
  settings?: InvoiceSettings;
  business?: any;
  invoice?: any;
  rawInvoice?: any;
  isPrintView?: boolean;
}

export default function InvoiceLivePreview({ settings: propSettings, business: propBusiness, invoice: propInvoice, rawInvoice, isPrintView = false }: InvoiceLivePreviewProps) {
  const { activeBusiness } = useTenantStore();

  const defaultSettings: InvoiceSettings = {
    template: 'default',
    header_image: null,
    footer_image: null,
    signature_image: null,
    signature_label: 'Authorized Signatory',
    default_terms: '1. Goods once sold will not be taken back.\n2. Subject to local jurisdiction.',
    default_bank_details: '',
    custom_fields: [],
    fields: {
      show_logo: true, show_hsn: true, show_bank_details: true, show_terms: true,
      show_discount: true, show_vehicle_info: true, show_amount_in_words: true,
      show_gstin: true, show_place_of_supply: true, show_due_date: true,
      show_signature: true, show_customer_phone: true, show_tax_breakdown: true,
      show_rate: true, show_qty: true, show_reference_number: true,
      show_watermark: false, show_receiver_signature: false, show_qr_code: true,
      watermark_use_document_type: false,
    },
    styles: {
      primary_color: '#333333', secondary_color: '#64748b', border_color: '#e2e8f0',
      font_size: 14, font_family: 'Inter', line_spacing: 1.5,
      margin_top: 20, margin_bottom: 20, margin_left: 20, margin_right: 20,
      border_radius: 8, frame_style: 'none',
    }
  };

  const settings = {
    ...defaultSettings,
    ...(propSettings || {}),
    fields: { ...defaultSettings.fields, ...(propSettings?.fields || {}) },
    styles: { ...defaultSettings.styles, ...(propSettings?.styles || {}) },
  };
  
  // Dummy data for preview
  const business = propBusiness || {
    name: activeBusiness?.name || 'Your Company Name',
    address: activeBusiness?.address || '123 Business Street, City, State, 123456',
    phone: activeBusiness?.phone || '9876543210',
    gstin: activeBusiness?.gst_number || '22AAAAA0000A1Z5',
    logo: activeBusiness?.settings?.whitelabel_logo || null,
  };

  const invoice = propInvoice || {
    invoice_number: 'INV-2026-001',
    date: '30 Jul 2026',
    due_date: '05 Aug 2026',
    customer_name: 'Acme Corporation',
    customer_address: '456 Client Avenue, Business District, 654321',
    customer_phone: '9876543211',
    customer_gstin: '33BBBBB1111B2Z6',
    type: 'TAX INVOICE',
    place_of_supply: 'Maharashtra (27)',
    vehicle_number: 'MH 12 AB 3456',
    driver_name: 'John Doe',
    reference_number: 'PO-98765',
    terms: settings.default_terms || '1. Goods once sold will not be taken back.\n2. Subject to local jurisdiction.',
    bank_details: settings.default_bank_details || 'Bank Name: State Bank of India\nAcct No: 000000123456789\nIFSC: SBIN0001234',
    items: [
      { name: 'Product 1', hsn: '8517', qty: 2, unit: 'PCS', rate: 1000, tax: 360, amount: 2360 },
      { name: 'Service 1', hsn: '9983', qty: 1, unit: 'NOS', rate: 5000, tax: 900, amount: 5900 },
    ],
    subtotal: 7000,
    tax: 1260,
    discount: 0,
    round_off: 0,
    total: 8260,
    amount_in_words: 'Eight Thousand Two Hundred Sixty Rupees Only',
    uuid: 'sample-uuid-1234'
  };

  const defaultRawInvoice = {
    tax_type: 'gst',
    payment_mode: 'Split',
    paid_amount: 8260,
    final_amount: 8260,
    cgst_amount: 630,
    sgst_amount: 630,
    igst_amount: 0,
    cess_amount: 100,
    payments: [
      { payment_mode: 'Cash', amount: 5000 },
      { payment_mode: 'UPI', amount: 3260 },
    ],
    items: [
      { gst_rate: 18, taxable_amount: 5000, cgst_amount: 450, sgst_amount: 450, igst_amount: 0, cess_amount: 100 },
      { gst_rate: 18, taxable_amount: 2000, cgst_amount: 180, sgst_amount: 180, igst_amount: 0, cess_amount: 0 },
    ]
  };

  const currentRawInvoice = rawInvoice || defaultRawInvoice;

  const taxSummaryData = React.useMemo(() => {
    if (!currentRawInvoice || !currentRawInvoice.items || currentRawInvoice.tax_type === 'exempt') return null;
    const summary: Record<string, any> = {};
    currentRawInvoice.items.forEach((item: any) => {
      const rate = Number(item.gst_rate || 0);
      if (!summary[rate]) {
        summary[rate] = { taxable: 0, cgst: 0, sgst: 0, igst: 0, cess: 0, total: 0 };
      }
      summary[rate].taxable += Number(item.taxable_amount || 0);
      summary[rate].cgst += Number(item.cgst_amount || 0);
      summary[rate].sgst += Number(item.sgst_amount || 0);
      summary[rate].igst += Number(item.igst_amount || 0);
      summary[rate].cess += Number(item.cess_amount || 0);
      summary[rate].total += Number(item.cgst_amount || 0) + Number(item.sgst_amount || 0) + Number(item.igst_amount || 0) + Number(item.cess_amount || 0);
    });
    return Object.entries(summary).map(([rate, vals]) => ({ rate, ...vals })).sort((a, b) => Number(a.rate) - Number(b.rate));
  }, [currentRawInvoice]);

  // Convert mm/px to a scale so it fits nicely
  // We'll render a fixed 800px width container, and use CSS transform to scale it down to fit the parent.
  const previewStyle = {
    fontFamily: settings.styles.font_family || "'Helvetica', 'Arial', sans-serif",
    fontSize: `${settings.styles.font_size}px`,
    lineHeight: settings.styles.line_spacing || 1.5,
    color: settings.template === 'modern' ? '#334155' : '#000',
    backgroundColor: '#fff',
    width: '800px',
    minHeight: '1131px', // A4 aspect ratio at 800px width
    boxSizing: 'border-box' as const,
    transformOrigin: 'top left',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
  };

  const contentStyle = {
    flex: 1,
    paddingTop: settings.header_image ? '15px' : `${settings.styles.margin_top}px`,
    paddingBottom: settings.footer_image ? '15px' : `${settings.styles.margin_bottom}px`,
    paddingLeft: `${settings.styles.margin_left}px`,
    paddingRight: `${settings.styles.margin_right}px`,
    boxSizing: 'border-box' as const,
  };

  const primaryColor = settings.styles.primary_color || '#333';
  const secondaryColor = settings.styles.secondary_color || '#64748b';
  const borderColor = settings.styles.border_color || '#e2e8f0';
  const borderRadius = settings.styles.border_radius || 0;
  
  // Calculate frame styles
  const frameStyle = settings.styles.frame_style || 'none';
  let frameBorder = 'none';
  let frameBgImage = 'none';
  let frameBgPos = '';
  let frameBgSize = '';
  let frameBgRepeat = '';
  let framePadding = '0px';
  
  if (frameStyle === 'elegant') {
    framePadding = '25px';
    frameBorder = `2px solid ${primaryColor}`;
    frameBgImage = `
      radial-gradient(circle at 100% 100%, transparent 8px, ${primaryColor} 8px, ${primaryColor} 10px, transparent 10px),
      radial-gradient(circle at 0% 100%, transparent 8px, ${primaryColor} 8px, ${primaryColor} 10px, transparent 10px),
      radial-gradient(circle at 100% 0%, transparent 8px, ${primaryColor} 8px, ${primaryColor} 10px, transparent 10px),
      radial-gradient(circle at 0% 0%, transparent 8px, ${primaryColor} 8px, ${primaryColor} 10px, transparent 10px)
    `;
    frameBgPos = 'top left, top right, bottom left, bottom right';
    frameBgSize = '20px 20px';
    frameBgRepeat = 'no-repeat';
  } else if (frameStyle !== 'none') {
    frameBorder = `4px ${frameStyle} ${borderColor}`;
    framePadding = '20px';
  }

  const renderCustomFields = (color = '#000') => {
    if (!settings.custom_fields || settings.custom_fields.length === 0) return null;
    return (
      <div style={{ marginTop: '5px' }}>
        {settings.custom_fields.map((f, i) => (
          <p key={i} style={{ margin: 0, color }}>
            <span style={{ fontWeight: 'bold' }}>{f.key}:</span> {f.value}
          </p>
        ))}
      </div>
    );
  };

  const renderDefaultTemplate = () => (
    <div style={{ maxWidth: isPrintView ? 'none' : '800px', margin: 'auto', width: '100%', fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif", fontSize: '14px' }}>
      {!settings.header_image && (
        <h2 style={{ textAlign: 'center', textTransform: 'uppercase', color: primaryColor, fontSize: '24px', margin: '0 0 15px 0' }}>{invoice.type || 'Tax Invoice'}</h2>
      )}
      
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '10px' }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', verticalAlign: 'top', padding: '5px' }}>
              {settings.fields.show_logo !== false && business.logo && (
                <img src={business.logo} style={{ maxHeight: settings.fields.logo_size ? `${settings.fields.logo_size}px` : '50px', marginBottom: '5px' }} alt="Logo" />
              )}
              <h3 style={{ margin: 0, color: primaryColor }}>{business.name}</h3>
              <p style={{ margin: 0 }}>{business.address}</p>
              <p style={{ margin: 0 }}>Phone: {business.phone}</p>
              {settings.fields.show_gstin !== false && <p style={{ margin: 0 }}>GSTIN: {business.gstin}</p>}
              {renderCustomFields(primaryColor)}
            </td>
            <td style={{ width: '50%', verticalAlign: 'top', textAlign: 'right', padding: '5px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '16px', margin: 0 }}>Invoice No: {invoice.invoice_number}</p>
              {settings.fields.show_reference_number !== false && <p style={{ margin: 0 }}>Ref: {invoice.reference_number}</p>}
              <p style={{ margin: 0 }}>Date: {invoice.date}</p>
              {settings.fields.show_due_date !== false && <p style={{ margin: 0 }}>Due Date: {invoice.due_date}</p>}
              <p style={{ margin: 0 }}>Type: {invoice.type}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', verticalAlign: 'top' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Billed To:</p>
                <p style={{ margin: 0 }}>{invoice.customer_name}</p>
                <p style={{ margin: 0 }}>{invoice.customer_address}</p>
                {settings.fields.show_customer_phone !== false && <p style={{ margin: 0 }}>Phone: {invoice.customer_phone}</p>}
                {settings.fields.show_gstin !== false && <p style={{ margin: 0 }}>GSTIN: {invoice.customer_gstin}</p>}
                {settings.fields.show_place_of_supply !== false && <p style={{ margin: 0 }}>State: {invoice.place_of_supply}</p>}
              </td>
              <td style={{ width: '50%', verticalAlign: 'top' }}>
                {settings.fields.show_vehicle_info !== false && (
                  <>
                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Vehicle No:</span> {invoice.vehicle_number}</p>
                    <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Driver Name:</span> {invoice.driver_name}</p>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th style={{ background: primaryColor, color: '#fff', padding: '8px', textAlign: 'left', border: `1px solid ${primaryColor}` }}>#</th>
            <th style={{ background: primaryColor, color: '#fff', padding: '8px', textAlign: 'left', border: `1px solid ${primaryColor}` }}>Item Description</th>
            {settings.fields.show_hsn !== false && <th style={{ background: primaryColor, color: '#fff', padding: '8px', textAlign: 'left', border: `1px solid ${primaryColor}` }}>HSN/SAC</th>}
            {settings.fields.show_qty !== false && <th style={{ background: primaryColor, color: '#fff', padding: '8px', textAlign: 'right', border: `1px solid ${primaryColor}` }}>Qty</th>}
            {settings.fields.show_rate !== false && <th style={{ background: primaryColor, color: '#fff', padding: '8px', textAlign: 'right', border: `1px solid ${primaryColor}` }}>Rate</th>}
            {settings.fields.show_tax_breakdown !== false && <th style={{ background: primaryColor, color: '#fff', padding: '8px', textAlign: 'right', border: `1px solid ${primaryColor}` }}>Tax</th>}
            <th style={{ background: primaryColor, color: '#fff', padding: '8px', textAlign: 'right', border: `1px solid ${primaryColor}` }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item: any, index: number) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '5px' }}>{index + 1}</td>
              <td style={{ border: '1px solid #ddd', padding: '5px' }}>{item.name}</td>
              {settings.fields.show_hsn !== false && <td style={{ border: '1px solid #ddd', padding: '5px' }}>{item.hsn}</td>}
              {settings.fields.show_qty !== false && <td style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'right' }}>{item.qty} {item.unit}</td>}
              {settings.fields.show_rate !== false && <td style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'right' }}>{item.rate}</td>}
              {settings.fields.show_tax_breakdown !== false && <td style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'right' }}>{item.tax}</td>}
              <td style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'right' }}>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {settings.fields.show_tax_breakdown !== false && taxSummaryData && (
        <div style={{ marginTop: '15px', pageBreakInside: 'avoid' }}>
          <p style={{ fontWeight: 'bold', fontSize: '11px', margin: '0 0 5px 0', color: primaryColor }}>Tax Summary</p>
          <table style={{ width: '70%', fontSize: '10px', borderCollapse: 'collapse', border: `1px solid ${settings.styles.border_color}` }}>
            <thead style={{ background: '#f8fafc', color: '#475569' }}>
              <tr>
                <th style={{ padding: '4px', textAlign: 'left', border: `1px solid ${settings.styles.border_color}` }}>Tax Rate</th>
                <th style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>Taxable Value</th>
                {rawInvoice?.tax_type === 'gst' ? (
                  <>
                    <th style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>CGST</th>
                    <th style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>SGST</th>
                  </>
                ) : (
                  <th style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>IGST</th>
                )}
                <th style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>CESS</th>
                <th style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>Total Tax</th>
              </tr>
            </thead>
            <tbody>
              {taxSummaryData.map((taxes, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '4px', textAlign: 'left', border: `1px solid ${settings.styles.border_color}` }}>GST {taxes.rate}%</td>
                  <td style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>₹ {Number(taxes.taxable).toFixed(2)}</td>
                  {rawInvoice?.tax_type === 'gst' ? (
                    <>
                      <td style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>₹ {Number(taxes.cgst).toFixed(2)}</td>
                      <td style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>₹ {Number(taxes.sgst).toFixed(2)}</td>
                    </>
                  ) : (
                    <td style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>₹ {Number(taxes.igst).toFixed(2)}</td>
                  )}
                  <td style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>₹ {Number(taxes.cess).toFixed(2)}</td>
                  <td style={{ padding: '4px', textAlign: 'right', border: `1px solid ${settings.styles.border_color}` }}>₹ {Number(taxes.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div style={{ width: '60%', paddingRight: '20px' }}>
          {settings.fields.show_terms !== false && !settings.fields.terms_on_new_page && (
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: primaryColor, fontSize: '14px' }}>Terms & Conditions:</p>
              <p style={{ fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap', color: '#475569', lineHeight: 1.4 }}>{invoice.terms}</p>
            </div>
          )}
          
          {settings.fields.show_bank_details !== false && (
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: primaryColor, fontSize: '14px' }}>Bank Details:</p>
              <p style={{ fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap', color: '#475569', lineHeight: 1.4 }}>{invoice.bank_details}</p>
            </div>
          )}

          {settings.fields.show_amount_in_words !== false && (
            <div>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: primaryColor, fontSize: '14px' }}>Amount in Words:</p>
              <p style={{ fontSize: '14px', margin: 0, textTransform: 'capitalize', fontWeight: '500' }}>INR {invoice.amount_in_words || 'Eight Thousand Two Hundred Sixty Only.'}</p>
            </div>
          )}
        </div>
        
        <div style={{ width: '40%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 10px', color: '#475569' }}>Total Taxable Value</td>
                <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '500' }}>₹ {invoice.subtotal}</td>
              </tr>
              {settings.fields.show_tax_breakdown !== false && currentRawInvoice && currentRawInvoice.tax_type !== 'exempt' ? (
                <>
                  {currentRawInvoice.tax_type === 'gst' ? (
                    <>
                      <tr>
                        <td style={{ padding: '6px 10px', color: '#475569' }}>Total CGST</td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '500' }}>₹ {Number(currentRawInvoice.cgst_amount || 0).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 10px', color: '#475569' }}>Total SGST</td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '500' }}>₹ {Number(currentRawInvoice.sgst_amount || 0).toFixed(2)}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td style={{ padding: '6px 10px', color: '#475569' }}>Total IGST</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '500' }}>₹ {Number(currentRawInvoice.igst_amount || 0).toFixed(2)}</td>
                    </tr>
                  )}
                  {Number(currentRawInvoice.cess_amount || 0) > 0 && (
                    <tr>
                      <td style={{ padding: '6px 10px', color: '#475569' }}>Total CESS</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '500' }}>₹ {Number(currentRawInvoice.cess_amount || 0).toFixed(2)}</td>
                    </tr>
                  )}
                </>
              ) : (
                <tr>
                  <td style={{ padding: '6px 10px', color: '#475569' }}>Total Tax</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '500' }}>₹ {invoice.tax}</td>
                </tr>
              )}
              {settings.fields.show_discount !== false && (
                <tr>
                  <td style={{ padding: '6px 10px', color: '#475569' }}>Discount</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '500', color: '#ef4444' }}>- ₹ {invoice.discount}</td>
                </tr>
              )}
              <tr style={{ backgroundColor: `${primaryColor}15`, borderTop: `2px solid ${primaryColor}` }}>
                <td style={{ padding: '10px', fontWeight: 'bold', color: primaryColor, fontSize: '15px' }}>Grand Total</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: primaryColor, whiteSpace: 'nowrap' }}>₹ {invoice.total}</td>
              </tr>
              {settings.fields.show_payment_breakdown !== false && currentRawInvoice?.payment_mode === 'Split' && currentRawInvoice?.payments?.length > 0 ? (
                <>
                  <tr>
                    <td colSpan={2} style={{ padding: '6px 10px', fontWeight: 'bold', borderTop: '1px dashed #ccc', fontSize: '12px', marginTop: '5px' }}>Payment Breakdown</td>
                  </tr>
                  {currentRawInvoice.payments.map((p: any, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: '2px 10px', color: '#475569' }}>{p.payment_mode}</td>
                      <td style={{ padding: '2px 10px', textAlign: 'right', fontWeight: '500' }}>₹ {Number(p.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: '6px 10px', fontWeight: 'bold' }}>Amount Paid</td>
                    <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 'bold' }}>₹ {Number(currentRawInvoice.paid_amount || 0).toFixed(2)}</td>
                  </tr>
                </>
              ) : settings.fields.show_payment_breakdown !== false && currentRawInvoice ? (
                <tr>
                  <td style={{ padding: '6px 10px', color: '#475569' }}>Amount Paid {currentRawInvoice.payment_mode ? `(${currentRawInvoice.payment_mode})` : ''}</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '500' }}>₹ {Number(currentRawInvoice.paid_amount || 0).toFixed(2)}</td>
                </tr>
              ) : null}
              {settings.fields.show_payment_breakdown !== false && currentRawInvoice && (
                <tr>
                  <td style={{ padding: '6px 10px', fontWeight: 'bold', color: '#475569' }}>Balance Due</td>
                  <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 'bold' }}>₹ {Number((currentRawInvoice.final_amount || 0) - (currentRawInvoice.paid_amount || 0)).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, textAlign: 'left' }}>
          {settings.fields.show_qr_code !== false && invoice.uuid && (
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <QRCode value={`${window.location.origin}/invoice/${invoice.uuid}`} size={80} level="M" />
                <p style={{ fontSize: '12px', margin: '5px 0 0 0', color: '#64748b' }}>Scan to View</p>
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, textAlign: 'center' }}>
            {settings.fields.show_receiver_signature !== false && (
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: '60px' }}></div>
                <p style={{ fontWeight: 'bold', margin: 0, color: primaryColor, fontSize: '14px' }}>Receiver's Signature</p>
              </div>
            )}
          </div>

          <div style={{ flex: 1, textAlign: 'right' }}>
            {settings.fields.show_signature !== false ? (
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                {settings.signature_image ? (
                  <img src={settings.signature_image} alt="Signature" style={{ maxHeight: '60px', marginBottom: '5px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ borderBottom: `1px solid ${borderColor}`, width: '150px', marginBottom: '5px', height: '60px' }}></div>
                )}
                <p style={{ fontWeight: 'bold', margin: 0, color: primaryColor, fontSize: '14px' }}>{settings.signature_label || 'Authorized Signatory'}</p>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>For {business.name}</p>
              </div>
            ) : <div />}
          </div>
        </div>
      </div>
  );

  const renderClassicTemplate = () => {
    const hsnCol = settings.fields.show_hsn !== false ? 1 : 0;
    const qtyCol = settings.fields.show_qty !== false ? 1 : 0;
    const rateCol = settings.fields.show_rate !== false ? 1 : 0;
    const taxCol = settings.fields.show_tax_breakdown !== false ? 1 : 0;
    const totalColumns = 3 + hsnCol + qtyCol + rateCol + taxCol;
    const leftColSpan = Math.ceil(totalColumns / 2);
    const rightColSpan = totalColumns - leftColSpan;

    return (
    <div style={{ maxWidth: isPrintView ? 'none' : '800px', margin: 'auto', color: '#1e293b', width: '100%', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ border: `2px solid ${primaryColor}`, borderBottom: 'none', paddingBottom: '8px' }}>
          <h1 style={{ color: primaryColor, fontSize: '32px', fontWeight: 'bold', margin: 0, padding: '12px 0 5px 0', textTransform: 'uppercase', textAlign: 'center' }}>{business.name}</h1>
          <p style={{ fontWeight: '600', textAlign: 'center', fontSize: '13px', margin: 0, paddingBottom: '5px' }}>{business.address}</p>
          {settings.fields.show_gstin !== false && (
            <p style={{ fontWeight: '600', textAlign: 'center', fontSize: '13px', margin: 0, paddingBottom: '5px' }}>
              GSTIN: {business.gstin} <span style={{ marginLeft: '20px' }}>MOB:- {business.phone}</span>
            </p>
          )}
        </div>
      {renderCustomFields(primaryColor)}

      <table style={{ width: '100%', borderCollapse: 'collapse', border: `2px solid ${primaryColor}` }}>
        <tbody>
          <tr>
            <td colSpan={totalColumns} style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: primaryColor, color: '#fff', border: `1px solid ${primaryColor}`, padding: '8px', fontSize: '16px', letterSpacing: '1px' }}>{invoice.type || 'TAX INVOICE'}</td>
          </tr>
          <tr>
            <td colSpan={leftColSpan} style={{ width: '50%', border: `1px solid ${primaryColor}`, padding: '8px', verticalAlign: 'top', fontSize: '13px' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', color: primaryColor, fontSize: '14px' }}>Billing Address :-</p>
              <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '14px' }}>{invoice.customer_name}</p>
              <p style={{ margin: '0 0 2px 0' }}>{invoice.customer_address}</p>
              {settings.fields.show_customer_phone !== false && <p style={{ margin: '0 0 2px 0' }}>Mob:- {invoice.customer_phone}</p>}
              {settings.fields.show_gstin !== false && <p style={{ margin: 0 }}>GSTIN: {invoice.customer_gstin}</p>}
            </td>
            <td colSpan={rightColSpan} style={{ width: '50%', border: `1px solid ${primaryColor}`, padding: '8px', verticalAlign: 'top', fontSize: '13px' }}>
              <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: 'bold', color: primaryColor }}>Date:-</span> {invoice.date}</p>
              <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: 'bold', color: primaryColor }}>Invoice No:-</span> {invoice.invoice_number}</p>
              {settings.fields.show_reference_number !== false && <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: 'bold', color: primaryColor }}>Ref No:-</span> {invoice.reference_number}</p>}
              {settings.fields.show_due_date !== false && <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: 'bold', color: primaryColor }}>Due Date:-</span> {invoice.due_date}</p>}
              {settings.fields.show_vehicle_info !== false && <p style={{ margin: '0 0 4px 0' }}><span style={{ fontWeight: 'bold', color: primaryColor }}>Vehicle No:-</span> {invoice.vehicle_number}</p>}
            </td>
          </tr>
          
          <tr style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: `${primaryColor}15`, color: primaryColor, fontSize: '13px' }}>
            <td style={{ border: `1px solid ${primaryColor}`, padding: '8px', width: '5%' }}>SL NO.</td>
            {settings.fields.show_hsn !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '8px', width: '15%' }}>HSN</td>}
            <td style={{ border: `1px solid ${primaryColor}`, padding: '8px', width: '40%' }}>Item Description</td>
            {settings.fields.show_qty !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '8px', width: '10%' }}>Qty</td>}
            {settings.fields.show_rate !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '8px', width: '10%' }}>Rate</td>}
            {settings.fields.show_tax_breakdown !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '8px', width: '10%' }}>Tax</td>}
            <td style={{ border: `1px solid ${primaryColor}`, padding: '8px', width: '10%' }}>Amount</td>
          </tr>
          
          {invoice.items.map((item: any, index: number) => (
            <tr key={index} style={{ fontSize: '13px' }}>
              <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px', textAlign: 'center' }}>{index + 1}</td>
              {settings.fields.show_hsn !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px', textAlign: 'center' }}>{item.hsn}</td>}
              <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px', fontWeight: '500' }}>{item.name}</td>
              {settings.fields.show_qty !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px', textAlign: 'center' }}>{item.qty} <span style={{fontSize: '10px', color: '#64748b'}}>{item.unit}</span></td>}
              {settings.fields.show_rate !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px', textAlign: 'right' }}>{item.rate}</td>}
              {settings.fields.show_tax_breakdown !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px', textAlign: 'right' }}>{item.tax}</td>}
              <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px', textAlign: 'right', fontWeight: '600' }}>{item.amount}</td>
            </tr>
          ))}
          {[1,2,3,4].map(i => (
            <tr key={`empty-${i}`} style={{ textAlign: 'center', fontSize: '13px' }}>
              <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px', color: 'transparent' }}>-</td>
              {settings.fields.show_hsn !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px' }}></td>}
              <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px' }}></td>
              {settings.fields.show_qty !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px' }}></td>}
              {settings.fields.show_rate !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px' }}></td>}
              {settings.fields.show_tax_breakdown !== false && <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px' }}></td>}
              <td style={{ border: `1px solid ${primaryColor}`, padding: '6px 8px' }}></td>
            </tr>
          ))}

          {settings.fields.show_tax_breakdown !== false && currentRawInvoice ? (
            <>
              <tr style={{ fontSize: '14px' }}>
                <td colSpan={totalColumns - 2} rowSpan={(currentRawInvoice.tax_type === 'gst' ? 2 : 1) + (Number(currentRawInvoice.cess_amount || 0) > 0 ? 1 : 0) + (settings.fields.show_discount !== false ? 1 : 0) + 1} style={{ border: `1px solid ${primaryColor}`, padding: '8px', verticalAlign: 'top' }}></td>
                <td style={{ fontWeight: 'bold', textAlign: 'center', border: `1px solid ${primaryColor}`, padding: '8px', color: primaryColor, whiteSpace: 'nowrap' }}>Total</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', border: `1px solid ${primaryColor}`, padding: '8px', whiteSpace: 'nowrap' }}>₹ {invoice.subtotal}</td>
              </tr>
              {currentRawInvoice.tax_type === 'gst' ? (
                <>
                  <tr style={{ fontSize: '14px' }}>
                    <td style={{ fontWeight: 'bold', textAlign: 'center', border: `1px solid ${primaryColor}`, padding: '8px', color: primaryColor, whiteSpace: 'nowrap' }}>CGST</td>
                    <td style={{ textAlign: 'right', border: `1px solid ${primaryColor}`, padding: '8px', whiteSpace: 'nowrap' }}>₹ {Number(currentRawInvoice.cgst_amount || 0).toFixed(2)}</td>
                  </tr>
                  <tr style={{ fontSize: '14px' }}>
                    <td style={{ fontWeight: 'bold', textAlign: 'center', border: `1px solid ${primaryColor}`, padding: '8px', color: primaryColor, whiteSpace: 'nowrap' }}>SGST</td>
                    <td style={{ textAlign: 'right', border: `1px solid ${primaryColor}`, padding: '8px', whiteSpace: 'nowrap' }}>₹ {Number(currentRawInvoice.sgst_amount || 0).toFixed(2)}</td>
                  </tr>
                </>
              ) : (
                <tr style={{ fontSize: '14px' }}>
                  <td style={{ fontWeight: 'bold', textAlign: 'center', border: `1px solid ${primaryColor}`, padding: '8px', color: primaryColor, whiteSpace: 'nowrap' }}>IGST</td>
                  <td style={{ textAlign: 'right', border: `1px solid ${primaryColor}`, padding: '8px', whiteSpace: 'nowrap' }}>₹ {Number(currentRawInvoice.igst_amount || 0).toFixed(2)}</td>
                </tr>
              )}
              {Number(currentRawInvoice.cess_amount || 0) > 0 && (
                <tr style={{ fontSize: '14px' }}>
                  <td style={{ fontWeight: 'bold', textAlign: 'center', border: `1px solid ${primaryColor}`, padding: '8px', color: primaryColor, whiteSpace: 'nowrap' }}>CESS</td>
                  <td style={{ textAlign: 'right', border: `1px solid ${primaryColor}`, padding: '8px', whiteSpace: 'nowrap' }}>₹ {Number(currentRawInvoice.cess_amount || 0).toFixed(2)}</td>
                </tr>
              )}
              {settings.fields.show_discount !== false && (
                <tr style={{ fontSize: '14px' }}>
                  <td style={{ fontWeight: 'bold', textAlign: 'center', border: `1px solid ${primaryColor}`, padding: '8px', color: primaryColor, whiteSpace: 'nowrap' }}>Discount</td>
                  <td style={{ textAlign: 'right', border: `1px solid ${primaryColor}`, padding: '8px', whiteSpace: 'nowrap', color: '#ef4444' }}>- ₹ {invoice.discount}</td>
                </tr>
              )}
            </>
          ) : (
            <>
              <tr style={{ fontSize: '14px' }}>
                <td colSpan={totalColumns - 2} rowSpan={2} style={{ border: `1px solid ${primaryColor}`, padding: '8px', verticalAlign: 'top' }}></td>
                <td style={{ fontWeight: 'bold', textAlign: 'center', border: `1px solid ${primaryColor}`, padding: '8px', color: primaryColor, whiteSpace: 'nowrap' }}>Total</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', border: `1px solid ${primaryColor}`, padding: '8px', whiteSpace: 'nowrap' }}>₹ {invoice.subtotal}</td>
              </tr>
              <tr style={{ fontSize: '14px' }}>
                <td style={{ fontWeight: 'bold', textAlign: 'center', border: `1px solid ${primaryColor}`, padding: '8px', color: primaryColor, whiteSpace: 'nowrap' }}>Tax Amount</td>
                <td style={{ textAlign: 'right', border: `1px solid ${primaryColor}`, padding: '8px', whiteSpace: 'nowrap' }}>₹ {invoice.tax}</td>
              </tr>
            </>
          )}
          
          <tr>
            <td colSpan={totalColumns - 1} style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '16px', border: `1px solid ${primaryColor}`, padding: '10px', backgroundColor: `${primaryColor}10`, color: primaryColor, whiteSpace: 'nowrap' }}>GRAND TOTAL</td>
            <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '16px', border: `1px solid ${primaryColor}`, padding: '10px', backgroundColor: `${primaryColor}10`, color: primaryColor, whiteSpace: 'nowrap' }}>₹ {invoice.total}</td>
          </tr>
          
          {settings.fields.show_amount_in_words !== false && (
            <tr>
              <td colSpan={totalColumns} style={{ fontWeight: 'bold', fontSize: '13px', border: `1px solid ${primaryColor}`, padding: '8px', color: primaryColor }}>
                Rupees in Word: <span style={{ fontWeight: '600', textTransform: 'capitalize', color: '#1e293b' }}>{invoice.amount_in_words || 'Eight Thousand Two Hundred Sixty only.'}</span>
              </td>
            </tr>
          )}

          <tr>
            <td colSpan={leftColSpan} style={{ border: `1px solid ${primaryColor}`, padding: '10px', height: '100px', verticalAlign: 'top' }}>
              {settings.fields.show_terms !== false && !settings.fields.terms_on_new_page && (
                <>
                  <p style={{ fontWeight: 'bold', margin: '0 0 6px 0', fontSize: '13px', color: primaryColor }}>Category of Service / Terms:</p>
                  <p style={{ fontSize: '12px', margin: '4px 0', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{invoice.terms}</p>
                </>
              )}
            </td>
            <td colSpan={rightColSpan} style={{ border: `1px solid ${primaryColor}`, padding: '10px', verticalAlign: 'top' }}>
              {settings.fields.show_bank_details !== false && (
                <>
                  <p style={{ fontWeight: 'bold', margin: '0 0 6px 0', fontSize: '13px', color: primaryColor }}>Bank Details:</p>
                  <p style={{ fontSize: '12px', margin: '4px 0', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{invoice.bank_details}</p>
                </>
              )}
            </td>
          </tr>

          <tr>
            <td colSpan={leftColSpan} style={{ border: `1px solid ${primaryColor}`, padding: '10px', height: '90px', verticalAlign: 'bottom', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%' }}>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <p style={{ fontSize: '12px', textAlign: 'left', margin: '0 0 24px 0', color: '#475569' }}>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                  {settings.fields.show_receiver_signature !== false && (
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor }}>Customer's Seal And Signature</span>
                  )}
                </div>
                {settings.fields.show_qr_code !== false && invoice.uuid && (
                  <div style={{ textAlign: 'center', marginLeft: '15px' }}>
                    <QRCode value={`${window.location.origin}/invoice/${invoice.uuid}`} size={64} level="M" />
                    <p style={{ fontSize: '11px', margin: '4px 0 0 0', fontWeight: '500', color: primaryColor }}>Scan to View</p>
                  </div>
                )}
              </div>
            </td>
            <td colSpan={rightColSpan} style={{ border: `1px solid ${primaryColor}`, padding: '10px', verticalAlign: 'bottom', textAlign: 'right' }}>
              {settings.fields.show_signature !== false ? (
                <div style={{ marginBottom: '5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  {settings.signature_image && (
                    <img src={settings.signature_image} alt="Signature" style={{ maxHeight: '60px', marginBottom: '5px' }} />
                  )}
                  <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '14px', color: primaryColor }}>{settings.signature_label || 'Authorized Signatory'}</p>
                  <p style={{ fontSize: '12px', margin: 0, color: '#475569' }}>For {business.name}</p>
                </div>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

  const renderModernTemplate = () => (
    <div style={{ maxWidth: isPrintView ? 'none' : '800px', margin: 'auto', color: '#334155', width: '100%' }}>

      <div style={{ display: 'flex', marginBottom: '30px' }}>
        <div style={{ width: '50%' }}>
          {settings.fields.show_logo !== false && business.logo && (
            <img src={business.logo} style={{ maxHeight: settings.fields.logo_size ? `${settings.fields.logo_size}px` : '60px', marginBottom: '10px', objectFit: 'contain' }} alt="Logo" />
          )}
          <h2 style={{ color: primaryColor, margin: '0 0 5px 0', fontSize: '24px' }}>{business.name}</h2>
          <p style={{ margin: 0, lineHeight: 1.5, fontSize: '0.85em', color: secondaryColor }}>
            {business.address}<br />
            Phone: {business.phone}
            {settings.fields.show_gstin !== false && <><br />GSTIN: {business.gstin}</>}
          </p>
          {renderCustomFields(secondaryColor)}
        </div>
        <div style={{ width: '50%', textAlign: 'right' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', letterSpacing: '2px', color: borderColor }}>{invoice.type || 'INVOICE'}</h1>
          <div style={{ display: 'inline-block', textAlign: 'left', minWidth: '200px', padding: '15px', borderRadius: `${borderRadius}px`, border: frameStyle !== 'none' ? `1px ${frameStyle} ${borderColor}` : 'none', backgroundColor: '#f8fafc' }}>
            <p style={{ margin: '0 0 5px 0' }}><span style={{ fontSize: '0.85em', color: secondaryColor }}>Invoice No:</span><br /> <span style={{ fontWeight: 'bold' }}>{invoice.invoice_number}</span></p>
            {settings.fields.show_reference_number !== false && (
              <p style={{ margin: '0 0 5px 0' }}><span style={{ fontSize: '0.85em', color: secondaryColor }}>Ref No:</span><br /> <span style={{ fontWeight: 'bold' }}>{invoice.reference_number}</span></p>
            )}
            <p style={{ margin: '0 0 5px 0' }}><span style={{ fontSize: '0.85em', color: secondaryColor }}>Date:</span><br /> <span style={{ fontWeight: 'bold' }}>{invoice.date}</span></p>
            {settings.fields.show_due_date !== false && (
              <p style={{ margin: 0 }}><span style={{ fontSize: '0.85em', color: secondaryColor }}>Due Date:</span><br /> <span style={{ fontWeight: 'bold' }}>{invoice.due_date}</span></p>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', marginBottom: '30px', justifyContent: 'space-between' }}>
        <div style={{ width: '48%', padding: '15px', borderRadius: `${borderRadius}px`, border: frameStyle !== 'none' ? `1px ${frameStyle} ${borderColor}` : 'none', backgroundColor: '#f8fafc' }}>
          <p style={{ color: primaryColor, fontWeight: 'bold', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>Billed To</p>
          <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', fontSize: '16px' }}>{invoice.customer_name}</p>
          <p style={{ fontSize: '0.85em', color: secondaryColor, margin: 0, lineHeight: 1.5 }}>
            {invoice.customer_address}
            {settings.fields.show_customer_phone !== false && <><br />Phone: {invoice.customer_phone}</>}
            {settings.fields.show_gstin !== false && <><br />GSTIN: {invoice.customer_gstin}</>}
          </p>
        </div>
        <div style={{ width: '48%', padding: '15px', borderRadius: `${borderRadius}px`, border: frameStyle !== 'none' ? `1px ${frameStyle} ${borderColor}` : 'none', backgroundColor: '#f8fafc' }}>
          <p style={{ color: primaryColor, fontWeight: 'bold', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>Order Details</p>
          <p style={{ fontSize: '0.85em', color: secondaryColor, margin: 0, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 'bold' }}>Type:</span> {invoice.type}<br />
            {settings.fields.show_place_of_supply !== false && <><span style={{ fontWeight: 'bold' }}>Place of Supply:</span> {invoice.place_of_supply}<br /></>}
            {settings.fields.show_vehicle_info !== false && (
              <>
                <span style={{ fontWeight: 'bold' }}>Vehicle:</span> {invoice.vehicle_number}<br />
                <span style={{ fontWeight: 'bold' }}>Driver:</span> {invoice.driver_name}
              </>
            )}
          </p>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', border: frameStyle !== 'none' ? `1px ${frameStyle} ${borderColor}` : 'none', borderRadius: `${borderRadius}px`, overflow: 'hidden' }}>
        <thead style={{ backgroundColor: primaryColor, color: '#fff' }}>
          <tr>
            <th style={{ fontWeight: 700, padding: '12px 10px', textAlign: 'left' }}>Description</th>
            {settings.fields.show_hsn !== false && <th style={{ fontWeight: 700, padding: '12px 10px', textAlign: 'left' }}>HSN</th>}
            {settings.fields.show_qty !== false && <th style={{ fontWeight: 700, padding: '12px 10px', textAlign: 'right' }}>Qty</th>}
            {settings.fields.show_rate !== false && <th style={{ fontWeight: 700, padding: '12px 10px', textAlign: 'right' }}>Rate</th>}
            {settings.fields.show_tax_breakdown !== false && <th style={{ fontWeight: 700, padding: '12px 10px', textAlign: 'right' }}>Tax</th>}
            <th style={{ fontWeight: 700, padding: '12px 10px', textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item: any, index: number) => (
            <tr key={index} style={{ borderBottom: index < invoice.items.length - 1 ? `1px ${frameStyle === 'none' ? 'solid' : frameStyle} ${borderColor}` : 'none' }}>
              <td style={{ padding: '12px 10px' }}><span style={{ fontWeight: 'bold' }}>{item.name}</span></td>
              {settings.fields.show_hsn !== false && <td style={{ padding: '12px 10px', fontSize: '0.85em', color: secondaryColor }}>{item.hsn}</td>}
              {settings.fields.show_qty !== false && <td style={{ padding: '12px 10px', textAlign: 'right' }}>{item.qty} {item.unit}</td>}
              {settings.fields.show_rate !== false && <td style={{ padding: '12px 10px', textAlign: 'right' }}>{item.rate}</td>}
              {settings.fields.show_tax_breakdown !== false && <td style={{ padding: '12px 10px', textAlign: 'right' }}>{item.tax}</td>}
              <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', color: primaryColor }}>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50%', paddingRight: '20px' }}>
          {settings.fields.show_amount_in_words !== false && (
            <>
              <p style={{ fontSize: '0.85em', color: secondaryColor, margin: '0 0 5px 0' }}>Amount in Words</p>
              <p style={{ color: primaryColor, fontWeight: 'bold', margin: '0 0 20px 0', textTransform: 'capitalize' }}>Eight Thousand Two Hundred Sixty Rupees Only</p>
            </>
          )}

          {settings.fields.show_bank_details !== false && (
            <div style={{ padding: '15px', borderRadius: `${borderRadius}px`, border: frameStyle !== 'none' ? `1px ${frameStyle} ${borderColor}` : 'none', marginBottom: '20px', backgroundColor: '#f8fafc' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', fontSize: '11px', color: primaryColor }}>Payment Details</p>
              <p style={{ fontSize: '0.85em', color: secondaryColor, margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{invoice.bank_details}</p>
            </div>
          )}

          {settings.fields.show_terms !== false && !settings.fields.terms_on_new_page && (
            <>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', fontSize: '11px', color: primaryColor }}>Terms & Conditions</p>
              <p style={{ fontSize: '0.85em', color: secondaryColor, margin: 0, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{invoice.terms}</p>
            </>
          )}
        </div>

        <div style={{ width: '300px' }}>
          <div style={{ padding: '15px', borderRadius: `${borderRadius}px`, border: frameStyle !== 'none' ? `2px ${frameStyle} ${borderColor}` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <div style={{ color: secondaryColor }}>Subtotal</div>
              <div style={{ fontWeight: 'bold' }}>₹ {invoice.subtotal}</div>
            </div>
            {settings.fields.show_tax_breakdown !== false && currentRawInvoice && currentRawInvoice.tax_type !== 'exempt' ? (
              <>
                {currentRawInvoice.tax_type === 'gst' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                      <div style={{ color: secondaryColor }}>CGST</div>
                      <div style={{ fontWeight: 'bold' }}>₹ {Number(currentRawInvoice.cgst_amount || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                      <div style={{ color: secondaryColor }}>SGST</div>
                      <div style={{ fontWeight: 'bold' }}>₹ {Number(currentRawInvoice.sgst_amount || 0).toFixed(2)}</div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <div style={{ color: secondaryColor }}>IGST</div>
                    <div style={{ fontWeight: 'bold' }}>₹ {Number(currentRawInvoice.igst_amount || 0).toFixed(2)}</div>
                  </div>
                )}
                {Number(currentRawInvoice.cess_amount || 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <div style={{ color: secondaryColor }}>CESS</div>
                    <div style={{ fontWeight: 'bold' }}>₹ {Number(currentRawInvoice.cess_amount || 0).toFixed(2)}</div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <div style={{ color: secondaryColor }}>Tax Amount</div>
                <div style={{ fontWeight: 'bold' }}>₹ {invoice.tax}</div>
              </div>
            )}
            {settings.fields.show_discount !== false && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <div style={{ color: secondaryColor }}>Discount</div>
                <div style={{ fontWeight: 'bold', color: '#ef4444' }}>- ₹ {invoice.discount}</div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0 5px 0', borderTop: `1px solid ${borderColor}`, marginTop: '10px', fontSize: '1.2em', color: primaryColor }}>
              <div style={{ fontWeight: 'bold' }}>Total Amount</div>
              <div style={{ fontWeight: 'bold' }}>₹ {invoice.total}</div>
            </div>
            
            {settings.fields.show_payment_breakdown !== false && currentRawInvoice?.payment_mode === 'Split' && currentRawInvoice?.payments?.length > 0 ? (
              <>
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ccc' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: secondaryColor, marginBottom: '5px' }}>Payment Breakdown</div>
                  {currentRawInvoice.payments.map((p: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: '12px' }}>
                      <div style={{ color: secondaryColor }}>{p.payment_mode}</div>
                      <div style={{ fontWeight: 'bold' }}>₹ {Number(p.amount).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', marginTop: '5px', fontSize: '13px' }}>
                  <div style={{ fontWeight: 'bold' }}>Amount Paid</div>
                  <div style={{ fontWeight: 'bold' }}>₹ {Number(currentRawInvoice.paid_amount || 0).toFixed(2)}</div>
                </div>
              </>
            ) : settings.fields.show_payment_breakdown !== false && currentRawInvoice ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 5px 0', marginTop: '5px', borderTop: '1px dashed #ccc', fontSize: '13px' }}>
                <div style={{ color: secondaryColor }}>Amount Paid {currentRawInvoice.payment_mode ? `(${currentRawInvoice.payment_mode})` : ''}</div>
                <div style={{ fontWeight: 'bold' }}>₹ {Number(currentRawInvoice.paid_amount || 0).toFixed(2)}</div>
              </div>
            ) : null}
            {settings.fields.show_payment_breakdown !== false && currentRawInvoice && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' }}>
                <div style={{ fontWeight: 'bold', color: secondaryColor }}>Balance Due</div>
                <div style={{ fontWeight: 'bold' }}>₹ {Number((currentRawInvoice.final_amount || 0) - (currentRawInvoice.paid_amount || 0)).toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, textAlign: 'left' }}>
          {settings.fields.show_qr_code !== false && invoice.uuid && (
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <QRCode value={`${window.location.origin}/invoice/${invoice.uuid}`} size={80} level="M" />
              <p style={{ fontSize: '9px', margin: '5px 0 0 0', color: secondaryColor }}>Scan to View Online</p>
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, textAlign: 'center' }}>
          {settings.fields.show_receiver_signature !== false && (
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: '60px' }}></div>
              <p style={{ fontWeight: 'bold', margin: 0, color: primaryColor }}>Receiver's Signature</p>
            </div>
          )}
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          {settings.fields.show_signature !== false && (
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              {settings.signature_image ? (
                <img src={settings.signature_image} alt="Signature" style={{ maxHeight: '60px', marginBottom: '5px', objectFit: 'contain' }} />
              ) : (
                <div style={{ borderBottom: `1px solid ${borderColor}`, width: '150px', marginBottom: '5px', height: '60px' }}></div>
              )}
              <p style={{ fontWeight: 'bold', margin: 0, color: primaryColor }}>{settings.signature_label || 'Authorized Signatory'}</p>
              <p style={{ fontSize: '0.85em', color: secondaryColor, margin: 0 }}>For {business.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPremiumTemplate = () => (
    <div style={{ maxWidth: isPrintView ? 'none' : '800px', margin: 'auto', width: '100%', fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif", color: '#1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `3px solid ${primaryColor}`, paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 5px 0', color: primaryColor, letterSpacing: '-0.5px' }}>{business.name}</h1>
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
              {business.address && <div>{business.address}</div>}
              {business.phone && <span>Mobile: {business.phone}</span>}
              {settings.fields.show_gstin !== false && business.gstin && <span> | GSTIN: {business.gstin}</span>}
            </div>
          </div>
          {settings.fields.show_logo !== false && business.logo && (
            <img src={business.logo} alt="Logo" style={{ maxHeight: settings.fields.logo_size ? `${settings.fields.logo_size}px` : '70px', maxWidth: '250px', objectFit: 'contain' }} />
          )}
        </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
          <p style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', margin: '0 0 10px 0', color: primaryColor, letterSpacing: '1px' }}>Billed To</p>
          <p style={{ fontWeight: '800', margin: '0 0 5px 0', fontSize: '16px', color: '#0f172a' }}>{invoice.customer_name}</p>
          <p style={{ margin: 0, lineHeight: 1.5, color: '#475569', fontSize: '13px' }}>
            {invoice.customer_address}
            {settings.fields.show_customer_phone !== false && <><br />Mobile: {invoice.customer_phone}</>}
            {settings.fields.show_gstin !== false && <><br />GSTIN: {invoice.customer_gstin}</>}
          </p>
        </div>
        
        <div style={{ flex: 1, padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Invoice No.</span>
            <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{invoice.invoice_number}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Invoice Date</span>
            <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{invoice.date}</span>
          </div>
          {settings.fields.show_due_date !== false && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Due Date</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{invoice.due_date}</span>
            </div>
          )}
          {settings.fields.show_reference_number !== false && invoice.reference_number && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>P.O. No.</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{invoice.reference_number}</span>
            </div>
          )}
        </div>
      </div>

      {(settings.fields.show_vehicle_info !== false && invoice.vehicle_number) || (settings.fields.show_place_of_supply !== false && invoice.place_of_supply) ? (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', padding: '15px 20px', border: `1px solid ${borderColor}`, borderRadius: '8px', fontSize: '13px' }}>
          {settings.fields.show_vehicle_info !== false && invoice.vehicle_number && (
            <div style={{ flex: 1 }}><strong>Vehicle No:</strong> {invoice.vehicle_number}</div>
          )}
          {settings.fields.show_place_of_supply !== false && invoice.place_of_supply && (
            <div style={{ flex: 1 }}><strong>Place of Supply:</strong> {invoice.place_of_supply}</div>
          )}
        </div>
      ) : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${primaryColor}` }}>
            <th style={{ padding: '12px 0', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item Description</th>
            {settings.fields.show_hsn !== false && <th style={{ padding: '12px 10px', textAlign: 'right', fontSize: '11px', fontWeight: '800', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>HSN</th>}
            {settings.fields.show_qty !== false && <th style={{ padding: '12px 10px', textAlign: 'right', fontSize: '11px', fontWeight: '800', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qty</th>}
            {settings.fields.show_rate !== false && <th style={{ padding: '12px 10px', textAlign: 'right', fontSize: '11px', fontWeight: '800', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rate</th>}
            {settings.fields.show_discount !== false && <th style={{ padding: '12px 10px', textAlign: 'right', fontSize: '11px', fontWeight: '800', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Disc.</th>}
            {settings.fields.show_tax_breakdown !== false && <th style={{ padding: '12px 10px', textAlign: 'right', fontSize: '11px', fontWeight: '800', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tax</th>}
            <th style={{ padding: '12px 0', textAlign: 'right', fontSize: '11px', fontWeight: '800', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item: any, index: number) => (
            <tr key={index} style={{ borderBottom: `1px solid ${borderColor}` }}>
              <td style={{ padding: '15px 0', textAlign: 'left' }}>
                <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{item.name}</div>
              </td>
              {settings.fields.show_hsn !== false && <td style={{ padding: '15px 10px', textAlign: 'right', color: '#64748b', fontSize: '13px' }}>{item.hsn}</td>}
              {settings.fields.show_qty !== false && <td style={{ padding: '15px 10px', textAlign: 'right', color: '#0f172a', fontSize: '13px', fontWeight: '500' }}>{item.qty} <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.unit}</span></td>}
              {settings.fields.show_rate !== false && <td style={{ padding: '15px 10px', textAlign: 'right', color: '#475569', fontSize: '13px' }}>{item.rate}</td>}
              {settings.fields.show_discount !== false && <td style={{ padding: '15px 10px', textAlign: 'right', color: '#475569', fontSize: '13px' }}>-</td>}
              {settings.fields.show_tax_breakdown !== false && <td style={{ padding: '15px 10px', textAlign: 'right', color: '#475569', fontSize: '13px' }}>{item.tax}</td>}
              <td style={{ padding: '15px 0', textAlign: 'right', color: '#0f172a', fontWeight: '700', fontSize: '14px' }}>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: '55%', paddingRight: '40px' }}>
          {settings.fields.show_terms !== false && !settings.fields.terms_on_new_page && (
            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', margin: '0 0 8px 0', color: primaryColor, letterSpacing: '0.5px' }}>Terms & Conditions</p>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#64748b', whiteSpace: 'pre-wrap', fontSize: '12px' }}>{settings.default_terms || invoice.terms}</p>
            </div>
          )}
          {settings.fields.show_bank_details !== false && (
            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', margin: '0 0 8px 0', color: primaryColor, letterSpacing: '0.5px' }}>Bank Details</p>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#64748b', whiteSpace: 'pre-wrap', fontSize: '12px' }}>{settings.default_bank_details || invoice.bank_details}</p>
            </div>
          )}
          {settings.fields.show_amount_in_words !== false && (
            <div>
              <p style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', margin: '0 0 5px 0', color: primaryColor, letterSpacing: '0.5px' }}>Amount in Words</p>
              <p style={{ fontSize: '13px', margin: 0, textTransform: 'capitalize', fontWeight: '600', color: '#0f172a' }}>INR {invoice.amount_in_words || 'Eight Thousand Two Hundred Sixty Only.'}</p>
            </div>
          )}
        </div>
        
        <div style={{ width: '45%' }}>
          <div style={{ padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
            <table style={{ width: '100%', fontSize: '13px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b' }}>Taxable Amount</td>
                  <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', color: '#0f172a' }}>₹ {invoice.subtotal}</td>
                </tr>
                {settings.fields.show_tax_breakdown !== false && currentRawInvoice && currentRawInvoice.tax_type !== 'exempt' ? (
                  <>
                    {currentRawInvoice.tax_type === 'gst' ? (
                      <>
                        <tr>
                          <td style={{ padding: '6px 0', color: '#64748b' }}>CGST</td>
                          <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', color: '#0f172a' }}>₹ {Number(currentRawInvoice.cgst_amount || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '6px 0', color: '#64748b' }}>SGST</td>
                          <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', color: '#0f172a' }}>₹ {Number(currentRawInvoice.sgst_amount || 0).toFixed(2)}</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td style={{ padding: '6px 0', color: '#64748b' }}>IGST</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', color: '#0f172a' }}>₹ {Number(currentRawInvoice.igst_amount || 0).toFixed(2)}</td>
                      </tr>
                    )}
                    {Number(currentRawInvoice.cess_amount || 0) > 0 && (
                      <tr>
                        <td style={{ padding: '6px 0', color: '#64748b' }}>CESS</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', color: '#0f172a' }}>₹ {Number(currentRawInvoice.cess_amount || 0).toFixed(2)}</td>
                      </tr>
                    )}
                  </>
                ) : (
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>Total Tax</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', color: '#0f172a' }}>₹ {invoice.tax}</td>
                  </tr>
                )}
                {settings.fields.show_discount !== false && (
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>Discount</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>- ₹ {invoice.discount}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2}>
                    <div style={{ height: '1px', backgroundColor: borderColor, margin: '15px 0' }}></div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 0', fontWeight: '800', color: primaryColor, fontSize: '16px' }}>Grand Total</td>
                  <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '800', fontSize: '18px', color: primaryColor, whiteSpace: 'nowrap' }}>₹ {invoice.total}</td>
                </tr>
                
                {settings.fields.show_payment_breakdown !== false && currentRawInvoice?.payment_mode === 'Split' && currentRawInvoice?.payments?.length > 0 ? (
                  <>
                    <tr>
                      <td colSpan={2} style={{ padding: '6px 0', color: '#64748b', fontSize: '11px', fontWeight: 'bold', borderTop: '1px dashed #ccc', marginTop: '5px' }}>Payment Breakdown</td>
                    </tr>
                    {currentRawInvoice.payments.map((p: any, i: number) => (
                      <tr key={i}>
                        <td style={{ padding: '2px 0', color: '#64748b', fontSize: '12px' }}>{p.payment_mode}</td>
                        <td style={{ padding: '2px 0', textAlign: 'right', fontWeight: '600', color: '#0f172a', fontSize: '12px' }}>₹ {Number(p.amount).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td style={{ padding: '6px 0', color: '#64748b', fontWeight: 'bold', fontSize: '13px', borderTop: '1px dashed #ccc' }}>Amount Paid</td>
                      <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold', color: '#0f172a', fontSize: '13px', borderTop: '1px dashed #ccc' }}>₹ {Number(currentRawInvoice.paid_amount || 0).toFixed(2)}</td>
                    </tr>
                  </>
                ) : settings.fields.show_payment_breakdown !== false && currentRawInvoice ? (
                  <tr>
                    <td style={{ padding: '10px 0 5px 0', color: '#64748b', borderTop: '1px dashed #ccc', marginTop: '5px' }}>Amount Paid {currentRawInvoice.payment_mode ? `(${currentRawInvoice.payment_mode})` : ''}</td>
                    <td style={{ padding: '10px 0 5px 0', textAlign: 'right', fontWeight: '600', color: '#0f172a', borderTop: '1px dashed #ccc', marginTop: '5px' }}>₹ {Number(currentRawInvoice.paid_amount || 0).toFixed(2)}</td>
                  </tr>
                ) : null}
                {settings.fields.show_payment_breakdown !== false && currentRawInvoice && (
                  <tr>
                    <td style={{ padding: '5px 0', fontWeight: 'bold', color: '#64748b' }}>Balance Due</td>
                    <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>₹ {Number((currentRawInvoice.final_amount || 0) - (currentRawInvoice.paid_amount || 0)).toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, textAlign: 'left' }}>
          {settings.fields.show_qr_code !== false && invoice.uuid && (
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <QRCode value={`${window.location.origin}/invoice/${invoice.uuid}`} size={80} level="M" />
              <p style={{ fontSize: '10px', margin: '8px 0 0 0', color: '#64748b', fontWeight: '500' }}>Scan to Verify</p>
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, textAlign: 'center' }}>
          {settings.fields.show_receiver_signature !== false && (
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: '60px' }}></div>
              <p style={{ fontWeight: 'bold', margin: 0, color: primaryColor, fontSize: '14px' }}>Receiver's Signature</p>
            </div>
          )}
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          {settings.fields.show_signature !== false && (
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              {settings.signature_image ? (
                <div style={{ marginBottom: '8px' }}>
                  <img src={settings.signature_image} style={{ maxHeight: '60px', maxWidth: '160px', objectFit: 'contain' }} alt="Signature" />
                </div>
              ) : (
                <div style={{ borderBottom: `1px solid ${borderColor}`, width: '160px', marginBottom: '8px', height: '60px' }}></div>
              )}
              <div style={{ fontWeight: '800', fontSize: '14px', color: primaryColor, marginBottom: '2px' }}>{settings.signature_label || 'Authorized Signatory'}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>For {business.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderWatermark = () => {
    return (
      <>
        {settings.background_image && (
          <div className="print:!fixed" style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0.1
          }}>
            <img src={settings.background_image} style={{ width: `${settings.fields.watermark_size || 80}%`, height: `${settings.fields.watermark_size || 80}%`, objectFit: 'contain' }} alt="Background Logo" />
          </div>
        )}
        
        {settings.fields.show_watermark && (
          <div className="print:!fixed" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            fontSize: `${settings.fields.watermark_size || 80}px`,
            color: 'rgba(0, 0, 0, 0.04)',
            zIndex: 1,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            width: '100%',
          }}>
            {settings.fields.watermark_use_document_type 
              ? (invoice.type || 'INVOICE') 
              : (settings.fields.watermark_text || business.name)}
          </div>
        )}
      </>
    );
  };

  const renderInnerContent = () => (
    <div style={{ ...contentStyle, position: 'relative', zIndex: 10 }}>
      {settings.template === 'modern' && renderModernTemplate()}
      {settings.template === 'classic' && renderClassicTemplate()}
      {settings.template === 'default' && renderDefaultTemplate()}
      {settings.template === 'premium' && renderPremiumTemplate()}
      
      {settings.fields.show_terms !== false && settings.fields.terms_on_new_page && (
        <div style={{ pageBreakBefore: 'always', marginTop: '30px', paddingTop: '30px', borderTop: `2px solid ${primaryColor}` }}>
          <h2 style={{ color: primaryColor, textAlign: 'center', marginBottom: '20px', fontSize: '24px', textTransform: 'uppercase', fontWeight: 'bold' }}>Terms & Conditions / Annexure</h2>
          <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#334155', marginBottom: '60px', padding: '0 20px' }}>
            {invoice.terms}
          </div>
          
          {settings.fields.show_signature !== false && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '50px', paddingRight: '20px' }}>
              <div style={{ textAlign: 'center', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                {settings.signature_image ? (
                  <img src={settings.signature_image} alt="Signature" style={{ maxHeight: '80px', marginBottom: '10px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ borderBottom: '1px solid #94a3b8', width: '200px', height: '80px', marginBottom: '10px' }}></div>
                )}
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: primaryColor, fontSize: '16px' }}>{settings.signature_label || 'Authorized Signatory'}</p>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>For {business.name}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderHeaderImage = () => settings.header_image ? (
    <img src={settings.header_image} style={{ width: '100%', display: 'block', objectFit: 'cover', position: 'relative', zIndex: 10 }} alt="Header" />
  ) : null;

  const renderFooterImage = () => settings.footer_image ? (
    <img src={settings.footer_image} style={{ width: '100%', display: 'block', objectFit: 'cover' }} alt="Footer" />
  ) : null;

  const content = isPrintView ? (
    <>
      {renderWatermark()}
      <table style={{ 
        width: '100%', 
      borderCollapse: 'collapse', 
      fontFamily: previewStyle.fontFamily,
      fontSize: previewStyle.fontSize,
      lineHeight: previewStyle.lineHeight,
      color: previewStyle.color,
      minHeight: 'auto', 
      backgroundColor: '#fff', 
      margin: 0, 
      padding: 0,
      border: frameBorder,
      backgroundImage: frameBgImage !== 'none' ? frameBgImage : undefined,
      backgroundPosition: frameBgPos,
      backgroundSize: frameBgSize,
      backgroundRepeat: frameBgRepeat as any,
    }}>
      <thead>
        <tr>
          <td style={{ padding: `${framePadding} ${framePadding} 15px ${framePadding}`, margin: 0, border: 'none' }}>
            {renderHeaderImage()}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: `0 ${framePadding}`, margin: 0, border: 'none', position: 'relative', height: '100%' }}>
            {renderInnerContent()}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td style={{ padding: `15px ${framePadding} ${framePadding} ${framePadding}`, margin: 0, border: 'none' }}>
            {renderFooterImage()}
          </td>
        </tr>
      </tfoot>
      </table>
    </>
  ) : (
    <div 
      className="bg-white shadow-xl origin-top"
      style={{
        ...previewStyle,
        transform: 'scale(0.8)',
        marginBottom: '-20%',
        border: frameBorder,
        padding: framePadding,
        backgroundImage: frameBgImage !== 'none' ? frameBgImage : undefined,
        backgroundPosition: frameBgPos,
        backgroundSize: frameBgSize,
        backgroundRepeat: frameBgRepeat as any
      }}
    >
      {renderHeaderImage()}
      {renderWatermark()}
      {renderInnerContent()}
      <div style={{ marginTop: 'auto', position: 'relative', zIndex: 10 }}>
        {renderFooterImage()}
      </div>
    </div>
  );

  if (isPrintView) {
    return content;
  }

  return (
    <div className="w-full h-full overflow-auto bg-slate-100 flex justify-center items-start p-4 md:p-8 custom-scrollbar">
      {content}
    </div>
  );
};
