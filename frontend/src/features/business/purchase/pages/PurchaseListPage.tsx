import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, HelpCircle, ShoppingBag, DollarSign, 
  CheckCircle, Clock, FileText, ArrowRight, X, ShieldCheck, 
  ChevronDown, ChevronUp, Sparkles, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import { purchaseService } from '../api/purchaseService';
import { toast } from 'sonner';

export default function PurchaseListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [selectedPurchaseForPayment, setSelectedPurchaseForPayment] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['purchases', activeTab, page, debouncedSearch],
    queryFn: () => purchaseService.list({ 
      status: activeTab, 
      page, 
      search: debouncedSearch || undefined 
    }),
  });

  const paymentMutation = useMutation({
    mutationFn: () => purchaseService.recordPayment(selectedPurchaseForPayment.id, {
      amount: parseFloat(paymentAmount),
      payment_mode: paymentMode,
      notes: paymentNotes
    }),
    onSuccess: () => {
      toast.success('Payment recorded and Supplier Ledger updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      setSelectedPurchaseForPayment(null);
      setPaymentAmount('');
      setPaymentNotes('');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to record payment');
    }
  });

  const purchases = data?.data || [];
  const stats = data?.stats || { total_purchases: 0, total_paid: 0, total_payable: 0, total_itc: 0 };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Paid
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Partial
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Unpaid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Purchase Khata & ITC <span className="text-purple-600 dark:text-purple-400 text-base font-bold px-2 py-0.5 rounded-md bg-purple-500/10">Vendor Bills & GST Setoff</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Record supplier purchase bills, automatically replenish godown inventory, track payables, and optimize GST Input Tax Credit.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button 
              onClick={() => navigate('/business/purchases/new')}
              className="rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20 px-4 h-10 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Purchase Bill
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-purple-200 dark:border-purple-900/30 text-purple-600 dark:text-purple-400 shadow-sm h-10 px-3 text-xs"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'What is Purchase Khata?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-slate-50 to-indigo-50 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/20 border-2 border-purple-200 dark:border-purple-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Sparkles className="w-5 h-5 fill-purple-500 text-purple-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Purchase Khata & ITC Setoff</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                The <strong>Purchase Khata & ITC Suite</strong> integrates procurement, inventory stocking, and GST tax credit reconciliations into a single, automated engine.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    <span>📦</span> 1. Real-Time Stock Additions
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Whenever you record a purchase bill from a vendor, items are automatically added to your warehouse stock inventory with updated purchase rates.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <span>🛡️</span> 2. Input Tax Credit (ITC)
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Accurately tracks CGST, SGST, and IGST paid on raw materials, allowing seamless claim setoffs against output tax liabilities during GSTR-3B filings!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>🤝</span> 3. Vendor Accounts Payable
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Maintains clear vendor ledgers, records partial or advance payments, tracks credit periods, and highlights overdue payables to keep supplier relations strong.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Total Purchase Volume"
            value={formatCurrency(stats.total_purchases)}
            icon={<ShoppingBag className="w-5 h-5 text-white" />}
            glowColor="purple"
            subtitle="Gross invoice amounts"
          />
          <CustomKpiCard
            title="Total Paid Amount"
            value={formatCurrency(stats.total_paid)}
            icon={<CheckCircle className="w-5 h-5 text-white" />}
            glowColor="emerald"
            subtitle="Successfully settled dues"
          />
          <CustomKpiCard
            title="Balance Payable Due"
            value={formatCurrency(stats.total_payable)}
            icon={<Clock className="w-5 h-5 text-white" />}
            glowColor="rose"
            subtitle="Pending payment to vendors"
          />
          <CustomKpiCard
            title="Accrued GST (ITC)"
            value={formatCurrency(stats.total_itc || 0)}
            icon={<ShieldCheck className="w-5 h-5 text-white" />}
            glowColor="indigo"
            subtitle="Tax credit for GST setoff"
          />
        </div>

        {/* Filter Controls */}
        <FilterContainer className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <FilterSearch
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setPage(1);
              }}
              placeholder="SEARCH BY BILL NUMBER, INVOICE # OR SUPPLIER NAME..."
              wrapperClassName="flex-1 min-w-[240px] h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
            />

            <FilterSelect
              value={activeTab}
              onChange={(val) => {
                setActiveTab(val || 'all');
                setPage(1);
              }}
              placeholder="All Statuses"
              options={[
                { value: 'all', label: 'All Purchases' },
                { value: 'unpaid', label: 'Unpaid Dues' },
                { value: 'partial', label: 'Partially Paid' },
                { value: 'paid', label: 'Completed & Paid' },
              ]}
              wrapperClassName="w-full sm:w-52 shrink-0"
            />
          </div>

          {(searchQuery || activeTab !== 'all') && (
            <FilterReset
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
                setPage(1);
              }}
            />
          )}
        </FilterContainer>

        {/* Documents Table Card */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden relative z-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] text-[11px] font-black tracking-wider text-slate-500 dark:text-zinc-400 uppercase">
                  <th className="py-4 px-6">Purchase #</th>
                  <th className="py-4 px-6">Supplier Party</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Bill Amount</th>
                  <th className="py-4 px-6">Balance Due</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-28 rounded-lg" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-36 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-24 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-24 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-24 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : purchases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-6 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No purchase bills found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          {searchQuery || activeTab !== 'all'
                            ? "Try adjusting your search query or filter criteria."
                            : "You haven't recorded any supplier purchase bills yet."}
                        </p>
                        <Button
                          onClick={() => navigate('/business/purchases/new')}
                          size="sm"
                          className="mt-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Record First Purchase
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purchases.map((bill: any) => (
                    <tr key={bill.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 font-mono font-semibold text-purple-700 dark:text-purple-400">
                        <Link to={`/business/purchases/${bill.id}`} className="hover:underline font-bold">
                          {bill.purchase_number}
                        </Link>
                        {bill.bill_number && (
                          <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                            Inv: {bill.bill_number}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-900 dark:text-white font-bold block">{bill.supplier?.name || 'Unknown Supplier'}</span>
                        {bill.supplier?.phone && (
                          <span className="text-xs text-slate-400 font-normal">{bill.supplier.phone}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-semibold">
                        {new Date(bill.purchase_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">
                        ₹ {parseFloat(bill.bill_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 font-extrabold text-rose-600 dark:text-rose-400">
                        ₹ {parseFloat(bill.balance_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(bill.status)}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {parseFloat(bill.balance_amount) > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPurchaseForPayment(bill);
                              setPaymentAmount(bill.balance_amount.toString());
                            }}
                            className="text-xs h-8 px-3 font-bold rounded-xl text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/40"
                          >
                            <DollarSign className="w-3.5 h-3.5 mr-1" /> Pay Due
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/business/purchases/${bill.id}`)}
                          className="text-xs h-8 px-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {selectedPurchaseForPayment && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <Card className="w-full max-w-md bg-white dark:bg-[#0f0f12] shadow-2xl rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <div>
                <h3 className="text-lg font-black tracking-wide">Record Supplier Payment</h3>
                <p className="text-xs text-purple-100 mt-0.5">Bill: {selectedPurchaseForPayment.purchase_number} ({selectedPurchaseForPayment.supplier?.name})</p>
              </div>
              <button onClick={() => setSelectedPurchaseForPayment(null)} className="text-white/80 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1">Amount to Pay (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full h-11 text-lg font-black rounded-xl text-slate-800 dark:text-white"
                  placeholder="Enter amount"
                />
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Total Due: ₹ {selectedPurchaseForPayment.balance_amount}</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full h-11 px-3.5 py-2 text-sm bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS / RTGS)</option>
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash Settlement</option>
                  <option value="Cheque">Cheque Issue</option>
                  <option value="Credit Adjust">Adjustment / Contra</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1">Remarks / Reference (Optional)</label>
                <Input
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Transaction UTR #123456"
                  className="w-full h-11 rounded-xl text-sm font-medium"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-white/5 mt-4">
                <Button variant="ghost" onClick={() => setSelectedPurchaseForPayment(null)} className="h-11 px-5 rounded-xl font-bold text-xs uppercase">Cancel</Button>
                <Button
                  onClick={() => paymentMutation.mutate()}
                  disabled={paymentMutation.isPending || !paymentAmount || parseFloat(paymentAmount) <= 0}
                  className="h-11 px-6 rounded-xl font-black text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
                >
                  {paymentMutation.isPending ? 'Processing...' : 'Confirm Payment'}
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
