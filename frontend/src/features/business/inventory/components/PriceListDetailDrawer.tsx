import React, { useState } from 'react';
import { Drawer } from '@/components/ui/drawer';
import { usePriceList, useAddPriceListItem, useRemovePriceListItem } from '../api/usePriceLists';
import { useInventory } from '../api/useInventory';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { toast } from 'sonner';

interface PriceListDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceListId: number;
}

export function PriceListDetailDrawer({ isOpen, onClose, priceListId }: PriceListDetailDrawerProps) {
  const { data: priceList, isLoading: isPriceListLoading } = usePriceList(priceListId);
  const { data: inventoryData, isLoading: isInventoryLoading } = useInventory();
  
  const addMutation = useAddPriceListItem();
  const removeMutation = useRemovePriceListItem();
  
  const [selectedProductId, setSelectedProductId] = useState<string | number>('');
  const [rate, setRate] = useState<string>('');
  
  const inventory = inventoryData?.data || [];
  
  // Create options for searchable select, excluding products already in the price list
  const existingProductIds = priceList?.items?.map((item: any) => item.product_id) || [];
  
  const productOptions = inventory
    .filter(p => !existingProductIds.includes(p.id))
    .map(p => ({
      value: p.id,
      label: p.model_name,
      description: `MRP: ${p.mrp || 0} | Unit: ${p.unit}`,
    }));
    
  const handleAdd = async () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }
    if (!rate || isNaN(Number(rate)) || Number(rate) < 0) {
      toast.error('Please enter a valid rate');
      return;
    }
    
    try {
      await addMutation.mutateAsync({
        priceListId,
        data: {
          product_id: Number(selectedProductId),
          rate: Number(rate),
        }
      });
      toast.success('Item added to price list');
      setSelectedProductId('');
      setRate('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    }
  };
  
  const handleRemove = async (itemId: number) => {
    if (window.confirm('Remove this item from the price list?')) {
      try {
        await removeMutation.mutateAsync({ priceListId, itemId });
        toast.success('Item removed');
      } catch (err: any) {
        toast.error('Failed to remove item');
      }
    }
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      className="max-w-3xl sm:max-w-3xl"
      title={`Manage Items: ${priceList?.name || ''}`}
      subtitle="Add or remove items and set custom rates."
    >
      {(isPriceListLoading || isInventoryLoading) ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-primary-500" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Add Item Form */}
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Add New Item</h3>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-grow w-full space-y-1.5">
                <Label className="text-xs">Select Product</Label>
                <SearchableSelect 
                  options={productOptions}
                  value={selectedProductId}
                  onChange={setSelectedProductId}
                  placeholder="Search product..."
                  controlSize="sm"
                />
              </div>
              <div className="w-full sm:w-32 space-y-1.5 shrink-0">
                <Label className="text-xs">Custom Rate</Label>
                <Input 
                  type="number" 
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="0.00"
                  className="h-9"
                  min="0"
                  step="0.01"
                />
              </div>
              <Button 
                size="sm" 
                className="h-9 bg-primary-600 hover:bg-primary-700 text-white w-full sm:w-auto shrink-0"
                onClick={handleAdd}
                disabled={addMutation.isPending || !selectedProductId || !rate}
              >
                {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                Add
              </Button>
            </div>
          </div>
          
          {/* Items List */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Current Items ({priceList?.items?.length || 0})</h3>
            
            {priceList?.items?.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10">
                <p className="text-sm text-slate-500">No items added to this price list yet.</p>
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-x-auto bg-white dark:bg-[#111115]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-white/10 whitespace-nowrap">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3 text-right">Purchase Price</th>
                      <th className="px-4 py-3 text-right">Sell Price (MRP)</th>
                      <th className="px-4 py-3 text-right text-primary-600 dark:text-primary-400">Custom Rate</th>
                      <th className="px-4 py-3 text-right">Discount</th>
                      <th className="px-4 py-3 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {priceList?.items?.map((item: any) => {
                      const mrp = Number(item.product?.mrp || 0);
                      const purchasePrice = Number(item.product?.purchase_price || 0);
                      const rate = Number(item.rate || 0);
                      const discount = mrp - rate;
                      
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 whitespace-nowrap">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-white max-w-[150px] truncate">{item.product?.model_name || 'Unknown Product'}</div>
                            <div className="text-xs text-slate-500">Unit: {item.product?.unit}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                            ₹{purchasePrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                            ₹{mrp.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/10">
                            ₹{rate.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {discount > 0 ? (
                              <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md text-xs border border-emerald-100 dark:border-emerald-500/20">-₹{discount.toFixed(2)}</span>
                            ) : discount < 0 ? (
                              <span className="text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md text-xs border border-rose-100 dark:border-rose-500/20">+₹{Math.abs(discount).toFixed(2)}</span>
                            ) : (
                              <span className="text-slate-400 font-medium">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                              onClick={() => handleRemove(item.id)}
                              disabled={removeMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
