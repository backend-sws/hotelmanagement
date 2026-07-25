import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { quotationService } from '../api/quotationService';
import { invoiceService } from '@/features/business/invoices/api/invoiceService';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ArrowRightLeft, CheckCircle, XCircle, Clock, Eye, Download, MessageSquare, Pencil, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { formatCurrency } from '@/lib/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

export default function QuotationListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['quotations', page, status, debouncedSearch],
    queryFn: async () => {
      const params: any = { page, per_page: 15 };
      if (status !== 'all') params.status = status;
      if (debouncedSearch) params.search = debouncedSearch;
      return await quotationService.list(params);
    }
  });

  const quotations = data?.data || [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => quotationService.updateStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['quotations'] }); toast.success('Status updated'); },
    onError: () => toast.error('Failed to update status'),
  });

  const convertMutation = useMutation({
    mutationFn: (id: number) => quotationService.convert(id, 'invoice'),
    onSuccess: (data) => { 
      queryClient.invalidateQueries({ queryKey: ['quotations'] }); 
      toast.success('Converted to invoice!');
      if (data?.id) navigate(`/invoices/${data.id}`);
    },
    onError: () => toast.error('Conversion failed'),
  });

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Accepted
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" /> Sent
          </span>
        );
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Converted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Rejected
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            {st}
          </span>
        );
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.split('T')[0];
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr.split('T')[0];
    }
  };

  const handleDownloadPdf = async (e: React.MouseEvent, id: number, invoiceNum: string) => {
    e.stopPropagation();
    try {
      toast.info('Generating PDF...');
      const blob = await invoiceService.getPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNum}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF downloaded successfully');
    } catch {
      toast.error('Failed to download PDF');
    }
  };

  const handleWhatsapp = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      toast.info('Opening WhatsApp...');
      const url = await invoiceService.getWhatsappUrl(id);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast.error('Could not generate WhatsApp link');
      }
    } catch {
      toast.error('Failed to open WhatsApp');
    }
  };

  const totalValue = quotations.reduce((sum: number, q: any) => sum + Number(q.final_amount || 0), 0);
  const acceptedCount = quotations.filter((q: any) => q.status === 'accepted' || q.status === 'converted' || q.converted_at).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-teal-500/10 dark:bg-teal-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        {/* Premium Control Panel (KPI Cards) */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-5 shadow-2xl shadow-slate-200/30 dark:shadow-black/50">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="transition-transform hover:-translate-y-1 duration-300">
                <CustomKpiCard
                  title="Total Quotation Value"
                  value={formatCurrency(totalValue)}
                  icon={<FileText className="w-5 h-5 text-white" />}
                  glowColor="primary"
                  subtitle="Estimated value of quotes on page"
                />
              </div>
              <div className="transition-transform hover:-translate-y-1 duration-300">
                <CustomKpiCard
                  title="Accepted / Converted"
                  value={`${acceptedCount} Documents`}
                  icon={<CheckCircle className="w-5 h-5 text-white" />}
                  glowColor="emerald"
                  subtitle="Successfully accepted proposals"
                />
              </div>
            </div>
            
            <div className="flex-shrink-0 flex items-center justify-end px-2 sm:px-4">
              <button 
                onClick={() => navigate('/invoices/new?type=quotation')}
                className="group relative flex items-center justify-center gap-2 px-6 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all duration-200"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                <span className="font-bold text-sm tracking-wide">New Quotation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <FilterContainer className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <FilterSearch
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="SEARCH BY QUOTATION #, CUSTOMER NAME, OR PHONE..."
              wrapperClassName="flex-1 min-w-[240px] h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
            />

            <FilterSelect
              value={status}
              onChange={(val) => {
                setStatus(val || 'all');
                setPage(1);
              }}
              placeholder="All Statuses"
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'draft', label: 'Draft' },
                { value: 'sent', label: 'Sent to Customer' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'converted', label: 'Converted to Invoice' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              wrapperClassName="w-full sm:w-52 shrink-0"
            />
          </div>

          {(search || status !== 'all') && (
            <FilterReset
              onClick={() => {
                setSearch('');
                setStatus('all');
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
                  <th className="py-4 px-6">QT #</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-24 rounded-lg" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32 rounded" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-6 text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-28 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : !data || quotations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 px-6 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No quotations found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          {search || status !== 'all'
                            ? "Try adjusting your search query or filter criteria."
                            : "You haven't created any quotations or estimates yet."}
                        </p>
                        <Button
                          onClick={() => navigate('/invoices/new?type=quotation')}
                          size="sm"
                          className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Create First Quotation
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  quotations.map((q: any) => (
                    <tr 
                      key={q.id} 
                      onClick={() => navigate(`/invoices/${q.id}`)}
                      className="group hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-1.5">
                          {q.invoice_number}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-semibold">
                        {formatDate(q.date)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {q.customer?.name || 'Walk-in Customer'}
                        </div>
                        {q.customer?.phone && (
                          <div className="text-xs text-slate-400 font-normal">
                            {q.customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-900 dark:text-white">
                        ₹{Number(q.final_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(q.status)}
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/invoices/${q.id}`)}
                            title="View Quotation"
                            className="h-8 w-8 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); navigate(`/invoices/new?edit=${q.id}`); }}
                            title="Edit Quotation"
                            className="h-8 w-8 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 rounded-lg"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {q.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => { e.stopPropagation(); statusMutation.mutate({ id: q.id, status: 'sent' }); }} 
                              title="Mark Sent"
                              className="h-8 w-8 text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 rounded-lg"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                          {q.status === 'sent' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => { e.stopPropagation(); statusMutation.mutate({ id: q.id, status: 'accepted' }); }} 
                                title="Accept Quote"
                                className="h-8 w-8 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => { e.stopPropagation(); statusMutation.mutate({ id: q.id, status: 'rejected' }); }} 
                                title="Reject Quote"
                                className="h-8 w-8 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {q.status === 'accepted' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => { e.stopPropagation(); convertMutation.mutate(q.id); }} 
                              title="Convert to Invoice"
                              className="h-8 w-8 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleDownloadPdf(e, q.id, q.invoice_number)}
                            title="Download PDF"
                            className="h-8 w-8 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleWhatsapp(e, q.id)}
                            title="Share via WhatsApp"
                            className="h-8 w-8 text-slate-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-500/10 rounded-lg"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.last_page > 1 && (
            <div className="px-6 py-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of <span className="font-bold text-slate-900 dark:text-white">{data.last_page}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="h-8 px-3 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === data.last_page} 
                  onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
                  className="h-8 px-3 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-1"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
