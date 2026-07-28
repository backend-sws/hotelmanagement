import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { getLowStockItems } from '../api/stockService';
import { useState } from 'react';

export function LowStockBanner() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const { data } = useQuery({
    queryKey: ['low-stock-count'],
    queryFn: getLowStockItems,
    refetchInterval: 5 * 60 * 1000, // refresh every 5 min
    staleTime: 2 * 60 * 1000,
  });

  const count = data?.count ?? 0;
  const items = (data?.data ?? []).slice(0, 3);

  if (count === 0 || dismissed) return null;

  return (
    <div className="mx-4 mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            {count} item{count > 1 ? 's' : ''} below minimum stock
          </p>
          <div className="mt-1 space-y-0.5">
            {items.map(item => (
              <p key={item.id} className="text-xs text-amber-600 dark:text-amber-300 truncate">
                · {item.name}: {item.current_qty} {item.unit} (min: {item.min_stock_alert})
              </p>
            ))}
            {count > 3 && (
              <p className="text-xs text-amber-600 dark:text-amber-300">+{count - 3} more…</p>
            )}
          </div>
          <button
            onClick={() => navigate('/stock/summary?low_stock_only=true')}
            className="mt-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-500 hover:text-amber-700 p-0.5 shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/** Badge showing low stock count — for use in Sidebar menu item */
export function LowStockBadge() {
  const { data } = useQuery({
    queryKey: ['low-stock-count'],
    queryFn: getLowStockItems,
    staleTime: 2 * 60 * 1000,
  });
  const count = data?.count ?? 0;
  if (count === 0) return null;
  return (
    <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
      {count > 9 ? '9+' : count}
    </span>
  );
}
