import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Package } from 'lucide-react';
import type { InvoiceStore } from '../store/invoiceStore';

interface InvoiceItemsTableProps {
  calculatedItems: any[];
  store: InvoiceStore;
}

export function InvoiceItemsTable({ calculatedItems, store }: InvoiceItemsTableProps) {
  return (
    <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#09090b] shadow-sm">
      <table className="w-full text-xs text-left">
        <thead className="bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/10 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4">Item Details</th>
            <th className="py-3 px-3 w-24 text-center">Qty</th>
            <th className="py-3 px-3 w-28 text-right">Rate / Tax Mode</th>
            <th className="py-3 px-2 w-18 text-center">GST %</th>
            <th className="py-3 px-2 w-20 text-center">Cess %</th>
            <th className="py-3 px-4 w-32 text-right">Amount (₹)</th>
            <th className="py-3 px-2 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
          {calculatedItems.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
                  {(item.brand?.name || item.brand_name) && (
                    <span className="text-[10px] bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold border border-purple-200/50 dark:border-purple-500/20">
                      {item.brand?.name || item.brand_name}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Brand: <span className="font-medium text-slate-600 dark:text-slate-300">{item.brand?.name || item.brand_name || 'General'}</span> | HSN: <span className="font-mono">{item.hsn_code || '—'}</span>
                </p>
              </td>
              <td className="py-3 px-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Input 
                    type="number" 
                    min="0.01" 
                    step="0.01" 
                    className="h-8 w-16 px-1.5 text-center font-bold text-xs bg-slate-50 dark:bg-white/[0.02]" 
                    value={item.quantity} 
                    onChange={e => store.updateItem(item.id, { quantity: Number(e.target.value) || 0 })}
                  />
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{item.unit}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-right">
                <div className="flex flex-col items-end gap-1.5">
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    className="h-8 w-24 ml-auto px-2 text-right font-bold text-xs bg-slate-50 dark:bg-white/[0.02]" 
                    value={item.rate} 
                    onChange={e => store.updateItem(item.id, { rate: Number(e.target.value) || 0 })}
                  />
                  <button
                    type="button"
                    title="Click to toggle between With Tax (Inclusive) and Without Tax (Exclusive) for this specific item"
                    onClick={() => store.updateItem(item.id, { is_tax_inclusive: !(item.is_tax_inclusive !== undefined ? item.is_tax_inclusive : store.isTaxInclusive) })}
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider transition-all border shadow-2xs flex items-center gap-1 ml-auto ${
                      (item.is_tax_inclusive !== undefined ? item.is_tax_inclusive : store.isTaxInclusive)
                        ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${(item.is_tax_inclusive !== undefined ? item.is_tax_inclusive : store.isTaxInclusive) ? 'bg-white' : 'bg-slate-400'}`} />
                    <span>{(item.is_tax_inclusive !== undefined ? item.is_tax_inclusive : store.isTaxInclusive) ? 'With Tax' : 'Without Tax'}</span>
                  </button>
                </div>
              </td>
              <td className="py-3 px-2 text-center">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-mono">
                  {store.taxMode === 'exempt' ? 0 : item.gst_rate}%
                </span>
              </td>
              <td className="py-3 px-2 text-center">
                <Input 
                  type="number" 
                  min="0" 
                  step="1"
                  className="h-8 w-16 mx-auto px-1 text-center font-mono font-bold text-xs bg-amber-50/50 dark:bg-amber-500/5 border-amber-200/60 dark:border-amber-500/20 text-amber-700 dark:text-amber-400" 
                  placeholder="0"
                  value={item.cess_rate || ''} 
                  onChange={e => store.updateItem(item.id, { cess_rate: Number(e.target.value) || 0 })}
                />
              </td>
              <td className="py-3 px-4 text-right font-display font-bold text-sm text-slate-900 dark:text-white">
                ₹{item.amount?.toFixed(2)}
              </td>
              <td className="py-3 px-2 text-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg opacity-60 group-hover:opacity-100 transition-all" 
                  onClick={() => store.removeItem(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </td>
            </tr>
          ))}
          {calculatedItems.length === 0 && (
            <tr>
              <td colSpan={7} className="py-14 px-4 text-center text-slate-400 dark:text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No items added to this document yet</p>
                <p className="text-xs text-slate-400 mt-1">Use the search bar above to select products from your inventory</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
