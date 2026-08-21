import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../api/invoiceService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Send, ArrowLeft, ArrowRightLeft, Pencil, Trash2, Ban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { toast } from 'sonner';
import { GST_STATES } from '@/features/business/customers/constants/gstStates';
import { useInvoiceSettings } from '@/features/business/settings/api/useInvoiceSettings';
import InvoiceLivePreview from '@/features/business/settings/components/InvoiceLivePreview';
import { numberToIndianWords } from '@/lib/formatters';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { data: invoice, isLoading, refetch } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.get(Number(id))
  });

  const { data: settings, isLoading: isSettingsLoading } = useInvoiceSettings();

  const deleteMutation = useMutation({
    mutationFn: () => invoiceService.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices-stats'] });
      toast.success('Invoice deleted successfully');
      setIsDeleteModalOpen(false);
      navigate('/invoices');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete invoice')
  });

  const cancelMutation = useMutation({
    mutationFn: () => invoiceService.cancel(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices-stats'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      toast.success('Invoice cancelled successfully. Stock & ledger reverted.');
      setIsCancelModalOpen(false);
      refetch();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to cancel invoice')
  });

  const handlePdf = async () => {
    if (!invoice.uuid) {
      toast.error('Invoice UUID missing');
      return;
    }
    window.open(`/invoice/${invoice.uuid}`, '_blank');
  };

  const handleWhatsapp = async () => {
    try {
      const res = await invoiceService.getWhatsappUrl(Number(id));
      window.open(res.whatsapp_url, '_blank');
    } catch {
      toast.error('Failed to open WhatsApp');
    }
  };

  const handleConvert = async () => {
    try {
      await invoiceService.convert(Number(id));
      toast.success('Document converted successfully');
      refetch();
    } catch {
      toast.error('Failed to convert document');
    }
  };

  if (isLoading || isSettingsLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>;
  }

  if (!invoice) return <div>Not found</div>;

  const formatType = (t: string) => t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const getImageUrl = (path: any) => {
    if (!path) return null;
    if (typeof path === 'string' && path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:8000';
    return `${baseUrl}/storage/${path}`;
  };

  const formattedBusiness = invoice.business ? {
    name: invoice.business.name,
    address: invoice.business.address,
    phone: invoice.business.phone,
    email: invoice.business.email,
    gstin: invoice.business?.gst_number || invoice.business?.gstin || invoice.business?.gst_settings?.gstin || '',
    logo: getImageUrl(invoice.business.logo_path) || getImageUrl(invoice.business?.settings?.whitelabel_logo) || null
  } : undefined;

  const formattedInvoice = {
    invoice_number: invoice.invoice_number,
    date: new Date(invoice.created_at || invoice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    due_date: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null,
    customer_name: invoice.customer ? invoice.customer.name : 'Walk-in Customer',
    customer_address: invoice.customer ? invoice.customer.address : '',
    customer_phone: invoice.customer ? invoice.customer.phone : '',
    customer_gstin: invoice.customer ? invoice.customer.gstin : '',
    type: invoice.invoice_type.replace('_', ' ').toUpperCase(),
    place_of_supply: invoice.place_of_supply,
    vehicle_number: invoice.vehicle_number,
    driver_name: invoice.driver_name,
    reference_number: invoice.reference_number || '',
    items: invoice.items.map((item: any) => ({
      name: item.name || (item.product ? (item.product.name || item.product.model_name || item.product.item_code || 'Item') : 'Item'),
      hsn: item.hsn_code || (item.product ? item.product.hsn_code : ''),
      qty: item.quantity,
      unit: item.unit || (item.product ? item.product.unit : 'PCS') || 'PCS',
      rate: parseFloat(item.rate || item.unit_price || 0).toFixed(2),
      tax: parseFloat((item.cgst_amount || 0) + (item.sgst_amount || 0) + (item.igst_amount || 0) + (item.cess_amount || 0)).toFixed(2),
      amount: parseFloat(item.amount || item.subtotal || 0).toFixed(2)
    })),
    subtotal: parseFloat(invoice.taxable_amount).toFixed(2),
    tax: parseFloat(invoice.total_tax_amount || (Number(invoice.cgst_amount || 0) + Number(invoice.sgst_amount || 0) + Number(invoice.igst_amount || 0))).toFixed(2),
    discount: parseFloat(invoice.discount || 0).toFixed(2),
    total: parseFloat(invoice.final_amount).toFixed(2),
    amount_in_words: invoice.amount_in_words || numberToIndianWords(invoice.final_amount),
    terms: invoice.terms_conditions || settings?.default_terms || '1. Goods once sold will not be taken back.\n2. Subject to local jurisdiction.',
    bank_details: invoice.bank_details || settings?.default_bank_details || (invoice.business?.bank_settings ? `Bank Name: ${invoice.business.bank_settings.bank_name}\nAcct No: ${invoice.business.bank_settings.account_number}\nIFSC: ${invoice.business.bank_settings.ifsc_code}` : ''),
    uuid: invoice.uuid
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-14">
      <div className="flex flex-wrap gap-4 items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate('/invoices')}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold">{formatType(invoice.invoice_type)} #{invoice.invoice_number}</h1>
        {(invoice.status === 'completed' || invoice.status === 'paid') && <Badge className="bg-emerald-500">Paid</Badge>}
        {(invoice.status === 'partially_paid' || invoice.status === 'partial') && <Badge className="bg-amber-500">Partially Paid</Badge>}
        {(invoice.status === 'pending' || invoice.status === 'unpaid') && <Badge className="bg-rose-500">Unpaid</Badge>}
        {(invoice.status === 'converted' || invoice.converted_at) && <Badge className="bg-blue-500">Converted</Badge>}
        {invoice.status === 'cancelled' && <Badge className="bg-red-600">Cancelled</Badge>}
        {(invoice.status === 'draft' && !invoice.converted_at) && <Badge variant="outline">Draft</Badge>}

        <div className="ml-auto flex flex-wrap gap-2">
          {['proforma', 'quotation', 'delivery_challan'].includes(invoice.invoice_type) && !invoice.converted_at && invoice.status !== 'cancelled' && (
            <Button onClick={handleConvert} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              <ArrowRightLeft className="h-4 w-4 mr-2" /> Convert to Invoice
            </Button>
          )}
          {invoice.status !== 'cancelled' && (
            <Button variant="outline" onClick={() => navigate(`/invoices/new?edit=${invoice.id}`)} className="border-amber-500/30 text-amber-600 hover:bg-amber-500/10 font-bold">
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
          <Button variant="outline" onClick={handlePdf} className="font-bold"><Printer className="h-4 w-4 mr-2" /> Print</Button>
          <Button onClick={handleWhatsapp} className="bg-green-100 text-green-700 hover:bg-green-200 border-0 font-bold">
            <Send className="h-4 w-4 mr-2" /> WhatsApp
          </Button>
          {invoice.status !== 'cancelled' && (
            <Button 
              variant="outline" 
              onClick={() => setIsCancelModalOpen(true)} 
              className="border-red-600/30 text-red-600 hover:bg-red-500/10 font-bold"
            >
              <Ban className="h-4 w-4 mr-2" /> Cancel Invoice
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => setIsDeleteModalOpen(true)} 
            className="border-rose-600/30 text-rose-600 hover:bg-rose-500/10 font-bold"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      {invoice.status === 'cancelled' && (
        <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-500/40 text-red-700 dark:text-red-400 p-4 rounded-2xl flex items-center justify-between font-bold text-sm shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-base text-red-800 dark:text-red-300">Invoice Cancelled</div>
              <div className="text-xs text-red-600/90 dark:text-red-400/90 font-medium">
                Deducted stock has been restored to inventory and customer ledger entries have been reverted.
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs uppercase tracking-wider font-extrabold shadow-sm">
            CANCELLED
          </span>
        </div>
      )}

      <div className="relative">
        {invoice.converted_at && (
          <div className="absolute top-4 right-4 z-50 bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
            Converted to Invoice
          </div>
        )}

        <div className="w-full mx-auto bg-white overflow-hidden shadow-xl border border-slate-200">
          <InvoiceLivePreview
            settings={settings}
            business={formattedBusiness}
            invoice={formattedInvoice}
            rawInvoice={invoice}
            isPrintView={false}
          />
        </div>
      </div>

      {/* Cancel Invoice Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancel Invoice"
        description={`Are you sure you want to cancel invoice #${invoice.invoice_number}? Deducted inventory stock will be restored, customer ledger balance will be reverted, and this invoice will be marked as CANCELLED.`}
        confirmText="Confirm Cancel"
        isLoading={cancelMutation.isPending}
      />

      {/* Delete Invoice Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice #${invoice.invoice_number}? It will be removed and excluded from all revenue reports and statistics.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
