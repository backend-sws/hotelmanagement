import { useMemo } from 'react';
import { useTenantStore } from '@/store/tenantStore';

export function useGstCalculation(
  items: any[], 
  placeOfSupply: string, 
  discount: number = 0, 
  isTaxInclusive: boolean = false,
  taxMode: 'gst' | 'custom_vat' | 'exempt' = 'gst',
  additionalCharges: any[] = []
) {
  const activeBusiness = useTenantStore(state => state.activeBusiness);
  const businessState = (activeBusiness as any)?.state_code || '27'; // Fallback arbitrary
  
  const bizCode = String(businessState).split(' - ')[0].trim();
  const posCode = String(placeOfSupply || '').split(' - ')[0].trim();
  const taxType = (!placeOfSupply || bizCode.toLowerCase() === posCode.toLowerCase()) ? 'gst' : 'igst';

  return useMemo(() => {
    const calculatedItems = items.map((item) => {
      const qty = item.quantity || 0;
      const rate = item.rate || 0;
      const gstRate = taxMode === 'exempt' ? 0 : (item.gst_rate || 0);
      const cessRate = taxMode === 'exempt' ? 0 : (item.cess_rate || 0);
      
      let taxable = rate * qty;
      let tax = taxable * (gstRate / 100);
      let cess = taxable * (cessRate / 100);
      let exclusiveRate = rate;
      
      const itemIsInclusive = item.is_tax_inclusive !== undefined ? item.is_tax_inclusive : isTaxInclusive;
      
      if (itemIsInclusive && (gstRate > 0 || cessRate > 0)) {
        const totalAmount = rate * qty;
        const totalRatePercent = gstRate + cessRate;
        taxable = totalAmount / (1 + (totalRatePercent / 100));
        tax = taxable * (gstRate / 100);
        cess = taxable * (cessRate / 100);
        exclusiveRate = taxable / qty;
      }
      
      const cgst = (taxMode === 'gst' && taxType === 'gst') ? tax / 2 : 0;
      const sgst = (taxMode === 'gst' && taxType === 'gst') ? tax / 2 : 0;
      const igst = (taxMode === 'gst' && taxType === 'igst') ? tax : 0;
      const customTax = taxMode === 'custom_vat' ? tax : 0;
      
      return {
        ...item,
        rate: exclusiveRate,
        taxable_amount: taxable,
        cgst_amount: cgst,
        sgst_amount: sgst,
        igst_amount: igst,
        custom_tax_amount: customTax,
        cess_amount: cess,
        amount: taxable + tax + cess,
        _taxRaw: tax + cess
      };
    });

    const taxableTotal = calculatedItems.reduce((acc, i) => acc + i.taxable_amount, 0);
    const cgstTotal = calculatedItems.reduce((acc, i) => acc + i.cgst_amount, 0);
    const sgstTotal = calculatedItems.reduce((acc, i) => acc + i.sgst_amount, 0);
    const igstTotal = calculatedItems.reduce((acc, i) => acc + i.igst_amount, 0);
    const customTaxTotal = calculatedItems.reduce((acc, i) => acc + i.custom_tax_amount, 0);
    const cessTotal = calculatedItems.reduce((acc, i) => acc + i.cess_amount, 0);
    const taxTotal = calculatedItems.reduce((acc, i) => acc + i._taxRaw, 0);

    let chargesTotal = 0;
    const calculatedCharges = (additionalCharges || []).map(ch => {
      let amt = Number(ch.amount || 0);
      if (ch.isPercentage && ch.rate !== undefined) {
        amt = (taxableTotal + taxTotal) * (Number(ch.rate) / 100);
      }
      chargesTotal += amt;
      return { ...ch, calculatedAmount: amt };
    });

    const grandTotal = taxableTotal + taxTotal + chargesTotal - discount;
    const roundedTotal = Math.round(grandTotal);
    const roundOff = roundedTotal - grandTotal;

    return {
      calculatedItems,
      taxType,
      taxableTotal,
      cgstTotal,
      sgstTotal,
      igstTotal,
      customTaxTotal,
      cessTotal,
      taxTotal,
      chargesTotal,
      calculatedCharges,
      grandTotal: roundedTotal,
      roundOff,
    };
  }, [items, placeOfSupply, taxType, discount, isTaxInclusive, taxMode, additionalCharges]);
}
