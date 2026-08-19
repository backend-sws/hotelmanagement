import React, { useEffect, useState, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useStaffPermissions, useUpdateStaffPermissions } from '../api/useStaff';
import type { StaffMember } from '../api/useStaff';
import { Search, Sparkles, CheckSquare, Square, RotateCcw, Hotel, Receipt, ShoppingBag, Users, Wallet, Building2, UserCheck, BarChart3 } from 'lucide-react';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
}

export interface PermissionDefinition {
  id: string;
  label: string;
  description: string;
  category: string;
}

export const ALL_STAFF_PERMISSIONS: PermissionDefinition[] = [
  // 🏨 Hotel Operations
  { id: 'manage_hotel_dashboard', label: 'Hotel Dashboard & Occupancy', description: 'Access live hotel statistics, room occupancy, and revenue cards', category: 'Hotel Operations' },
  { id: 'manage_hotel_bookings', label: 'Front-Desk & Reservations', description: 'Create bookings, view calendar, guest check-in, check-out, and room charges', category: 'Hotel Operations' },
  { id: 'manage_hotel_rooms', label: 'Rooms & Pricing Plans', description: 'Manage hotel room directory, room types, rate plans, and amenities', category: 'Hotel Operations' },
  { id: 'manage_hotel_pos', label: 'Hotel POS & Restaurant', description: 'Manage restaurant/room service orders, menu items, tables, and reservations', category: 'Hotel Operations' },
  { id: 'manage_hotel_housekeeping', label: 'Housekeeping Board', description: 'Assign and update housekeeping tasks, room cleaning status, and inspections', category: 'Hotel Operations' },
  { id: 'manage_hotel_shifts', label: 'Shifts & Department Roster', description: 'Configure staff shifts, shift rosters, and cash handovers', category: 'Hotel Operations' },
  { id: 'manage_hotel_night_audit', label: 'Night Audit (EOD)', description: 'Execute daily night audit operations, no-show processing, and daily room postings', category: 'Hotel Operations' },
  { id: 'manage_hotel_reports', label: 'Hotel Analytics & Reports', description: 'Access RevPAR, ADR, occupancy reports, and hotel revenue breakdown', category: 'Hotel Operations' },
  { id: 'manage_hotel_ota', label: 'OTA Channel Manager', description: 'Manage online travel agency channel connections, rate sync, and mappings', category: 'Hotel Operations' },
  { id: 'manage_hotel_corporate', label: 'Corporate Accounts', description: 'Manage B2B company accounts, credit limits, and corporate settlements', category: 'Hotel Operations' },

  // 🧾 Billing & Sales
  { id: 'view_dashboard', label: 'View Dashboard', description: 'Access overview dashboard statistics and metrics', category: 'Billing & Sales' },
  { id: 'manage_sales', label: 'Invoices & Billing', description: 'Create, edit, print, and settle GST invoices and cash sales', category: 'Billing & Sales' },
  { id: 'manage_challans', label: 'Delivery Challans', description: 'Create and dispatch goods delivery challans', category: 'Billing & Sales' },
  { id: 'manage_proforma', label: 'Proforma Invoices', description: 'Generate proforma estimates and advance invoices', category: 'Billing & Sales' },
  { id: 'manage_quotations', label: 'Quotations & Estimates', description: 'Create price estimates and quotation proposals for clients', category: 'Billing & Sales' },
  { id: 'manage_credit_notes', label: 'Credit Notes & Returns', description: 'Issue credit notes for sales returns and discount adjustments', category: 'Billing & Sales' },
  { id: 'manage_expenses', label: 'Business Expenses', description: 'Record petty cash and business operational expenses', category: 'Billing & Sales' },

  // 📦 Purchases & Inventory
  { id: 'manage_purchases', label: 'Purchase Invoices', description: 'Record purchase inward bills, vendor payments, and inventory additions', category: 'Purchases & Inventory' },
  { id: 'manage_inventory', label: 'Product Catalog & Items', description: 'Add and edit products, categories, brands, units, and barcode tracking', category: 'Purchases & Inventory' },
  { id: 'manage_stock_transfers', label: 'Godown Stock Transfers', description: 'Transfer stock between central warehouse and store godowns', category: 'Purchases & Inventory' },
  { id: 'manage_material_consumption', label: 'Material Consumption', description: 'Record raw material, ingredient, and kitchen consumption', category: 'Purchases & Inventory' },
  { id: 'manage_price_lists', label: 'Price Lists & Tiers', description: 'Configure custom wholesale, retail, and seasonal price lists', category: 'Purchases & Inventory' },

  // 👥 Customers & Suppliers Khata
  { id: 'manage_customers', label: 'Customer Management', description: 'Add and edit customer contact details and GST info', category: 'Relationships & Khata' },
  { id: 'manage_suppliers', label: 'Supplier Management', description: 'Manage vendor directory, supplier details, and contacts', category: 'Relationships & Khata' },
  { id: 'manage_ledger', label: 'Khata & Outstanding Aging', description: 'View party ledgers, settle dues, and check aging reports', category: 'Relationships & Khata' },

  // 💳 Cash, Banking & Cheques
  { id: 'manage_finance', label: 'Cash & Bank Books', description: 'Access cashbook, bank accounts, and Rozka daybook entries', category: 'Cash & Banking' },
  { id: 'manage_cheques', label: 'Cheque Register', description: 'Manage issued and received cheques, clearances, and bounce entries', category: 'Cash & Banking' },

  // 🏗️ Projects & Contracting
  { id: 'manage_projects', label: 'Projects & BOQ Estimates', description: 'Manage project sites, BOQ line items, and labour wages', category: 'Projects & BOQ' },

  // 👥 HRM & Payroll
  { id: 'manage_staff', label: 'Staff Directory & Roles', description: 'Add employees, change roles, and modify permissions', category: 'Staff & HRM' },
  { id: 'manage_attendance', label: 'Manage All Attendance', description: 'Mark daily attendance, overtime, and biometric status for all staff', category: 'Staff & HRM' },
  { id: 'view_attendance', label: 'View Attendance Records', description: 'View monthly staff attendance sheets and rosters', category: 'Staff & HRM' },
  { id: 'manage_payroll', label: 'Generate & Confirm Payroll', description: 'Calculate salaries, earnings, deductions, and finalize payslips', category: 'Staff & HRM' },
  { id: 'manage_leaves', label: 'Leave Requests Approval', description: 'Review, approve, or reject employee leave applications', category: 'Staff & HRM' },
  { id: 'manage_salary_advances', label: 'Salary Advances', description: 'Issue staff salary advances and track monthly deductions', category: 'Staff & HRM' },

  // 📊 Reports & Audit
  { id: 'view_reports', label: 'GST & Financial Reports', description: 'Access GSTR-1, GSTR-3B, Profit & Loss, and Balance Sheet reports', category: 'Reports & Audit' },
  { id: 'view_audit_logs', label: 'Audit Logs & Activity Trails', description: 'Inspect system-wide audit records and operational history', category: 'Reports & Audit' },
  { id: 'manage_business_settings', label: 'Business Settings', description: 'Configure company profile, GSTIN, invoice templates, and system preferences', category: 'Reports & Audit' },
];

export const ROLE_PRESETS: Record<string, { label: string; perms: string[] }> = {
  front_desk: {
    label: '🏨 Front Desk / Reception',
    perms: ['view_dashboard', 'manage_hotel_dashboard', 'manage_hotel_bookings', 'manage_hotel_rooms', 'manage_customers'],
  },
  restaurant_pos: {
    label: '🍽️ Restaurant / POS Cashier',
    perms: ['manage_hotel_pos', 'manage_hotel_bookings'],
  },
  housekeeping: {
    label: '🧹 Housekeeping Staff',
    perms: ['manage_hotel_housekeeping', 'manage_hotel_rooms'],
  },
  accountant: {
    label: '💼 Accountant / Billing',
    perms: ['view_dashboard', 'manage_sales', 'manage_purchases', 'manage_expenses', 'manage_customers', 'manage_suppliers', 'manage_ledger', 'manage_finance', 'manage_cheques', 'view_reports', 'view_audit_logs'],
  },
  inventory_mgr: {
    label: '📦 Inventory Manager',
    perms: ['manage_inventory', 'manage_purchases', 'manage_stock_transfers', 'manage_material_consumption', 'manage_price_lists', 'manage_suppliers'],
  },
  hr_payroll: {
    label: '👥 HR & Payroll Officer',
    perms: ['manage_staff', 'manage_attendance', 'view_attendance', 'manage_payroll', 'manage_leaves', 'manage_salary_advances'],
  },
  all: {
    label: '⭐ All Permissions (Full Access)',
    perms: ALL_STAFF_PERMISSIONS.map(p => p.id),
  }
};

export function PermissionsModal({ isOpen, onClose, staff }: PermissionsModalProps) {
  const { data: permissions, isLoading } = useStaffPermissions(staff?.id || 0);
  const updateMutation = useUpdateStaffPermissions(staff?.id || 0);

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    if (permissions) {
      setSelectedPermissions(permissions);
    }
  }, [permissions]);

  const categories = useMemo(() => {
    const set = new Set(ALL_STAFF_PERMISSIONS.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredPermissions = useMemo(() => {
    return ALL_STAFF_PERMISSIONS.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = !search.trim() || 
        p.label.toLowerCase().includes(search.toLowerCase()) || 
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const handleToggle = (permId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permId]);
    } else {
      setSelectedPermissions(prev => prev.filter(p => p !== permId));
    }
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = ROLE_PRESETS[presetKey];
    if (!preset) return;
    if (presetKey === 'all') {
      setSelectedPermissions(preset.perms);
    } else {
      setSelectedPermissions(preset.perms);
    }
  };

  const handleSelectAllCategory = (cat: string) => {
    const catPermIds = ALL_STAFF_PERMISSIONS.filter(p => cat === 'All' || p.category === cat).map(p => p.id);
    const allSelected = catPermIds.every(id => selectedPermissions.includes(id));
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !catPermIds.includes(id)));
    } else {
      setSelectedPermissions(prev => Array.from(new Set([...prev, ...catPermIds])));
    }
  };

  const handleSave = () => {
    updateMutation.mutate(selectedPermissions, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  if (!staff) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Permissions: ${staff.name}`}
      maxWidth="2xl"
    >
      <div className="space-y-4 max-h-[80vh] flex flex-col">
        
        {/* Quick Role Presets */}
        <div className="space-y-2 bg-slate-50 dark:bg-zinc-900/50 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Quick Role Presets
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {selectedPermissions.length} of {ALL_STAFF_PERMISSIONS.length} selected
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Object.entries(ROLE_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleApplyPreset(key)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all"
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedPermissions([])}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear All
            </button>
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search permissions (e.g. Booking, POS, Salary, Billing)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Category Header with Select All in category button */}
        <div className="flex items-center justify-between pt-1 px-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {activeCategory} Permissions ({filteredPermissions.length})
          </span>
          <button
            type="button"
            onClick={() => handleSelectAllCategory(activeCategory)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <CheckSquare className="w-3.5 h-3.5" /> Toggle All in {activeCategory}
          </button>
        </div>

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 overflow-y-auto pr-1 max-h-[400px]">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500 col-span-2">Loading permissions...</div>
          ) : filteredPermissions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 col-span-2 text-xs">
              No permissions found matching your search.
            </div>
          ) : (
            filteredPermissions.map(perm => {
              const isChecked = selectedPermissions.includes(perm.id);
              return (
                <div 
                  key={perm.id} 
                  onClick={() => handleToggle(perm.id, !isChecked)}
                  className={`p-3 border rounded-xl transition-all duration-150 cursor-pointer flex flex-col justify-between select-none ${
                    isChecked
                      ? 'border-indigo-500/80 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0f] hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{perm.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {perm.description}
                      </p>
                    </div>
                    <div className="shrink-0 mt-0.5" onClick={e => e.stopPropagation()}>
                      <Toggle
                        checked={isChecked}
                        onChange={(checked) => handleToggle(perm.id, checked)}
                      />
                    </div>
                  </div>
                  <div className="mt-2 pt-1 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">{perm.id}</span>
                    <span className="font-medium text-slate-500">{perm.category}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            <strong>{selectedPermissions.length}</strong> active permissions assigned
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
}

