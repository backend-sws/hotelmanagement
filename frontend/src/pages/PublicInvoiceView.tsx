import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import InvoiceLivePreview from '../features/business/settings/components/InvoiceLivePreview';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const PublicInvoiceView = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data?.sale?.invoice_type || 'Invoice'}_${data?.sale?.invoice_number || 'Download'}`,
    pageStyle: `@page { size: A4; margin: 10mm; } @media print { body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; } }`
  });

  useEffect(() => {
    if (!loading && data && !error) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('print') === 'true') {
        setTimeout(() => {
          handlePrint();
        }, 500);
      }
    }
  }, [loading, data, error, handlePrint]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/public/invoice/${uuid}`);
        setData(response.data);
      } catch (err: any) {
        setError('Invoice not found or link is invalid.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [uuid]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p>Loading invoice...</p></div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-red-100 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error</h2>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  const { sale, business, settings } = data;

  const formattedInvoice = {
    invoice_number: sale.invoice_number,
    date: new Date(sale.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    due_date: sale.due_date ? new Date(sale.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null,
    customer_name: sale.customer ? sale.customer.name : 'Walk-in Customer',
    customer_address: sale.customer ? sale.customer.address : '',
    customer_phone: sale.customer ? sale.customer.phone : '',
    customer_gstin: sale.customer ? sale.customer.gstin : '',
    type: sale.invoice_type.replace('_', ' ').toUpperCase(),
    place_of_supply: sale.place_of_supply,
    vehicle_number: sale.vehicle_number,
    driver_name: sale.driver_name,
    reference_number: sale.reference_number || '',
    items: sale.items.map((item: any) => ({
      name: item.product ? (item.product.name || item.product.model_name || item.product.item_code || 'Item') : 'Item',
      hsn: item.product ? (item.product.hsn_code || item.hsn_code) : item.hsn_code,
      qty: item.quantity,
      unit: item.unit || (item.product ? item.product.unit : 'PCS') || 'PCS',
      rate: parseFloat(item.rate || item.unit_price || 0).toFixed(2),
      tax: parseFloat((item.cgst_amount || 0) + (item.sgst_amount || 0) + (item.igst_amount || 0)).toFixed(2),
      amount: parseFloat(item.amount || item.subtotal || 0).toFixed(2)
    })),
    subtotal: parseFloat(sale.taxable_amount).toFixed(2),
    tax: parseFloat(sale.total_tax_amount).toFixed(2),
    discount: parseFloat(sale.discount || 0).toFixed(2),
    total: parseFloat(sale.final_amount).toFixed(2),
    amount_in_words: sale.amount_in_words || '',
    terms: sale.terms_conditions || settings?.default_terms || '1. Goods once sold will not be taken back.\n2. Subject to local jurisdiction.',
    bank_details: sale.bank_details || settings?.default_bank_details || (business?.bank_settings ? `Bank Name: ${business.bank_settings.bank_name}\nAcct No: ${business.bank_settings.account_number}\nIFSC: ${business.bank_settings.ifsc_code}` : ''),
    uuid: sale.uuid
  };

  const getImageUrl = (path: any) => {
    if (!path) return null;
    if (typeof path === 'string' && path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:8000';
    return `${baseUrl}/storage/${path}`;
  };

  const formattedBusiness = {
    name: business.name,
    address: business.address,
    phone: business.phone,
    email: business.email,
    gstin: business?.gst_settings?.gstin,
    logo: getImageUrl(business.logo_path) || getImageUrl(business?.settings?.whitelabel_logo) || null
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 font-sans print:bg-white print:p-0 print:py-0 print:m-0">
      
      <div className="max-w-4xl mx-auto mb-6 print:hidden flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-800">{formattedInvoice.type || 'Invoice'} {sale.invoice_number}</h1>
          <p className="text-sm text-slate-500">From {business.name}</p>
        </div>
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Printer size={16} />
          <span>Download / Print PDF</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl border border-slate-200 print:shadow-none print:border-none print:max-w-none print:w-full print:m-0">
        <div ref={componentRef} className="w-full mx-auto bg-white p-8 print:p-0">
          <InvoiceLivePreview
            settings={settings}
            business={formattedBusiness}
            invoice={formattedInvoice}
            isPrintView={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PublicInvoiceView;
