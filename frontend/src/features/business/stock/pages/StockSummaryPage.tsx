import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Package, AlertTriangle, XCircle, IndianRupee,
  Download, RefreshCw, TrendingDown, ArrowUpDown, MapPin, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterReset } from '@/components/ui/filter-controls';
import { TableSkeleton, StatCardSkeleton } from '@/components/ui/skeleton-loaders';
import { getStockSummary, getLocationWiseStock, type StockItem } from '../api/stockService';
import { formatCurrency } from '@/lib/formatters';
import { useDebounce } from '@/hooks/useDebounce';

type ViewMode = 'all' | 'by_location';

export default function StockSummaryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'qty' | 'value'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['stock-summary', debouncedSearch, lowStockOnly],
    queryFn: () => getStockSummary({
      search: debouncedSearch || undefined,
      low_stock_only: lowStockOnly || undefined,
    }),
  });

  const { data: locationData, isLoading: locationLoading } = useQuery({
    queryKey: ['stock-location-wise'],
    queryFn: getLocationWiseStock,
    enabled: viewMode === 'by_location',
  });

  const sorted = useMemo(() => {
    const items = [...(data?.data ?? [])];
    items.sort((a, b) => {
      let va: string | number = a.name;
      let vb: string | number = b.name;
      if (sortBy === 'qty') { va = a.current_qty; vb = b.current_qty; }
      if (sortBy === 'value') { va = a.stock_value; vb = b.stock_value; }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return items;
  }, [data?.data, sortBy, sortDir]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const stats = data?.stats;

  const exportCSV = () => {
    const rows = [['Item Name', 'Item Code', 'Category', 'Unit', 'Qty', 'Min Alert', 'Purchase Rate', 'Stock Value', 'Status']];
    sorted.forEach(item => rows.push([
      item.name, item.item_code ?? '', item.category ?? '', item.unit ?? '',
      String(item.current_qty), String(item.min_stock_alert),
      String(item.purchase_rate), String(item.stock_value),
      item.is_out_of_stock ? 'Out of Stock' : item.is_low_stock ? 'Low Stock' : 'OK',
    ]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'stock-summary.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '12s', animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-500" /> Stock Summary
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Real-time inventory across all items</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-1.5" /> Export CSV
            </Button>
            <Button size="sm" onClick={() => navigate('/stock/transfer/new')}>
              + New Transfer
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCardSkeleton count={4} />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomKpiCard
              title="Total Items"
              value={stats?.total_items ?? 0}
              icon={<Package />}
              glowColor="blue"
            />
            <CustomKpiCard
              title="Low Stock"
              value={stats?.low_stock_count ?? 0}
              subtitle="Need reorder"
              icon={<AlertTriangle />}
              glowColor="amber"
              onClick={() => { setLowStockOnly(true); setViewMode('all'); }}
            />
            <CustomKpiCard
              title="Out of Stock"
              value={stats?.out_of_stock ?? 0}
              subtitle="Zero quantity"
              icon={<XCircle />}
              glowColor="rose"
            />
            <CustomKpiCard
              title="Total Value"
              value={formatCurrency(stats?.total_value ?? 0)}
              subtitle="At purchase price"
              icon={<IndianRupee />}
              glowColor="emerald"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <FilterContainer>
            <FilterSearch
              value={search}
              onChange={setSearch}
              placeholder="Search items…"
              wrapperClassName="w-56"
            />
            <Button
              variant={lowStockOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLowStockOnly(v => !v)}
              className="gap-1.5 h-9 text-xs font-bold tracking-wider uppercase"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              Low Stock
            </Button>
            {(search || lowStockOnly) && (
              <FilterReset onClick={() => { setSearch(''); setLowStockOnly(false); }} />
            )}
          </FilterContainer>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${viewMode === 'all' ? 'bg-primary-500 text-white shadow' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'}`}
            >
              All Items
            </button>
            <button
              onClick={() => setViewMode('by_location')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${viewMode === 'by_location' ? 'bg-primary-500 text-white shadow' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'}`}
            >
              By Godown
            </button>
          </div>
        </div>

        {/* All Items Table */}
        {viewMode === 'all' && (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                    <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                      <button className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-white transition-colors" onClick={() => toggleSort('name')}>
                        Item <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Category</th>
                    <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Unit</th>
                    <th className="text-right px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                      <button className="flex items-center gap-1 ml-auto hover:text-slate-600 dark:hover:text-white transition-colors" onClick={() => toggleSort('qty')}>
                        Stock <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-right px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Min Alert</th>
                    <th className="text-right px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                      <button className="flex items-center gap-1 ml-auto hover:text-slate-600 dark:hover:text-white transition-colors" onClick={() => toggleSort('value')}>
                        Value <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {isLoading ? (
                    <TableSkeleton rows={8} cols={8} />
                  ) : sorted.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-slate-400 dark:text-zinc-500">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-semibold">No items found</p>
                      </td>
                    </tr>
                  ) : sorted.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group ${item.is_out_of_stock ? 'bg-rose-50/50 dark:bg-rose-900/5' : item.is_low_stock ? 'bg-amber-50/50 dark:bg-amber-900/5' : ''}`}
                      onClick={() => navigate(`/stock/movements/${item.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                        {item.item_code && <div className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{item.item_code}</div>}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-zinc-400 text-sm">{item.category ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-zinc-400 text-sm">{item.unit ?? '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${item.is_out_of_stock ? 'text-rose-600 dark:text-rose-400' : item.is_low_stock ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                          {item.current_qty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400 dark:text-zinc-500 text-sm">
                        {item.min_stock_alert > 0 ? item.min_stock_alert : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-zinc-300 text-sm">{formatCurrency(item.stock_value)}</td>
                      <td className="px-4 py-3 text-center">
                        {item.is_out_of_stock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                            <XCircle className="w-3 h-3" /> Out
                          </span>
                        ) : item.is_low_stock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                            ✓ OK
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 group-hover:text-primary-500 transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* By Location View */}
        {viewMode === 'by_location' && (
          <div className="space-y-4">
            {locationLoading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-slate-200 dark:bg-white/5 animate-pulse" />)
            ) : (locationData?.data ?? []).length === 0 ? (
              <Card className="p-0">
                <div className="text-center py-20 text-slate-400 dark:text-zinc-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-semibold">No godowns/locations set up</p>
                  <p className="text-sm mt-1">Add locations from Settings → Locations</p>
                </div>
              </Card>
            ) : (locationData?.data ?? []).map(loc => (
              <Card key={loc.location_id} className="overflow-hidden p-0">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-50 dark:bg-primary-500/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{loc.location_name}</h3>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">{loc.items_count} items · {formatCurrency(loc.total_value)} total value</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {loc.products.slice(0, 5).map(p => (
                        <tr key={p.product_id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] px-5">
                          <td className="px-5 py-2.5 font-medium text-slate-800 dark:text-slate-200">{p.name}</td>
                          <td className="px-5 py-2.5 text-slate-400 dark:text-zinc-500 text-xs">{p.item_code}</td>
                          <td className="px-5 py-2.5 text-right">
                            <span className={p.is_low_stock ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-900 dark:text-white font-semibold'}>
                              {p.quantity} {p.unit}
                            </span>
                          </td>
                          <td className="px-5 py-2.5 text-right text-slate-400 dark:text-zinc-500">{formatCurrency(p.stock_value)}</td>
                        </tr>
                      ))}
                      {loc.products.length > 5 && (
                        <tr>
                          <td colSpan={4} className="px-5 py-2 text-xs text-center text-slate-400 dark:text-zinc-500">
                            +{loc.products.length - 5} more items
                          </td>
                        </tr>
                      )}
                      {loc.products.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-5 py-4 text-xs text-center text-slate-400 dark:text-zinc-500">No stock at this location</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
