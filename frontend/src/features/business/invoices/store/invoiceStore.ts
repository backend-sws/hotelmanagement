import { create } from 'zustand';
import type { InvoiceItem } from '../api/invoiceService';
import { GST_STATES } from '@/features/business/customers/constants/gstStates';

interface CustomerStub {
  id: number;
  name: string;
  gstin?: string;
  state_code?: string;
  state_name?: string;
  price_list_id?: number | null;
}

export interface AdditionalCharge {
  id: string;
  name: string;
  amount: number;
  isPercentage?: boolean;
  rate?: number;
}

export interface InvoiceStore {
  customer: CustomerStub | null;
  projectId: number | null;
  invoiceType: string;
  date: string;
  dueDate: string;
  placeOfSupply: string;
  discount: number;
  paidAmount: number;
  paymentMode: string;
  splitPayments: { mode: string; amount: number }[];
  notes: string;
  termsConditions: string;
  bankDetails: string;
  referenceNumber: string;
  vehicleNumber: string;
  driverName: string;
  isTaxInclusive: boolean;
  taxMode: 'gst' | 'custom_vat' | 'exempt';
  customTaxLabel: string;
  additionalCharges: AdditionalCharge[];
  items: (InvoiceItem & { id: string; name: string; cess_rate?: number; is_tax_inclusive?: boolean })[];
  
  // Actions
  setCustomer: (customer: CustomerStub | null) => void;
  setProjectId: (id: number | null) => void;
  setInvoiceType: (type: string) => void;
  setDate: (date: string) => void;
  setDueDate: (date: string) => void;
  setPlaceOfSupply: (pos: string) => void;
  setDiscount: (discount: number) => void;
  setPaidAmount: (amount: number) => void;
  setPaymentMode: (mode: string) => void;
  setSplitPayments: (splitPayments: { mode: string; amount: number }[]) => void;
  setNotes: (notes: string) => void;
  setTermsConditions: (terms: string) => void;
  setBankDetails: (bankDetails: string) => void;
  setReferenceNumber: (ref: string) => void;
  setVehicleNumber: (vehicle: string) => void;
  setDriverName: (driver: string) => void;
  setIsTaxInclusive: (val: boolean) => void;
  setTaxMode: (mode: 'gst' | 'custom_vat' | 'exempt') => void;
  setCustomTaxLabel: (label: string) => void;
  
  addItem: (item: InvoiceItem & { id: string; name: string; cess_rate?: number; is_tax_inclusive?: boolean }) => void;
  updateItem: (id: string, updates: Partial<InvoiceItem & { cess_rate?: number; is_tax_inclusive?: boolean }>) => void;
  removeItem: (id: string) => void;
  setItems: (items: (InvoiceItem & { id: string; name: string; cess_rate?: number; is_tax_inclusive?: boolean })[]) => void;
  
  addAdditionalCharge: (charge: AdditionalCharge) => void;
  updateAdditionalCharge: (id: string, updates: Partial<AdditionalCharge>) => void;
  removeAdditionalCharge: (id: string) => void;
  
  reset: () => void;
}

const getInitialState = () => ({
  customer: null,
  projectId: null,
  invoiceType: 'sales_invoice',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  placeOfSupply: '',
  discount: 0,
  paidAmount: 0,
  paymentMode: 'Cash',
  splitPayments: [
    { mode: 'Cash', amount: 0 },
    { mode: 'UPI', amount: 0 }
  ],
  notes: '',
  termsConditions: '',
  bankDetails: '',
  referenceNumber: '',
  vehicleNumber: '',
  driverName: '',
  isTaxInclusive: false,
  taxMode: 'gst' as const,
  customTaxLabel: 'VAT / Custom Tax',
  additionalCharges: [],
  items: [],
});

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  ...getInitialState(),
  
  setProjectId: (projectId) => set({ projectId }),
  setCustomer: (customer) => {
    let pos = '';
    if (customer?.state_code) {
      const codeStr = String(customer.state_code).padStart(2, '0');
      const state = GST_STATES.find(s => s.code === codeStr);
      if (state) {
        pos = `${state.code} - ${state.name}`;
      } else if (customer.state_name) {
        pos = `${customer.state_code} - ${customer.state_name}`;
      } else {
        pos = String(customer.state_code);
      }
    } else if (customer?.state_name) {
      pos = customer.state_name;
    }
    set({ customer, placeOfSupply: pos });
  },
  setInvoiceType: (invoiceType) => set({ invoiceType }),
  setDate: (date) => set({ date }),
  setDueDate: (dueDate) => set({ dueDate }),
  setPlaceOfSupply: (placeOfSupply) => set({ placeOfSupply }),
  setDiscount: (discount) => set({ discount }),
  setPaidAmount: (paidAmount) => set({ paidAmount }),
  setPaymentMode: (paymentMode) => set({ paymentMode }),
  setSplitPayments: (splitPayments) => set({ splitPayments }),
  setNotes: (notes) => set({ notes }),
  setTermsConditions: (termsConditions) => set({ termsConditions }),
  setBankDetails: (bankDetails) => set({ bankDetails }),
  setReferenceNumber: (referenceNumber) => set({ referenceNumber }),
  setVehicleNumber: (vehicleNumber) => set({ vehicleNumber }),
  setDriverName: (driverName) => set({ driverName }),
  setIsTaxInclusive: (isTaxInclusive) => set((state) => ({ 
    isTaxInclusive,
    items: state.items.map((i) => ({ ...i, is_tax_inclusive: isTaxInclusive }))
  })),
  setTaxMode: (taxMode) => set({ taxMode }),
  setCustomTaxLabel: (customTaxLabel) => set({ customTaxLabel }),
  
  addItem: (item) => set((state) => ({ 
    items: [...state.items, { ...item, is_tax_inclusive: item.is_tax_inclusive !== undefined ? item.is_tax_inclusive : state.isTaxInclusive }] 
  })),
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((i) => i.id === id ? { ...i, ...updates } : i)
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id)
  })),
  
  setItems: (items) => set({ items }),

  addAdditionalCharge: (charge) => set((state) => ({
    additionalCharges: [...state.additionalCharges, charge]
  })),

  updateAdditionalCharge: (id, updates) => set((state) => ({
    additionalCharges: state.additionalCharges.map((c) => c.id === id ? { ...c, ...updates } : c)
  })),

  removeAdditionalCharge: (id) => set((state) => ({
    additionalCharges: state.additionalCharges.filter((c) => c.id !== id)
  })),
  
  reset: () => set(getInitialState()),
}));
