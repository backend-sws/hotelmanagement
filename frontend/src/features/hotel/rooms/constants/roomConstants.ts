import { AirVent, Wifi, Tv } from 'lucide-react';
import React from 'react';

// Room Statuses
export const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  available:    { label: 'Available',    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  occupied:     { label: 'Occupied',     color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  reserved:     { label: 'Reserved',     color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  dirty:        { label: 'Dirty',        color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
  maintenance:  { label: 'Maintenance',  color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50 text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
  blocked:      { label: 'Blocked',      color: 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-500', dot: 'bg-slate-400' },
};

export const STATUS_LIST = ['all', 'available', 'occupied', 'reserved', 'dirty', 'maintenance', 'blocked'];
export const ROOM_STATUSES = ['available', 'occupied', 'reserved', 'dirty', 'maintenance', 'blocked'];

// Room Attributes
export const VIEW_TYPES = ['none', 'city', 'garden', 'pool', 'sea', 'mountain', 'courtyard'];
export const BED_TYPES = ['single', 'double', 'twin', 'king', 'queen'];

// Amenities
export const AMENITY_OPTIONS = [
  'AC', 'WiFi', 'TV', 'Mini-Bar', 'Bathtub', 'Hot Water', 'Room Service', 'Safe', 'Balcony', 'Sea View', 'Refrigerator', 'Microwave'
];
