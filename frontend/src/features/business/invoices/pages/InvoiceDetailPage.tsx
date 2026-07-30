import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '../api/invoiceService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Send, ArrowLeft, ArrowRightLeft, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { GST_STATES } from '@/features/business/customers/constants/gstStates';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: invoice, isLoading, refetch } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.get(Number(id))
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

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>;
  }

  if (!invoice) return <div>Not found</div>;

  const formatType = (t: string) => t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-14">
      <div className="flex gap-4 items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate('/invoices')}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold">{formatType(invoice.invoice_type)} #{invoice.invoice_number}</h1>
        {invoice.status === 'completed' && <Badge className="bg-green-500">Completed</Badge>}
        {invoice.status === 'pending' && <Badge className="bg-red-500">Pending</Badge>}
        {invoice.status === 'draft' && <Badge variant="outline">Draft</Badge>}
        
        <div className="ml-auto flex gap-2">
          {['proforma', 'quotation', 'delivery_challan'].includes(invoice.invoice_type) && !invoice.converted_at && (
            <Button onClick={handleConvert} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <ArrowRightLeft className="h-4 w-4 mr-2" /> Convert to Invoice
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate(`/invoices/new?edit=${invoice.id}`)} className="border-amber-500/30 text-amber-600 hover:bg-amber-500/10">
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="outline" onClick={handlePdf}><Printer className="h-4 w-4 mr-2" /> PDF</Button>
          <Button onClick={handleWhatsapp} className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
            <Send className="h-4 w-4 mr-2" /> WhatsApp
          </Button>
        </div>
      </div>

      <Card className="p-8 relative">
        {invoice.converted_at && (
          <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-medium">
            Converted to Invoice
          </div>
        )}
        
        {/* Invoice Web View matching the PDF style */}
        <div className="flex justify-between border-b pb-6">
          <div>
            <h2 className="text-xl font-bold uppercase">{invoice.business?.name || 'Company Name'}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{invoice.business?.address}</p>
            <p className="text-muted-foreground">GSTIN: {invoice.business?.gst_settings?.gstin || 'N/A'}</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-200 dark:text-gray-800 uppercase">{formatType(invoice.invoice_type)}</h1>
            <p className="font-medium mt-2">No: {invoice.invoice_number}</p>
            <p className="text-muted-foreground">Date: {invoice.date}</p>
            {invoice.due_date && <p className="text-muted-foreground">Due Date: {invoice.due_date}</p>}
          </div>
        </div>

        <div className="py-6 border-b flex justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">Billed To</p>
            <p className="font-bold">{invoice.customer?.name || 'Cash Customer'}</p>
            {invoice.customer && (
              <>
                <p className="text-muted-foreground whitespace-pre-wrap">{invoice.customer.address}</p>
                <p className="text-muted-foreground">Phone: {invoice.customer.phone}</p>
                <p className="text-muted-foreground">GSTIN: {invoice.customer.gstin || 'URD'}</p>
                <p className="text-muted-foreground">State: {(() => {
                  if (!invoice.place_of_supply) return 'N/A';
                  const codeStr = String(invoice.place_of_supply).padStart(2, '0');
                  const found = GST_STATES.find(s => s.code === codeStr);
                  return found ? `${found.code} - ${found.name}` : invoice.place_of_supply;
                })()}</p>
              </>
            )}
          </div>
          <div className="text-right">
            {invoice.vehicle_number && (
              <p><span className="text-muted-foreground">Vehicle No:</span> {invoice.vehicle_number}</p>
            )}
            {invoice.driver_name && (
              <p><span className="text-muted-foreground">Driver Name:</span> {invoice.driver_name}</p>
            )}
          </div>
        </div>

        <div className="py-6">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-y">
              <tr>
                <th className="py-3 px-2 text-left font-medium">Item Description</th>
                <th className="py-3 px-2 text-left font-medium">HSN</th>
                <th className="py-3 px-2 text-right font-medium">Qty</th>
                <th className="py-3 px-2 text-right font-medium">Rate</th>
                <th className="py-3 px-2 text-right font-medium">Taxable</th>
                {invoice.tax_type === 'gst' ? (
                  <>
                    <th className="py-3 px-2 text-right font-medium">CGST</th>
                    <th className="py-3 px-2 text-right font-medium">SGST</th>
                  </>
                ) : (
                  <th className="py-3 px-2 text-right font-medium">IGST</th>
                )}
                <th className="py-3 px-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="border-b">
              {invoice.items.map((item: any, i: number) => (
                <tr key={i} className="border-b border-muted/20">
                  <td className="py-3 px-2">{item.product?.name || 'Item'}</td>
                  <td className="py-3 px-2">{item.hsn_code || '-'}</td>
                  <td className="py-3 px-2 text-right">{Number(item.quantity)} {item.unit}</td>
                  <td className="py-3 px-2 text-right">₹{Number(item.rate).toFixed(2)}</td>
                  <td className="py-3 px-2 text-right">₹{Number(item.taxable_amount).toFixed(2)}</td>
                  
                  {invoice.tax_type === 'gst' ? (
                    <>
                      <td className="py-3 px-2 text-right">₹{Number(item.cgst_amount).toFixed(2)}<br/><span className="text-[10px] text-muted-foreground">({item.gst_rate/2}%)</span></td>
                      <td className="py-3 px-2 text-right">₹{Number(item.sgst_amount).toFixed(2)}<br/><span className="text-[10px] text-muted-foreground">({item.gst_rate/2}%)</span></td>
                    </>
                  ) : (
                    <td className="py-3 px-2 text-right">₹{Number(item.igst_amount).toFixed(2)}<br/><span className="text-[10px] text-muted-foreground">({item.gst_rate}%)</span></td>
                  )}
                  
                  <td className="py-3 px-2 text-right font-medium">₹{Number(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between py-4">
          <div className="w-1/2 pr-8 text-sm">
            <div className="mb-4">
              <p className="font-semibold text-muted-foreground mb-1">Notes / Narration</p>
              <p>{invoice.notes || '-'}</p>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-muted-foreground mb-1">Terms & Conditions</p>
              <p className="whitespace-pre-wrap text-xs text-muted-foreground">{invoice.terms_conditions || '-'}</p>
            </div>
          </div>
          
          <div className="w-[300px]">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxable Amount</span>
                <span>₹{Number(invoice.taxable_amount).toFixed(2)}</span>
              </div>
              {invoice.tax_type === 'gst' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total CGST</span>
                    <span>₹{Number(invoice.cgst_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total SGST</span>
                    <span>₹{Number(invoice.sgst_amount).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total IGST</span>
                  <span>₹{Number(invoice.igst_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>- ₹{Number(invoice.discount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Round Off</span>
                <span>₹{Number(invoice.round_off).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t mt-4">
                <span>Grand Total</span>
                <span>₹{Number(invoice.final_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground">Amount Paid</span>
                <span>₹{Number(invoice.paid_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 p-2 rounded mt-2">
                <span>Balance Due</span>
                <span>₹{(Number(invoice.final_amount) - Number(invoice.paid_amount)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
