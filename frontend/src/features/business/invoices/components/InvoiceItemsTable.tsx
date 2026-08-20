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
      <datalist id="standard-units-list">
        <option value="PCS" />
        <option value="NOS" />
        <option value="BOX" />
        <option value="PKT" />
        <option value="SET" />
        <option value="KG" />
        <option value="GM" />
        <option value="MTR" />
        <option value="LTR" />
        <option value="ML" />
        <option value="BAG" />
        <option value="BUNDLE" />
        <option value="PAIRS" />
        <option value="DOZ" />
        <option value="ROLL" />
        <option value="SQFT" />
        <option value="SQMT" />
        <option value="TON" />
        <option value="QTL" />
        <option value="SRV" />
        <option value="HRS" />
        <option value="DAYS" />
        <option value="MONTH" />
        <option value="JOB" />
      </datalist>

      <table className="w-full text-xs text-left">
        <thead className="bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/10 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4 min-w-[220px]">Item Details</th>
            <th className="py-3 px-2 w-24 text-center">HSN / SAC</th>
            <th className="py-3 px-2 w-20 text-center">Qty</th>
            <th className="py-3 px-2 w-20 text-center">Unit</th>
            <th className="py-3 px-3 w-32 text-right">Rate / Tax Mode</th>
            <th className="py-3 px-2 w-20 text-center">GST %</th>
            <th className="py-3 px-2 w-20 text-center">Cess %</th>
            <th className="py-3 px-4 w-32 text-right">Amount (₹)</th>
            <th className="py-3 px-2 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
          {calculatedItems.map((item) => {
            const isCustomItem = !item.product_id;

            return (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                {/* Item Details */}
                <td className="py-2.5 px-4 align-middle">
                  {isCustomItem ? (
                    <Input 
                      id={`item-name-${item.id}`}
                      type="text"
                      className="h-9 w-full font-semibold text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white dark:bg-white/[0.02] dark:hover:bg-white/[0.04] dark:focus:bg-white/[0.06] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg transition-all"
                      placeholder="Enter item or service name..."
                      value={item.name}
                      onFocus={e => e.target.select()}
                      onChange={e => store.updateItem(item.id, { name: e.target.value })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const hsnInput = document.getElementById(`item-hsn-${item.id}`) as HTMLInputElement;
                          hsnInput?.focus();
                          hsnInput?.select();
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          document.getElementById('item-search-input')?.focus();
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap min-h-[36px]">
                      <p className="font-bold text-slate-900 dark:text-white text-xs leading-tight">{item.name}</p>
                      {(item.brand?.name || item.brand_name) && (
                        <span className="text-[10px] bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold border border-purple-200/50 dark:border-purple-500/20">
                          {item.brand?.name || item.brand_name}
                        </span>
                      )}
                    </div>
                  )}
                </td>

                {/* HSN / SAC Column */}
                <td className="py-2.5 px-2 text-center align-middle">
                  {isCustomItem ? (
                    <Input 
                      id={`item-hsn-${item.id}`}
                      type="text"
                      className="h-9 w-24 mx-auto text-center text-xs font-mono font-medium px-1 bg-slate-50/70 hover:bg-slate-50 focus:bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                      placeholder="HSN/SAC"
                      value={item.hsn_code || ''}
                      onFocus={e => e.target.select()}
                      onChange={e => store.updateItem(item.id, { hsn_code: e.target.value })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const qtyInput = document.getElementById(`item-qty-${item.id}`) as HTMLInputElement;
                          qtyInput?.focus();
                          qtyInput?.select();
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          document.getElementById('item-search-input')?.focus();
                        }
                      }}
                    />
                  ) : (
                    <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {item.hsn_code || '—'}
                    </span>
                  )}
                </td>

                {/* Qty Column */}
                <td className="py-2.5 px-2 text-center align-middle">
                  <Input 
                    id={`item-qty-${item.id}`}
                    type="number" 
                    min="0.01" 
                    step="0.01" 
                    className="h-9 w-18 mx-auto px-1 text-center font-bold font-mono text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10 rounded-lg" 
                    value={item.quantity} 
                    onFocus={e => e.target.select()}
                    onChange={e => store.updateItem(item.id, { quantity: Number(e.target.value) || 0 })}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const unitInput = document.getElementById(`item-unit-${item.id}`) as HTMLInputElement;
                        if (unitInput) {
                          unitInput.focus();
                          unitInput.select();
                        } else {
                          const rateInput = document.getElementById(`item-rate-${item.id}`) as HTMLInputElement;
                          rateInput?.focus();
                          rateInput?.select();
                        }
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        document.getElementById('item-search-input')?.focus();
                      }
                    }}
                  />
                </td>

                {/* Unit Column (Editable Text Box with Suggestions) */}
                <td className="py-2.5 px-2 text-center align-middle">
                  <Input 
                    id={`item-unit-${item.id}`}
                    type="text" 
                    list="standard-units-list"
                    className="h-9 w-18 mx-auto px-1 text-center font-bold font-mono uppercase text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10 rounded-lg" 
                    placeholder="UNIT"
                    value={item.unit || 'PCS'} 
                    onFocus={e => e.target.select()}
                    onChange={e => store.updateItem(item.id, { unit: e.target.value.toUpperCase() })}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const rateInput = document.getElementById(`item-rate-${item.id}`) as HTMLInputElement;
                        rateInput?.focus();
                        rateInput?.select();
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        document.getElementById('item-search-input')?.focus();
                      }
                    }}
                  />
                </td>

                {/* Rate / Tax Mode Column */}
                <td className="py-2.5 px-3 text-right align-middle">
                  <div className="flex flex-col items-end gap-1">
                    <Input 
                      id={`item-rate-${item.id}`}
                      type="number" 
                      min="0" 
                      step="0.01" 
                      className="h-9 w-26 ml-auto px-2 text-right font-bold text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10 rounded-lg" 
                      value={item.rate} 
                      onFocus={e => e.target.select()}
                      onChange={e => store.updateItem(item.id, { rate: Number(e.target.value) || 0 })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const cessInput = document.getElementById(`item-cess-${item.id}`) as HTMLInputElement;
                          if (cessInput) {
                            cessInput.focus();
                            cessInput.select();
                          } else {
                            document.getElementById('item-search-input')?.focus();
                          }
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          document.getElementById('item-search-input')?.focus();
                        }
                      }}
                    />
                    <button
                      type="button"
                      title="Click to toggle between With Tax (Inclusive) and Without Tax (Exclusive) for this specific item"
                      onClick={() => store.updateItem(item.id, { is_tax_inclusive: !(item.is_tax_inclusive !== undefined ? item.is_tax_inclusive : store.isTaxInclusive) })}
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transition-all border shadow-2xs flex items-center gap-1 ml-auto ${
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

                {/* GST % Column */}
                <td className="py-2.5 px-2 text-center align-middle">
                  <select
                    className="h-9 px-2 text-xs font-bold font-mono text-center rounded-lg bg-blue-50/80 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 cursor-pointer shadow-2xs"
                    value={store.taxMode === 'exempt' ? 0 : Number(item.gst_rate ?? 0)}
                    disabled={store.taxMode === 'exempt'}
                    onChange={e => store.updateItem(item.id, { gst_rate: Number(e.target.value) })}
                  >
                    <option value="0">0%</option>
                    <option value="3">3%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </td>

                {/* Cess % Column */}
                <td className="py-2.5 px-2 text-center align-middle">
                  <Input 
                    id={`item-cess-${item.id}`}
                    type="number" 
                    min="0" 
                    step="1" 
                    className="h-9 w-16 mx-auto px-1 text-center font-mono font-bold text-xs bg-amber-50/50 dark:bg-amber-500/5 border-amber-200/60 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg" 
                    placeholder="0"
                    value={item.cess_rate || ''} 
                    onFocus={e => e.target.select()}
                    onChange={e => store.updateItem(item.id, { cess_rate: Number(e.target.value) || 0 })}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === 'Escape') {
                        e.preventDefault();
                        document.getElementById('item-search-input')?.focus();
                      }
                    }}
                  />
                </td>

                {/* Amount Column */}
                <td className="py-2.5 px-4 text-right font-display font-bold text-sm text-slate-900 dark:text-white align-middle">
                  ₹{item.amount?.toFixed(2)}
                </td>

                {/* Action Column */}
                <td className="py-2.5 px-2 text-center align-middle">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg opacity-60 group-hover:opacity-100 transition-all" 
                    onClick={() => store.removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
          {calculatedItems.length === 0 && (
            <tr>
              <td colSpan={9} className="py-14 px-4 text-center text-slate-400 dark:text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No items added to this document yet</p>
                <p className="text-xs text-slate-400 mt-1">Search products above or click <b>+ Add Row</b> to type items directly without inventory</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
