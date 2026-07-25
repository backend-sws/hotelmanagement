import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryFormModal } from '@/features/business/inventory/components/InventoryFormModal';

interface ItemSearchInputProps {
  onSelect: (item: any) => void;
  priceListId?: number | null;
}

const getEffectiveRate = (item: any): number => {
  const rates = [item.price_list_rate, item.sale_rate, item.mrp, item.selling_price, item.purchase_price];
  for (const r of rates) {
    if (r !== undefined && r !== null && r !== '' && !isNaN(Number(r)) && Number(r) > 0) {
      return Number(r);
    }
  }
  return 0;
};

export function ItemSearchInput({ onSelect, priceListId }: ItemSearchInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: results, isLoading } = useQuery({
    queryKey: ['items-search', query, priceListId],
    queryFn: async () => {
      const { data } = await api.get('/business/inventory', { 
        params: { search: query || '', per_page: 20, price_list_id: priceListId } 
      });
      return data.data || [];
    },
    enabled: isOpen,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            icon={<Search className="h-4 w-4 text-slate-400" />}
            placeholder="Search items by name, HSN code, or barcode..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)}
            className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 h-10 text-xs rounded-xl focus:ring-primary-500 font-medium pl-11"
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Item</span>
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#111118] rounded-xl border border-slate-200 dark:border-white/10 shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
          {isLoading ? (
            <div className="p-4 text-xs text-center text-slate-500 font-medium">Loading items...</div>
          ) : !results || results.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 mb-2.5">
                {query.trim() ? `No item found matching "${query}"` : "No items available in inventory yet."}
              </p>
              <Button 
                type="button"
                size="sm" 
                onClick={() => {
                  setIsOpen(false);
                  setIsAddModalOpen(true);
                }} 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add New Item
              </Button>
            </div>
          ) : (
            <div className="py-1">
              {results.map((item: any) => {
                const displayName = item.name || item.model_name || item.item_code || 'Unnamed Product';
                const displayRate = getEffectiveRate(item);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      onSelect({
                        ...item,
                        name: displayName,
                        rate: displayRate,
                      });
                      setQuery('');
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{displayName}</span>
                          {(item.brand?.name || item.brand_name) && (
                            <span className="text-[10px] bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold border border-purple-200/50 dark:border-purple-500/20">
                              {item.brand?.name || item.brand_name}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                          Brand: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.brand?.name || item.brand_name || 'General'}</span> | HSN: <span className="font-mono">{item.hsn_code || '—'}</span> | Rate: <span className="font-bold text-slate-700 dark:text-slate-300">₹{displayRate}</span>
                        </span>
                      </div>
                    </div>
                  
                  <div className="flex items-center gap-2">
                    {item.quantity <= (item.min_stock_level || 0) && (
                      <span title="Low Stock" className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded">
                        <AlertCircle className="h-3 w-3" /> Low Stock
                      </span>
                    )}
                    <span className="text-[11px] font-bold bg-slate-100 dark:bg-white/10 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-mono">
                      {item.quantity} {item.unit || 'pcs'}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
            </div>
          )}
        </div>
      )}

      <InventoryFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newItem) => {
          onSelect({
            ...newItem,
            name: newItem.name || newItem.model_name || newItem.item_code || 'Unnamed Product',
            rate: getEffectiveRate(newItem),
          });
          setIsAddModalOpen(false);
          setQuery('');
        }}
      />
    </div>
  );
}
