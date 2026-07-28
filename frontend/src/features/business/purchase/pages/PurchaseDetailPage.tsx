import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Printer, Download, Share2, Building2, User, 
  MapPin, Calendar, FileText, CheckCircle, Clock, ShieldCheck, DollarSign, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { purchaseService } from '../api/purchaseService';
import { toast } from 'sonner';

export default function PurchaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [paymentNotes, setPaymentNotes] = useState('');

  const { data: bill, isLoading, isError } = useQuery({
    queryKey: ['purchases', id],
    queryFn: () => purchaseService.get(id!),
    enabled: !!id,
  });

  const paymentMutation = useMutation({
    mutationFn: () => purchaseService.recordPayment(id!, {
      amount: parseFloat(paymentAmount),
      payment_mode: paymentMode,
      notes: paymentNotes
    }),
    onSuccess: () => {
      toast.success('Payment recorded successfully!');
      queryClient.invalidateQueries({ queryKey: ['purchases', id] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      setShowPaymentModal(false);
      setPaymentAmount('');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to record payment');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (isError || !bill) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-medium">Failed to load purchase bill details.</p>
        <Button onClick={() => navigate(-1)} className="mt-4 bg-purple-600">Go Back</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">Paid in Full</span>;
      case 'partial':
      case 'partially_paid':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Partially Paid</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">Unpaid Due</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/business/purchases')} className="text-slate-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
          </Button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {bill.purchase_number}
          </h1>
          {getStatusBadge(bill.status)}
        </div>

        <div className="flex items-center gap-2.5">
          {parseFloat(bill.balance_amount) > 0 && (
            <Button
              onClick={() => { setPaymentAmount(bill.balance_amount.toString()); setShowPaymentModal(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-sm"
            >
              <DollarSign className="w-4 h-4" /> Pay Balance (₹ {bill.balance_amount})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="border-slate-300 dark:border-slate-700 font-semibold gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Bill
          </Button>
        </div>
      </div>

      {/* Bill Overview Card */}
      <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-slate-50 to-purple-50/20 dark:from-slate-800/60 dark:to-purple-950/20 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Supplier / Vendor</span>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mt-1">{bill.supplier?.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{bill.supplier?.phone}</p>
            {bill.supplier?.gstin && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-[11px] font-bold rounded text-slate-700 dark:text-slate-200">
                GSTIN: {bill.supplier.gstin}
              </span>
            )}
          </div>

          <div>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Invoice & Location</span>
            <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <p><strong>Supplier Bill No:</strong> {bill.bill_number || 'N/A'}</p>
              <p><strong>Received At:</strong> {bill.location?.name || 'Primary Central Godown'}</p>
              <p><strong>ITC Eligibility:</strong> {bill.is_itc_eligible ? <span className="text-emerald-600 font-bold">Yes (Claimable)</span> : <span className="text-rose-500 font-medium">No (Ineligible)</span>}</p>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Timeline & Due</span>
            <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <p><strong>Purchase Date:</strong> {new Date(bill.purchase_date).toLocaleDateString('en-IN')}</p>
              <p><strong>Bill Date:</strong> {bill.bill_date ? new Date(bill.bill_date).toLocaleDateString('en-IN') : 'N/A'}</p>
              {bill.due_date && <p><strong>Due Date:</strong> <span className="font-bold text-amber-600">{new Date(bill.due_date).toLocaleDateString('en-IN')}</span></p>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6">
          <h4 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">Line Items & GST Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-xs text-slate-500 uppercase font-extrabold">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2">HSN Code</th>
                  <th className="pb-2 text-right">Quantity</th>
                  <th className="pb-2 text-right">Rate</th>
                  <th className="pb-2 text-right">GST %</th>
                  <th className="pb-2 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                {bill.items?.map((item: any, idx: number) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{item.product?.name || 'Product item'}</td>
                    <td className="py-3 text-slate-500 text-xs font-mono">{item.hsn_code || '9983'}</td>
                    <td className="py-3 text-right font-bold">{item.quantity} {item.unit || 'Pcs'}</td>
                    <td className="py-3 text-right font-medium">₹ {parseFloat(item.purchase_price).toFixed(2)}</td>
                    <td className="py-3 text-right text-xs font-bold text-indigo-600 dark:text-indigo-400">{item.gst_rate}%</td>
                    <td className="py-3 text-right font-black text-slate-900 dark:text-white">₹ {parseFloat(item.total_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            {/* Notes and Payment History */}
            <div>
              {bill.notes && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-xs mb-6">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Remarks / Internal Narration:</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{bill.notes}</p>
                </div>
              )}

              <h5 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">Payment Transaction History</h5>
              {bill.payments && bill.payments.length > 0 ? (
                <div className="space-y-2">
                  {bill.payments.map((p: any) => (
                    <div key={p.id} className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-emerald-900 dark:text-emerald-300 block">₹ {parseFloat(p.amount).toFixed(2)}</span>
                        <span className="text-emerald-700 dark:text-emerald-400 text-[11px]">{p.payment_mode} • {new Date(p.date || p.created_at).toLocaleDateString()}</span>
                      </div>
                      {p.notes && <span className="text-slate-500 text-[11px] italic">{p.notes}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No payments recorded against this bill yet.</p>
              )}
            </div>

            {/* Totals Box */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Taxable Value:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">₹ {parseFloat(bill.taxable_amount || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Total GST Amount (CGST + SGST/IGST):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">₹ {parseFloat(bill.total_tax_amount || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-3">
                <span>Total Bill Amount:</span>
                <span className="text-purple-600 dark:text-purple-400">₹ {parseFloat(bill.bill_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Paid Amount:</span>
                <span>₹ {parseFloat(bill.paid_amount || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                <span>Remaining Payable Balance:</span>
                <span>₹ {parseFloat(bill.balance_amount || '0').toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Record Payment Modal */}
      {showPaymentModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-600 text-white">
              <div>
                <h3 className="text-lg font-bold">Settle Supplier Due</h3>
                <p className="text-xs text-emerald-100">Bill #{bill.purchase_number}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Amount (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full text-lg font-black text-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-semibold"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS/RTGS)</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reference / UTR Notes</label>
                <Input
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. UTR number or bank cheque detail"
                  className="w-full text-sm"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                <Button
                  onClick={() => paymentMutation.mutate()}
                  disabled={paymentMutation.isPending || !paymentAmount || parseFloat(paymentAmount) <= 0}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {paymentMutation.isPending ? 'Processing...' : 'Confirm Settlement'}
                </Button>
              </div>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
