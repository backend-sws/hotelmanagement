import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Package, ArrowRight, ShieldAlert, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LowStockItem {
  id: number;
  name: string;
  unit: string;
  min_stock_alert: number;
  total_stock: number;
}

interface LowStockWidgetProps {
  items: LowStockItem[];
}

export function LowStockWidget({ items = [] }: LowStockWidgetProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-5 bg-white dark:bg-[#11111a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Inventory Threshold Alert
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Items hitting or dropping below min stock level
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[11px] font-bold border border-rose-200/60 dark:border-rose-800/40 animate-pulse">
              {items.length} Critical
            </span>
          )}
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Optimal Inventory Equilibrium
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[240px] mx-auto">
              All inventory items across godowns are well above their minimum reorder safety limits.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[260px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isZero = item.total_stock <= 0;
              const ratio = item.min_stock_alert > 0 
                ? Math.min(100, Math.round((item.total_stock / item.min_stock_alert) * 100))
                : 0;

              return (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 group">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs md:text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-amber-500 transition-colors">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Min limit: <strong className="font-medium text-slate-700 dark:text-slate-300">{item.min_stock_alert} {item.unit}</strong>
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        isZero 
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' 
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      }`}>
                        {isZero ? 'Out of Stock' : `${item.total_stock} ${item.unit} left`}
                      </span>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        style={{ width: `${ratio}%` }}
                        className={`h-full transition-all duration-300 ${
                          isZero ? 'bg-rose-600' : ratio < 50 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Button
          onClick={() => navigate('/stock-transfers/new')}
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
          Execute Stock Transfer / Restock
        </Button>
      </div>
    </Card>
  );
}
