import {
  UtensilsCrossed, Wine, Sparkles, ConciergeBell, Building, Truck, Shirt,
  Banknote, Smartphone, CreditCard, Gift, Clock, CheckCircle2, Receipt, XCircle
} from 'lucide-react';
import type { ElementType } from 'react';

export const OUTLET_TYPES = ['restaurant', 'bar', 'spa', 'room_service', 'banquet', 'laundry', 'other'] as const;

export const OUTLET_ICONS: Record<string, ElementType> = {
  restaurant: UtensilsCrossed,
  bar: Wine,
  spa: Sparkles,
  room_service: ConciergeBell,
  banquet: Building,
  laundry: Shirt,
  other: Truck,
};

export const OUTLET_COLORS: Record<string, string> = {
  restaurant: 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20',
  bar:         'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
  spa:         'bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-500/20',
  room_service:'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  banquet:     'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
  laundry:     'bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20',
  other:       'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700',
};

export const SERVICE_CATEGORIES = ['food', 'beverage', 'laundry', 'transport', 'spa', 'minibar', 'misc'] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  food:      'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  beverage:  'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  laundry:   'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
  transport: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  spa:       'bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400',
  minibar:   'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  misc:      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

export const POS_CATEGORY_FILTERS = ['All', 'food', 'beverage', 'spa', 'laundry', 'transport', 'minibar', 'misc'] as const;

export const PAYMENT_MODES = [
  { value: 'cash',          label: 'Cash',          icon: Banknote   },
  { value: 'upi',           label: 'UPI',            icon: Smartphone },
  { value: 'card',          label: 'Card',           icon: CreditCard },
  { value: 'complimentary', label: 'Complimentary',  icon: Gift       },
];

export const STATUS_CONFIG: Record<string, { label: string; color: string; icon: ElementType }> = {
  pending:    { label: 'Pending',    color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',       icon: Clock          },
  processing: { label: 'Processing', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',         icon: UtensilsCrossed },
  served:     { label: 'Served',     color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10',   icon: CheckCircle2   },
  billed:     { label: 'Billed',     color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',icon: Receipt        },
  cancelled:  { label: 'Cancelled',  color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10',         icon: XCircle        },
};
