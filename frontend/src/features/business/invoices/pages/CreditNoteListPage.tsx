import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../api/invoiceService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { formatCurrency } from '@/lib/formatters';
import { 
  Plus, 
  RotateCcw, 
  FileText, 
  Download, 
  MessageSquare, 
  HelpCircle, 
  TrendingDown, 
  CheckCircle2, 
  ArrowLeftRight, 
  Sparkles,
  Search,
  Receipt,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

export default function CreditNoteListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [showGuide, setShowGuide] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [sharingId, setSharingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['credit-notes'],
    queryFn: () => invoiceService.list({ invoice_type: 'credit_note' }),
  });

  const creditNotes = useMemo(() => {
    let list = data?.data || [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((cn: any) => 
        cn.invoice_number?.toLowerCase().includes(q) ||
        cn.customer?.name?.toLowerCase().includes(q) ||
        String(cn.parent_id || '').includes(q) ||
        cn.notes?.toLowerCase().includes(q)
      );
    }
    if (reasonFilter !== 'all') {
      list = list.filter((cn: any) => cn.reason === reasonFilter || (reasonFilter === 'other' && !cn.reason));
    }
    return list;
  }, [data?.data, search, reasonFilter]);

  // KPI Calculations
  const stats = useMemo(() => {
    const all = data?.data || [];
    const totalCount = all.length;
    const totalAmount = all.reduce((acc: number, item: any) => acc + Number(item.final_amount || 0), 0);
    const returnCount = all.filter((i: any) => i.reason === 'damaged' || i.reason === 'partial_return' || i.reason === 'wrong_item').length;
    const rateCorrectionCount = all.filter((i: any) => i.reason === 'rate_correction').length;
    
    return { totalCount, totalAmount, returnCount, rateCorrectionCount };
  }, [data?.data]);

  const handleDownloadPdf = async (id: number, numberStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadingId(id);
      const blob = await invoiceService.getPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${numberStr || 'Credit-Note'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF Downloaded');
    } catch {
      toast.error('Failed to download PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleWhatsAppShare = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setSharingId(id);
      const res = await invoiceService.getWhatsappUrl(id);
      const targetUrl = res?.whatsapp_url || res?.url || res?.link || (typeof res === 'string' ? res : null);
      if (targetUrl) {
        window.open(targetUrl, '_blank');
        toast.success('Opening WhatsApp');
      } else {
        toast.error('Could not generate WhatsApp share link');
      }
    } catch {
      toast.error('Failed to prepare WhatsApp link');
    } finally {
      setSharingId(null);
    }
  };

  const getReasonLabel = (r?: string) => {
    switch(r) {
      case 'damaged': return '📦 Damaged Goods';
      case 'wrong_item': return '❌ Wrong Item';
      case 'rate_correction': return '💰 Rate Correction';
      case 'partial_return': return '🔄 Partial Return';
      default: return '📝 General Return / Credit';
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setReasonFilter('all');
  };

  const isFiltered = search.trim() !== '' || reasonFilter !== 'all';

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1800px] mx-auto space-y-6 pb-16">
      {/* Header section with gradient accents */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-500/10 via-purple-500/5 to-transparent p-6 rounded-2xl border border-rose-500/20 dark:border-rose-500/10 backdrop-blur-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center">
              <RotateCcw className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Credit Notes <span className="text-rose-500 text-base font-bold px-2 py-0.5 rounded-md bg-rose-500/10">Sales Return & Adjustment</span>
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Record goods returns (Maal Wapsi), bill corrections & customer credit balance adjustments without editing original invoices.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowGuide(!showGuide)}
            className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 shadow-sm"
          >
            <HelpCircle className="w-4 h-4 mr-1.5" /> 
            {showGuide ? 'Hide Guide' : 'What is Credit Note?'}
            {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>

          <Button 
            onClick={() => navigate('/credit-notes/new')}
            className="rounded-xl font-black shadow-lg shadow-rose-500/25 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white transition-all transform active:scale-95 px-5 h-11"
          >
            <Plus className="w-5 h-5 mr-2 stroke-[2.5]" /> Create Credit Note
          </Button>
        </div>
      </div>

      {/* Educational Guide Card */}
      {showGuide && (
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 via-slate-50 to-amber-50 dark:from-rose-950/40 dark:via-slate-900 dark:to-amber-950/20 border-2 border-rose-200 dark:border-rose-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
              <Sparkles className="w-5 h-5 fill-rose-500 text-rose-600 animate-spin-slow" />
              <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Why & How to Use Credit Notes</h3>
            </div>
            
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
              A <strong>Credit Note</strong> (also known as a Credit Memo) is a legally valid financial document issued to a customer after an invoice has been sent, to reduce the amount the customer owes you. It acts as a polite & legitimate way to reverse billing amounts!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 font-black text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  <span>🔄</span> 1. Sales Return (Saaman Wapsi)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  When a customer returns damaged, defective, or unsold items after purchasing. Issuing a credit note restores inventory automatically and updates their ledger balance!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 font-black text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  <span>💰</span> 2. Rate Correction & Overcharge
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  If an item was accidentally billed at ₹1,500 instead of ₹1,200, issue a ₹300 Credit Note for "Rate Correction" instead of canceling or tampering with the completed invoice.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  <span>🧾</span> 3. Perfect GST & Audit Record
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  As per Indian GST laws, once an invoice is filed or finalized, it shouldn't be deleted. Credit Notes ensure your GST returns (GSTR-1) accurately adjust tax liabilities.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomKpiCard 
          title="Total Credit Notes"
          value={isLoading ? '-' : stats.totalCount}
          icon={<Receipt className="w-5 h-5 text-white" />}
          glowColor="rose"
          subtitle="All issued credit notes"
        />
        <CustomKpiCard 
          title="Total Credited Amount"
          value={isLoading ? '-' : formatCurrency(stats.totalAmount)}
          icon={<TrendingDown className="w-5 h-5 text-white" />}
          glowColor="amber"
          subtitle="Total balance reversal"
        />
        <CustomKpiCard 
          title="Goods Return Records"
          value={isLoading ? '-' : stats.returnCount}
          icon={<RotateCcw className="w-5 h-5 text-white" />}
          glowColor="blue"
          subtitle="Physical stock returned"
        />
        <CustomKpiCard 
          title="Rate & Price Adjustments"
          value={isLoading ? '-' : stats.rateCorrectionCount}
          icon={<ArrowLeftRight className="w-5 h-5 text-white" />}
          glowColor="purple"
          subtitle="Billing modifications"
        />
      </div>

      {/* Filter Bar */}
      <FilterContainer className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <FilterSearch 
            placeholder="Search by note #, customer name, original invoice # or remarks..."
            value={search}
            onChange={setSearch}
            wrapperClassName="flex-1 min-w-[260px] h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
          />
          <FilterSelect 
            value={reasonFilter}
            onChange={(val) => setReasonFilter(val || 'all')}
            placeholder="All Reasons"
            options={[
              { label: 'All Reasons', value: 'all' },
              { label: '📦 Damaged Goods Return', value: 'damaged' },
              { label: '🔄 Partial Goods Return', value: 'partial_return' },
              { label: '💰 Rate / Price Correction', value: 'rate_correction' },
              { label: '❌ Wrong Item Delivered', value: 'wrong_item' },
              { label: '📝 Other Reasons', value: 'other' },
            ]}
            wrapperClassName="w-full sm:w-64 shrink-0"
          />
        </div>
        {isFiltered && (
          <FilterReset 
            onClick={handleResetFilters} 
          />
        )}
      </FilterContainer>

      {/* Main Table / Data View */}
      <Card className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111115] shadow-lg">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : creditNotes.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto text-rose-500 border border-rose-200 dark:border-rose-800/30">
              <RotateCcw className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">No Credit Notes Found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isFiltered 
                  ? "We couldn't find any credit notes matching your current filter criteria. Try resetting filters." 
                  : "You haven't issued any credit notes yet. Click the button above whenever you need to process a sales return or adjustment."}
              </p>
            </div>
            {isFiltered && (
              <Button variant="outline" onClick={handleResetFilters} className="mt-2 rounded-xl font-bold">
                Reset all filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-4 px-5">Credit Note #</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-5">Customer Details</th>
                    <th className="py-4 px-4">Reason & Type</th>
                    <th className="py-4 px-4">Linked Invoice</th>
                    <th className="py-4 px-5 text-right">Credit Amount</th>
                    <th className="py-4 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {creditNotes.map((cn: any) => (
                    <tr 
                      key={cn.id} 
                      onClick={() => navigate(`/invoices/${cn.id}`)}
                      className="hover:bg-rose-50/30 dark:hover:bg-rose-950/10 transition-all cursor-pointer group"
                    >
                      <td className="py-4 px-5 font-black text-rose-600 dark:text-rose-400 group-hover:underline">
                        {cn.invoice_number}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300">
                        {new Date(cn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {cn.customer?.name || 'Walk-in / General Customer'}
                        </div>
                        {cn.customer?.phone && (
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            📱 {cn.customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200">
                          {getReasonLabel(cn.reason)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {cn.parent_id ? (
                          <span 
                            onClick={(e) => { e.stopPropagation(); navigate(`/invoices/${cn.parent_id}`); }}
                            className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/30"
                          >
                            🔗 #{cn.parent_id}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">— Direct Note</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right font-display font-black text-base text-rose-600 dark:text-rose-400">
                        -{formatCurrency(Number(cn.final_amount || 0))}
                      </td>
                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View / Edit Note"
                            className="h-8 w-8 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            onClick={() => navigate(`/invoices/${cn.id}`)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Download PDF"
                            className="h-8 w-8 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                            disabled={downloadingId === cn.id}
                            onClick={(e) => handleDownloadPdf(cn.id, cn.invoice_number, e)}
                          >
                            <Download className={`h-4 w-4 ${downloadingId === cn.id ? 'animate-bounce' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Share via WhatsApp"
                            className="h-8 w-8 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                            disabled={sharingId === cn.id}
                            onClick={(e) => handleWhatsAppShare(cn.id, e)}
                          >
                            <MessageSquare className={`h-4 w-4 ${sharingId === cn.id ? 'animate-pulse' : ''}`} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5">
              {creditNotes.map((cn: any) => (
                <div 
                  key={cn.id} 
                  onClick={() => navigate(`/invoices/${cn.id}`)}
                  className="p-4 space-y-3.5 hover:bg-rose-50/20 dark:hover:bg-white/[0.01] transition-colors active:bg-slate-50 dark:active:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/30">
                      {cn.invoice_number}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(cn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-black text-base text-slate-900 dark:text-white">
                      {cn.customer?.name || 'Walk-in Customer'}
                    </div>
                    {cn.customer?.phone && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        📱 {cn.customer.phone}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex w-fit items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {getReasonLabel(cn.reason)}
                      </span>
                      {cn.parent_id && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                          Against Inv: #{cn.parent_id}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Credit Amount</div>
                      <div className="font-display font-black text-lg text-rose-600 dark:text-rose-400">
                        -{formatCurrency(Number(cn.final_amount || 0))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions Bar */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-bold rounded-lg border-slate-200 dark:border-white/10"
                      onClick={() => navigate(`/invoices/${cn.id}`)}
                    >
                      <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" /> Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-bold rounded-lg border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400"
                      disabled={downloadingId === cn.id}
                      onClick={(e) => handleDownloadPdf(cn.id, cn.invoice_number, e)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-bold rounded-lg border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      disabled={sharingId === cn.id}
                      onClick={(e) => handleWhatsAppShare(cn.id, e)}
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" /> WhatsApp
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
