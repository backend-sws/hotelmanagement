import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Package, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer } from '@/components/ui/filter-controls';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';
import { getStockMovements } from '../api/stockService';
import { formatCurrency } from '@/lib/formatters';

const refTypeLabel: Record<string, string> = {
  sale: 'Sale OUT',
  purchase_bill: 'Purchase IN',
  transfer_in: 'Transfer IN',
  transfer_out: 'Transfer OUT',
  material_consumption: 'Consumed OUT',
  opening: 'Opening Stock',
  adjustment: 'Adjustment',
};

export default function StockMovementsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['stock-movements', productId, fromDate, toDate],
    queryFn: () => getStockMovements(Number(productId), {
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }),
    enabled: !!productId,
  });

  const product = data?.product;
  const movements = data?.data ?? [];
  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '9s' }} />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/stock/summary')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-500" />
              {isLoading ? 'Loading…' : (product?.name ?? 'Stock Movements')}
            </h1>
            <p className="text-sm text-slate-400 dark:text-zinc-500">
              {product?.item_code && <span className="mr-3">Code: {product.item_code}</span>}
              {product?.unit && <span>Unit: {product.unit}</span>}
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
          <CustomKpiCard
            title="Total IN"
            value={`${stats?.total_in ?? 0} ${product?.unit ?? ''}`}
            subtitle="Purchases & receipts"
            icon={<TrendingUp />}
            glowColor="emerald"
          />
          <CustomKpiCard
            title="Total OUT"
            value={`${stats?.total_out ?? 0} ${product?.unit ?? ''}`}
            subtitle="Sales & consumption"
            icon={<TrendingDown />}
            glowColor="rose"
          />
          <CustomKpiCard
            title="Current Stock"
            value={`${product?.current_qty ?? 0} ${product?.unit ?? ''}`}
            subtitle="Running balance"
            icon={<Package />}
            glowColor="blue"
          />
        </div>

        {/* Date filters */}
        <FilterContainer>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 pl-1">From:</span>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 h-9"
          />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">To:</span>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 h-9"
          />
          {(fromDate || toDate) && (
            <Button variant="ghost" size="sm" onClick={() => { setFromDate(''); setToDate(''); }}
              className="text-xs font-bold uppercase tracking-wider h-9 text-slate-400 hover:text-rose-500">
              Clear
            </Button>
          )}
        </FilterContainer>

        {/* Movements Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Date</th>
                  <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Type</th>
                  <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Ref #</th>
                  <th className="text-right px-4 py-3 text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">IN</th>
                  <th className="text-right px-4 py-3 text-[10px] font-extrabold text-rose-500 uppercase tracking-widest">OUT</th>
                  <th className="text-right px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Balance</th>
                  <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {isLoading ? (
                  <TableSkeleton rows={6} cols={7} />
                ) : movements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400 dark:text-zinc-500">
                      <Package className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p className="font-semibold">No movements for this period</p>
                    </td>
                  </tr>
                ) : movements.map((m, idx) => (
                  <tr key={m.id ?? idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-slate-500 dark:text-zinc-400 whitespace-nowrap text-xs">{m.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        m.type === 'in'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                      }`}>
                        {m.type === 'in' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {refTypeLabel[m.reference_type] ?? m.reference_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 dark:text-zinc-500 text-xs">#{m.reference_id}</td>
                    <td className="px-4 py-3 text-right">
                      {m.type === 'in' ? (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">+{m.quantity}</span>
                      ) : <span className="text-slate-300 dark:text-zinc-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {m.type === 'out' ? (
                        <span className="font-bold text-rose-600 dark:text-rose-400">-{m.quantity}</span>
                      ) : <span className="text-slate-300 dark:text-zinc-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-slate-900 dark:text-white">{m.balance}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 dark:text-zinc-500 max-w-[160px] truncate">{m.notes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
