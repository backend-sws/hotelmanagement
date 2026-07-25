import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Phone, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCustomerModal } from '@/features/business/customers/components/AddCustomerModal';

interface CustomerSearchInputProps {
  onSelect: (customer: any) => void;
  selectedCustomer: any | null;
  onClear: () => void;
}

export function CustomerSearchInput({ onSelect, selectedCustomer, onClear }: CustomerSearchInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: results, isLoading } = useQuery({
    queryKey: ['customers-search', query],
    queryFn: async () => {
      const { data } = await api.get('/business/customers', { params: { search: query || '', per_page: 20 } });
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

  if (selectedCustomer) {
    return (
      <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-primary-500/5 to-primary-600/10 dark:from-primary-500/10 dark:to-transparent border border-primary-500/20 shadow-sm flex justify-between items-center gap-2 transition-all overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400 font-bold font-display flex items-center justify-center text-sm shrink-0 shadow-inner">
            {selectedCustomer.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-white text-sm truncate">{selectedCustomer.name}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-2.5 h-2.5" /> Selected
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              {selectedCustomer.phone && (
                <span className="flex items-center gap-1 shrink-0">
                  <Phone className="w-3 h-3 text-slate-400" /> {selectedCustomer.phone}
                </span>
              )}
              <span className="flex items-center gap-1 font-mono shrink-0">
                <ShieldCheck className="w-3 h-3 text-blue-500" /> {selectedCustomer.gstin || 'URD'}
              </span>
            </div>
          </div>
        </div>
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={onClear} 
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg h-8 px-2.5 text-xs font-bold shrink-0 ml-1"
        >
          <X className="w-3.5 h-3.5 mr-1" /> Change
        </Button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            icon={<Search className="h-4 w-4 text-slate-400" />}
            placeholder="Search Customer by name, phone, or GSTIN..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)}
            className="bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 h-10 text-xs rounded-xl focus:ring-primary-500 pl-11"
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ New</span>
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#111118] rounded-xl border border-slate-200 dark:border-white/10 shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
          {isLoading ? (
            <div className="p-4 text-xs text-center text-slate-500 font-medium">Loading customers...</div>
          ) : !results || results.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 mb-2.5">
                {query.trim() ? `No customer found matching "${query}"` : "No customers available yet."}
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
                <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Add New Customer
              </Button>
            </div>
          ) : (
            <div className="py-1">
              {results.map((c: any) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    onSelect(c);
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors flex items-center justify-between group"
                >
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{c.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{c.phone || 'No Phone'}</span>
                      {c.gstin && <span className="font-mono text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">GST: {c.gstin}</span>}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Select &rarr;
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newCustomer) => {
          onSelect(newCustomer);
          setIsAddModalOpen(false);
          setQuery('');
        }}
      />
    </div>
  );
}
