import { Input } from '@/components/ui/input';
import { Tag, Receipt, Plus, Trash2 } from 'lucide-react';

interface InvoiceSummaryPanelProps {
  taxType: 'gst' | 'igst';
  taxableTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  customTaxTotal?: number;
  cessTotal?: number;
  grandTotal: number;
  roundOff: number;
  discount: number;
  onDiscountChange: (val: number) => void;
  taxMode?: 'gst' | 'custom_vat' | 'exempt';
  customTaxLabel?: string;
  additionalCharges?: any[];
  calculatedCharges?: any[];
  onAddCharge?: (charge: any) => void;
  onRemoveCharge?: (id: string) => void;
  onUpdateCharge?: (id: string, updates: any) => void;
}

export function InvoiceSummaryPanel({
  taxType, taxableTotal, cgstTotal, sgstTotal, igstTotal, customTaxTotal = 0, cessTotal = 0,
  grandTotal, roundOff, discount, onDiscountChange, taxMode = 'gst', customTaxLabel = 'VAT / Custom Tax',
  additionalCharges = [], calculatedCharges = [], onAddCharge, onRemoveCharge, onUpdateCharge
}: InvoiceSummaryPanelProps) {
  return (
    <div className="space-y-3.5 text-sm">
      <div className="flex justify-between items-center py-1">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Taxable Amount</span>
        <span className="font-semibold text-slate-800 dark:text-white font-mono">₹{taxableTotal.toFixed(2)}</span>
      </div>
      
      {taxMode === 'exempt' ? (
        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400"><Receipt className="w-3 h-3" /> Tax Exempt Mode</span>
          <span className="font-semibold font-mono">₹0.00</span>
        </div>
      ) : taxMode === 'custom_vat' ? (
        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400"><Receipt className="w-3 h-3" /> {customTaxLabel}</span>
          <span className="font-semibold font-mono">₹{customTaxTotal.toFixed(2)}</span>
        </div>
      ) : taxType === 'gst' ? (
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium"><Receipt className="w-3 h-3 text-blue-500" /> CGST</span>
            <span className="font-semibold font-mono">₹{cgstTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium"><Receipt className="w-3 h-3 text-blue-500" /> SGST</span>
            <span className="font-semibold font-mono">₹{sgstTotal.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium"><Receipt className="w-3 h-3 text-purple-500" /> IGST (Interstate)</span>
          <span className="font-semibold font-mono">₹{igstTotal.toFixed(2)}</span>
        </div>
      )}

      {cessTotal > 0 && (
        <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 flex justify-between items-center text-xs text-amber-700 dark:text-amber-400">
          <span className="flex items-center gap-1 font-bold"><Receipt className="w-3 h-3" /> Total Cess</span>
          <span className="font-semibold font-mono">₹{cessTotal.toFixed(2)}</span>
        </div>
      )}

      {/* Extra Charges / Taxes (Option 2) */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2.5">
        <div className="flex justify-between items-center flex-wrap gap-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Extra Charges / Taxes</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onAddCharge?.({ id: Math.random().toString(36).substr(2, 6), name: 'TCS @ 1%', amount: 0, isPercentage: true, rate: 1 })}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-colors border border-purple-200/50"
            >
              + TCS (1%)
            </button>
            <button
              type="button"
              onClick={() => onAddCharge?.({ id: Math.random().toString(36).substr(2, 6), name: 'Freight / Transport', amount: 500 })}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors border border-blue-200/50"
            >
              + Freight
            </button>
            <button
              type="button"
              onClick={() => onAddCharge?.({ id: Math.random().toString(36).substr(2, 6), name: 'Packaging', amount: 200 })}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors border border-emerald-200/50"
            >
              + Packaging
            </button>
            <button
              type="button"
              onClick={() => onAddCharge?.({ id: Math.random().toString(36).substr(2, 6), name: 'Custom Charge', amount: 100, isPercentage: false })}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition-colors border border-amber-200/50"
            >
              + Custom
            </button>
          </div>
        </div>
        
        {calculatedCharges && calculatedCharges.length > 0 && (
          <div className="space-y-2 p-2.5 rounded-xl bg-purple-50/40 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/10">
            {calculatedCharges.map(ch => (
              <div key={ch.id} className="flex items-center justify-between gap-1.5 text-xs">
                <div className="flex-1 min-w-0">
                  <Input
                    type="text"
                    value={ch.name || ''}
                    placeholder="Charge Name"
                    onChange={e => onUpdateCharge?.(ch.id, { name: e.target.value })}
                    className="h-7 text-xs font-semibold bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded px-2 w-full text-slate-800 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    title={ch.isPercentage ? "Switch to Fixed Amount (₹)" : "Switch to Percentage (%)"}
                    onClick={() => onUpdateCharge?.(ch.id, { 
                      isPercentage: !ch.isPercentage, 
                      rate: ch.isPercentage ? undefined : 1, 
                      amount: ch.isPercentage ? (ch.calculatedAmount || 0) : 0 
                    })}
                    className="h-7 px-1.5 rounded text-[10px] font-bold bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
                  >
                    {ch.isPercentage ? '%' : '₹'}
                  </button>
                  {ch.isPercentage ? (
                    <div className="flex items-center gap-0.5">
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={ch.rate || 0}
                        onChange={e => onUpdateCharge?.(ch.id, { rate: Number(e.target.value) || 0 })}
                        className="h-7 w-14 text-center font-mono font-bold text-xs bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded px-1"
                      />
                      <span className="text-[11px] font-bold text-slate-400">%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5">
                      <span className="text-[11px] font-bold text-slate-400">₹</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={ch.amount || 0}
                        onChange={e => onUpdateCharge?.(ch.id, { amount: Number(e.target.value) || 0 })}
                        className="h-7 w-20 text-right font-mono font-bold text-xs bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded px-1.5"
                      />
                    </div>
                  )}
                  <span className="font-mono font-bold text-slate-800 dark:text-white min-w-[52px] text-right">
                    ₹{(ch.calculatedAmount ?? ch.amount).toFixed(2)}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => onRemoveCharge?.(ch.id)} 
                    className="text-slate-400 hover:text-rose-500 w-5 h-5 flex items-center justify-center rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold text-sm ml-0.5"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Sleek Discount Row */}
      <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
          <Tag className="w-3.5 h-3.5 text-amber-500" />
          <span>Discount</span>
        </div>
        <div className="relative w-28">
          <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-bold">₹</span>
          <Input 
            id="input-discount"
            type="number" 
            min="0"
            className="h-8 pl-6 pr-2 text-right font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 rounded-lg text-xs" 
            value={discount || ''} 
            placeholder="0.00"
            onFocus={e => e.target.select()}
            onChange={e => onDiscountChange(Number(e.target.value) || 0)} 
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const paidInput = document.getElementById('input-paid-amount') as HTMLInputElement;
                paidInput?.focus();
                paidInput?.select();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                document.getElementById('item-search-input')?.focus();
              }
            }}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center py-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
        <span>Round Off</span>
        <span className="font-mono">{roundOff > 0 ? '+' : ''}{roundOff.toFixed(2)}</span>
      </div>
      
      {/* Vibrant Grand Total Box */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/5 dark:from-primary-500/20 dark:to-transparent border border-primary-500/20 flex justify-between items-center mt-2">
        <div>
          <span className="block text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Grand Total</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Inclusive of all taxes & charges</span>
        </div>
        <span className="font-display font-black text-2xl text-primary-600 dark:text-primary-400 tracking-tight">₹{grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
