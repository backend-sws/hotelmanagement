import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle, Plus, Package, CornerDownLeft, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryFormModal } from '@/features/business/inventory/components/InventoryFormModal';

interface ItemSearchInputProps {
  onSelect: (item: any) => void;
  priceListId?: number | null;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
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

export function ItemSearchInput({ onSelect, priceListId, inputRef, autoFocus = false }: ItemSearchInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || internalInputRef;

  const { data: results = [], isLoading } = useQuery({
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
    if (autoFocus) {
      setTimeout(() => {
        activeInputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [results, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectItem = (item: any) => {
    const displayName = item.name || item.model_name || item.item_code || 'Unnamed Product';
    const displayRate = getEffectiveRate(item);
    onSelect({
      ...item,
      name: displayName,
      rate: displayRate,
    });
    setQuery('');
    setSelectedIndex(-1);
    setIsOpen(false);
    setTimeout(() => {
      activeInputRef.current?.focus();
    }, 50);
  };

  const handleAddDirectItem = (customName?: string) => {
    const name = customName !== undefined ? customName.trim() : (query.trim() || '');
    const newItemId = Math.random().toString(36).substr(2, 9);
    onSelect({
      id: newItemId,
      product_id: null,
      name: name,
      quantity: 1,
      unit: 'PCS',
      rate: 0,
      gst_rate: 18,
      cess_rate: 0,
      amount: 0,
    });
    setQuery('');
    setSelectedIndex(-1);
    setIsOpen(false);
    setTimeout(() => {
      const nameInput = document.getElementById(`item-name-${newItemId}`) as HTMLInputElement;
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      } else {
        const rateInput = document.getElementById(`item-rate-${newItemId}`) as HTMLInputElement;
        rateInput?.focus();
        rateInput?.select();
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (isOpen && results && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (!isOpen) {
        // Move focus down to first item in table
        const firstQtyInput = document.querySelector('input[id^="item-qty-"]') as HTMLInputElement;
        if (firstQtyInput) {
          e.preventDefault();
          firstQtyInput.focus();
          firstQtyInput.select();
        }
      }
    } else if (e.key === 'ArrowUp') {
      if (isOpen && results && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      }
    } else if (e.key === 'Enter') {
      if (isOpen && selectedIndex >= 0 && selectedIndex < results.length) {
        e.preventDefault();
        handleSelectItem(results[selectedIndex]);
      } else if (isOpen && results.length === 1) {
        e.preventDefault();
        handleSelectItem(results[0]);
      } else if (query.trim()) {
        // Direct Enter on non-empty query without selection -> Add as Direct Item
        e.preventDefault();
        handleAddDirectItem(query);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <div className="relative flex-1 min-w-[240px]">
          <Input
            id="item-search-input"
            ref={activeInputRef}
            icon={<Search className="h-4 w-4 text-slate-400" />}
            placeholder="Search items by name, barcode or HSN (or type to add directly)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 h-10 text-xs rounded-xl focus:ring-primary-500 font-medium pl-11 pr-24"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400 font-mono pointer-events-none hidden sm:flex">
            <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold">↑↓</span>
            <span>Nav</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold ml-1">↵</span>
            <span>Add</span>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => handleAddDirectItem()}
          className="h-10 px-3.5 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs transition-all"
          title="Add a clean row directly on the bill without managing inventory"
        >
          <Plus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          <span>+ Add Row</span>
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
          title="Add New Inventory Product (Shortcut: Alt+I or F2)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Item</span>
          <span className="hidden md:inline text-[9px] font-mono bg-primary-700 px-1 py-0.5 rounded text-primary-100">F2</span>
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#111118] rounded-xl border border-slate-200 dark:border-white/10 shadow-xl max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
          {/* Quick Direct Item Option Header when typing */}
          {query.trim() && (
            <div className="p-2 bg-slate-50/80 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => handleAddDirectItem(query)}
                className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-[#181822] hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Add &quot;{query}&quot; to bill directly</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 font-semibold">Direct</span>
                    </p>
                    <p className="text-[10px] text-slate-500">Direct line item without inventory tracking.</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary-600 text-white flex items-center gap-1">
                  ↵ Enter
                </span>
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="p-4 text-xs text-center text-slate-500 font-medium">Loading items...</div>
          ) : !results || results.length === 0 ? (
            <div className="p-4 text-center space-y-2">
              <p className="text-xs text-slate-500">
                {query.trim() ? `No inventory product found matching "${query}"` : "No items found in inventory."}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button 
                  type="button"
                  size="sm" 
                  onClick={() => handleAddDirectItem(query)} 
                  className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs h-8"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Direct to Bill
                </Button>
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setIsAddModalOpen(true);
                  }} 
                  className="rounded-lg text-xs h-8"
                >
                  <Package className="h-3.5 w-3.5 mr-1.5" /> Save in Inventory (F2)
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-1">
              <div className="px-3 py-1 bg-slate-50/70 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Inventory Products</span>
                <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                  <CornerDownLeft className="w-3 h-3" /> Press Enter to Add
                </span>
              </div>
              {results.map((item: any, index: number) => {
                const displayName = item.name || item.model_name || item.item_code || 'Unnamed Product';
                const displayRate = getEffectiveRate(item);
                const isHighlighted = index === selectedIndex;
                return (
                  <button
                    type="button"
                    key={item.id || index}
                    onClick={() => handleSelectItem(item)}
                    className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between group ${
                      isHighlighted
                        ? 'bg-primary-50 dark:bg-primary-500/15 border-l-4 border-primary-500 text-primary-900 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isHighlighted 
                          ? 'bg-primary-500 text-white shadow-sm' 
                          : 'bg-blue-50 dark:bg-blue-500/10 text-blue-500'
                      }`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs ${isHighlighted ? 'text-primary-700 dark:text-primary-300' : 'text-slate-900 dark:text-white group-hover:text-primary-600'}`}>
                            {displayName}
                          </span>
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
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isHighlighted
                          ? 'bg-primary-600 text-white opacity-100 scale-110 shadow-sm'
                          : 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100'
                      }`}>
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
          handleSelectItem(newItem);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}


