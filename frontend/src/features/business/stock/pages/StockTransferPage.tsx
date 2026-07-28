import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Plus, Eye, XCircle, Truck, RefreshCw, CheckCircle2, 
  AlertTriangle, Package, Calendar, MapPin, Printer, X, FileText, 
  ArrowLeftRight, Loader2, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterReset } from '@/components/ui/filter-controls';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';
import { getStockTransfers, cancelStockTransfer, getStockTransfer } from '../api/stockService';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; icon: any }> = {
    completed: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: <CheckCircle2 className="w-3 h-3 mr-1" />
    },
    cancelled: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: <XCircle className="w-3 h-3 mr-1" />
    },
    draft: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: <AlertTriangle className="w-3 h-3 mr-1" />
    },
  };
  const config = map[status] ?? { bg: 'bg-slate-100 text-slate-500 dark:bg-white/5 border-slate-200', icon: null };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${config.bg}`}>
      {config.icon}
      {status}
    </span>
  );
};

export default function StockTransferPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(null);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['stock-transfers', page, debouncedSearch],
    queryFn: () => getStockTransfers({ page, per_page: 20, search: debouncedSearch || undefined }),
  });

  // Fetch transfer details for modal
  const { data: detailData, isLoading: loadingDetail } = useQuery({
    queryKey: ['stock-transfer-detail', selectedTransferId],
    queryFn: () => getStockTransfer(selectedTransferId!),
    enabled: !!selectedTransferId,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelStockTransfer,
    onSuccess: () => {
      toast.success('Transfer cancelled and stock reversed instantly.');
      qc.invalidateQueries({ queryKey: ['stock-transfers'] });
      qc.invalidateQueries({ queryKey: ['stock-summary'] });
      qc.invalidateQueries({ queryKey: ['location-wise-stock'] });
      if (selectedTransferId) qc.invalidateQueries({ queryKey: ['stock-transfer-detail', selectedTransferId] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Cancel failed'),
  });

  const transfers = (data?.data as any)?.data ?? [];
  const total = (data?.data as any)?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  // Compute KPI statistics
  const stats = useMemo(() => {
    let completed = 0;
    let cancelled = 0;
    let totalItems = 0;
    transfers.forEach((t: any) => {
      if (t.status === 'completed') completed++;
      if (t.status === 'cancelled') cancelled++;
      totalItems += t.items?.length || 0;
    });
    return { completed, cancelled, totalItems };
  }, [transfers]);

  const activeTransfer = (detailData?.data as any) ?? null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -right-[10%] w-[45%] h-[45%] bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute top-[35%] -left-[15%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6">
        {/* Header Glassmorphic Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Stock Transfers
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Godown Routing
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5">
                Monitor inventory movements, internal warehouse shipments, and stock balance reconciliations.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3.5 h-10 hover:bg-slate-50 dark:hover:bg-zinc-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefetching ? 'animate-spin text-blue-500' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/stock/transfer/new')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 px-4 h-10"
            >
              <Plus className="w-4 h-4 mr-1.5" /> New Stock Transfer
            </Button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Total Transfers"
            value={total.toString()}
            icon={<ArrowLeftRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            subtitle="All recorded movements"
            glowColor="blue"
          />
          <CustomKpiCard
            title="Completed Movements"
            value={stats.completed.toString()}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            subtitle="Transfers settled successfully"
            glowColor="emerald"
          />
          <CustomKpiCard
            title="Cancelled Reversals"
            value={stats.cancelled.toString()}
            icon={<XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            subtitle="Reversed stock transfers"
            glowColor="rose"
          />
          <CustomKpiCard
            title="Items Moved (Page)"
            value={stats.totalItems.toString()}
            icon={<Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            subtitle="Total units in current view"
            glowColor="purple"
          />
        </div>

        {/* Filter Controls */}
        <FilterContainer>
          <FilterSearch
            value={search}
            onChange={setSearch}
            placeholder="Search transfer number (e.g. ST-001)..."
            wrapperClassName="w-72"
          />
          {search && <FilterReset onClick={() => setSearch('')} />}
        </FilterContainer>

        {/* Table Container */}
        <Card className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm bg-white dark:bg-zinc-900 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-950/80 border-b border-slate-200 dark:border-zinc-800">
                  <th className="py-3.5 px-4 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-28">Transfer #</th>
                  <th className="py-3.5 px-4 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-32">Date</th>
                  <th className="py-3.5 px-4 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Source Godown (From)</th>
                  <th className="py-3.5 px-2 text-center w-12"></th>
                  <th className="py-3.5 px-4 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Destination Godown (To)</th>
                  <th className="py-3.5 px-4 text-center text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-24">Items</th>
                  <th className="py-3.5 px-4 text-center text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-32">Status</th>
                  <th className="py-3.5 px-4 text-right text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 text-xs font-medium">
                {isLoading ? (
                  <TableSkeleton cols={8} rows={6} />
                ) : transfers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 px-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-bounce">
                        <Truck className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        No Stock Transfers Found
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
                        {search ? `No records match "${search}". Try resetting your filter.` : "You haven't initiated any inventory transfers between warehouses yet."}
                      </p>
                      {!search && (
                        <Button
                          size="sm"
                          className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 px-6 h-10"
                          onClick={() => navigate('/stock/transfer/new')}
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Create First Transfer
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  transfers.map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors group">
                      <td className="py-3.5 px-4 font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                        {t.transfer_number}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400 whitespace-nowrap font-bold">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {t.transfer_date}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          {t.from_location?.name ?? <span className="italic text-slate-400">Unknown Godown</span>}
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-center text-slate-300 dark:text-zinc-600">
                        <ArrowRight className="w-4 h-4 mx-auto" />
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          {t.to_location?.name ?? <span className="italic text-slate-400">Unknown Godown</span>}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 font-extrabold text-slate-700 dark:text-zinc-300">
                          {t.items?.length ?? 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                            onClick={() => setSelectedTransferId(t.id)}
                            title="View Manifest Details"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> View
                          </Button>
                          {t.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              title="Cancel & Reverse Stock"
                              onClick={() => {
                                if (confirm(`Cancel transfer ${t.transfer_number}? All stock quantities transferred will be immediately reversed.`)) {
                                  cancelMutation.mutate(t.id);
                                }
                              }}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Page <span className="text-slate-900 dark:text-white font-black">{page}</span> of {totalPages} · <span className="text-slate-900 dark:text-white font-black">{total}</span> total records
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="font-bold text-xs h-9 px-4 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="font-bold text-xs h-9 px-4 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Transfer Details Modal */}
      {selectedTransferId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50/80 dark:bg-zinc-950/80 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      {loadingDetail ? 'Loading Manifest…' : activeTransfer?.transfer_number}
                    </h3>
                    {activeTransfer && <StatusBadge status={activeTransfer.status} />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Transfer Manifest & Item Breakdown
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransferId(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {loadingDetail ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">Loading transfer records…</p>
                </div>
              ) : activeTransfer ? (
                <>
                  {/* Route Summary Box */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Source Godown (From)
                      </span>
                      <div className="flex items-center gap-2 mt-1 font-bold text-slate-900 dark:text-white">
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{activeTransfer.from_location?.name ?? 'Unknown Godown'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Destination Godown (To)
                      </span>
                      <div className="flex items-center gap-2 mt-1 font-bold text-slate-900 dark:text-white">
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>{activeTransfer.to_location?.name ?? 'Unknown Godown'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Bar */}
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 dark:text-zinc-400 pb-2 border-b border-slate-100 dark:border-zinc-800">
                    <div>Date: <span className="text-slate-900 dark:text-white">{activeTransfer.transfer_date}</span></div>
                    {activeTransfer.transferred_by && (
                      <div>Transferred By Staff ID: <span className="text-slate-900 dark:text-white">#{activeTransfer.transferred_by}</span></div>
                    )}
                    {activeTransfer.notes && (
                      <div className="w-full">Notes: <span className="font-normal italic text-slate-800 dark:text-zinc-300">"{activeTransfer.notes}"</span></div>
                    )}
                  </div>

                  {/* Manifest Table */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      Transferred Items ({activeTransfer.items?.length ?? 0})
                    </h4>
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800">
                            <th className="py-2.5 px-3 font-extrabold text-slate-400 uppercase tracking-widest w-12">#</th>
                            <th className="py-2.5 px-3 font-extrabold text-slate-400 uppercase tracking-widest">Product</th>
                            <th className="py-2.5 px-3 text-right font-extrabold text-slate-400 uppercase tracking-widest">Qty</th>
                            <th className="py-2.5 px-3 font-extrabold text-slate-400 uppercase tracking-widest">Unit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 font-medium">
                          {(activeTransfer.items ?? []).map((item: any, i: number) => (
                            <tr key={item.id ?? i} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/50">
                              <td className="py-3 px-3 font-mono text-slate-400 font-bold">{i + 1}</td>
                              <td className="py-3 px-3">
                                <p className="font-bold text-slate-900 dark:text-white">{item.product?.name ?? `Product #${item.product_id}`}</p>
                                {item.product?.item_code && (
                                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">Code: {item.product.item_code}</p>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right font-black text-slate-900 dark:text-white font-mono text-sm">
                                {item.quantity}
                              </td>
                              <td className="py-3 px-3 text-slate-500 font-bold">
                                {item.unit ?? item.product?.unit ?? 'pcs'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-400">Could not retrieve manifest details.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50/80 dark:bg-zinc-950/80 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3">
              <div>
                {activeTransfer?.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/30 text-xs font-bold"
                    onClick={() => {
                      if (confirm(`Cancel transfer ${activeTransfer.transfer_number}? Stock will be reversed.`)) {
                        cancelMutation.mutate(activeTransfer.id);
                        setSelectedTransferId(null);
                      }
                    }}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel Transfer
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.print();
                  }}
                  className="font-bold text-xs bg-white dark:bg-zinc-900"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Manifest
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSelectedTransferId(null)}
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200 font-bold text-xs px-5"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
