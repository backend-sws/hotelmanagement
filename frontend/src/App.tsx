import { Suspense, lazy, useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { FeatureGuard } from './features/auth/components/FeatureGuard';
import { useTenantStore } from './store/tenantStore';
import { Toaster } from 'sonner';
import { PageLoadingSkeleton } from './components/ui/PageLoadingSkeleton';
import { AppLayout } from './components/layout/AppLayout';
import { usePublicSettings } from '@/features/superadmin/settings/api/useSettings';
import { SettingsPage } from '@/features/superadmin/settings/pages/SettingsPage';
import { PermissionGuard } from '@/features/auth/components/PermissionGuard';
import { useAppStore } from '@/store/appStore';

const Login = lazy(() => import('@/features/auth/pages/LoginPage'));
const PublicInvoiceView = lazy(() => import('@/pages/PublicInvoiceView'));
const Dashboard = lazy(() => import('@/features/business/dashboard/pages/DashboardPage'));
const BusinessProfile = lazy(() => import('@/features/business/profile/pages/BusinessProfilePage'));
const BusinessSettings = lazy(() => import('@/features/business/settings/pages/BusinessSettingsPage'));
const CategoriesPage = lazy(() => import('@/features/business/inventory/pages/CategoriesPage'));
const BrandsPage = lazy(() => import('@/features/business/inventory/pages/BrandsPage'));
const InventoryPage = lazy(() => import('@/features/business/inventory/pages/InventoryPage'));
const PriceListsPage = lazy(() => import('@/features/business/inventory/pages/PriceListsPage'));
const SuppliersPage = lazy(() => import('@/features/business/suppliers/pages/SuppliersPage'));
const SupplierDetailsPage = lazy(() => import('@/features/business/suppliers/pages/SupplierDetailsPage'));


const CustomersPage = lazy(() => import('@/features/business/customers/pages/CustomersPage'));
const CustomerDetailsPage = lazy(() => import('@/features/business/customers/pages/CustomerDetailsPage'));

const InvoiceNewPage = lazy(() => import('@/features/business/invoices/pages/NewInvoicePage'));
const InvoiceListPage = lazy(() => import('@/features/business/invoices/pages/InvoicesListPage'));
const InvoiceDetailPage = lazy(() => import('@/features/business/invoices/pages/InvoiceDetailPage'));
const ExpensesPage = lazy(() => import('@/features/business/expenses/pages/ExpensesPage'));
const FinanceLedgerPage = lazy(() => import('@/features/business/finance/pages/FinanceLedgerPage'));

// Phase 3 — Document Types
const ChallanListPage = lazy(() => import('@/features/business/challan/pages/ChallanListPage'));
const ProformaListPage = lazy(() => import('@/features/business/invoices/pages/ProformaListPage'));
const QuotationListPage = lazy(() => import('@/features/business/quotations/pages/QuotationListPage'));
const CreditNoteListPage = lazy(() => import('@/features/business/invoices/pages/CreditNoteListPage'));
const NewCreditNotePage = lazy(() => import('@/features/business/invoices/pages/NewCreditNotePage'));

// Phase 4 — Purchase, Ledger & Outstanding
const PurchaseListPage = lazy(() => import('@/features/business/purchase/pages/PurchaseListPage'));
const NewPurchasePage = lazy(() => import('@/features/business/purchase/pages/NewPurchasePage'));
const PurchaseDetailPage = lazy(() => import('@/features/business/purchase/pages/PurchaseDetailPage'));
const CustomerLedgerPage = lazy(() => import('@/features/business/ledger/pages/CustomerLedgerPage'));
const SupplierLedgerPage = lazy(() => import('@/features/business/ledger/pages/SupplierLedgerPage'));
const OutstandingPage = lazy(() => import('@/features/business/outstanding/pages/OutstandingPage'));

// Phase 5 — Cash/Bank Book, Day Book & Cheques
const CashBookPage = lazy(() => import('@/features/business/cashbook/pages/CashBookPage'));
const DayBookPage = lazy(() => import('@/features/business/cashbook/pages/DayBookPage'));
const ChequeRegisterPage = lazy(() => import('@/features/business/cheques/pages/ChequeRegisterPage'));

// Phase 6 — Stock & Inventory
const StockSummaryPage = lazy(() => import('@/features/business/stock/pages/StockSummaryPage'));
const StockMovementsPage = lazy(() => import('@/features/business/stock/pages/StockMovementsPage'));
const StockTransferPage = lazy(() => import('@/features/business/stock/pages/StockTransferPage'));
const NewStockTransferPage = lazy(() => import('@/features/business/stock/pages/NewStockTransferPage'));
const GodownsPage = lazy(() => import('@/features/business/stock/pages/GodownsPage'));

// Staff & HR
const StaffPage = lazy(() => import('@/features/business/staff/pages/StaffPage'));
const StaffDetailsPage = lazy(() => import('@/features/business/staff/pages/StaffDetailsPage'));
const AttendancePage = lazy(() => import('@/features/business/attendance/pages/AttendancePage'));
const PayrollPage = lazy(() => import('@/features/business/payroll/pages/PayrollPage'));
const PayrollComponentsPage = lazy(() => import('@/features/business/payroll/pages/PayrollComponentsPage'));
const PayrollDetailsPage = lazy(() => import('@/features/business/payroll/pages/PayrollDetailsPage'));
const LeaveRequestsPage = lazy(() => import('@/features/business/hr/pages/LeaveRequestsPage'));
const SalaryAdvancesPage = lazy(() => import('@/features/business/hr/pages/SalaryAdvancesPage'));
const AuditLogsPage = lazy(() => import('@/features/business/reports/pages/AuditLogsPage'));
const StaffPerformancePage = lazy(() => import('@/features/business/reports/pages/StaffPerformancePage'));
const StaffProductsSoldPage = lazy(() => import('@/features/business/reports/pages/StaffProductsSoldPage'));

// Phase 8 — GST Reports & Core Financial Accounting Suite
const GstReportsPage = lazy(() => import('@/features/business/gst-reports/pages/GstReportsPage'));
const ProfitLossPage = lazy(() => import('@/features/business/reports/pages/ProfitLossPage'));
const BalanceSheetPage = lazy(() => import('@/features/business/reports/pages/BalanceSheetPage'));
const SalesReportPage = lazy(() => import('@/features/business/reports/pages/SalesReportPage'));
const ProductAnalysisReportPage = lazy(() => import('@/features/business/reports/pages/ProductAnalysisReportPage').then(m => ({ default: m.ProductAnalysisReportPage })));

const DocsPage = lazy(() => import('@/features/docs/pages/DocsPage'));
const ProjectsListPage = lazy(() => import('@/features/business/projects/pages/ProjectsListPage'));
const NewProjectPage = lazy(() => import('@/features/business/projects/pages/NewProjectPage'));
const ProjectDetailPage = lazy(() => import('@/features/business/projects/pages/ProjectDetailPage'));
const NewConsumptionPage = lazy(() => import('@/features/business/projects/pages/NewConsumptionPage'));
const BoqListPage = lazy(() => import('@/features/business/projects/pages/BoqListPage'));
const NewBoqPage = lazy(() => import('@/features/business/projects/pages/NewBoqPage'));
const LabourSummaryPage = lazy(() => import('@/features/business/projects/pages/LabourSummaryPage'));

const SuperadminDashboard = lazy(() => import('@/features/superadmin/dashboard/pages/SuperadminDashboardPage'));
const TenantsPage = lazy(() => import('@/features/superadmin/tenants/pages/TenantsPage'));
const PlansPage = lazy(() => import('@/features/superadmin/plans/pages/PlansPage'));
const PartnersPage = lazy(() => import('@/features/superadmin/partners/pages/PartnersPage'));
const CommissionsPage = lazy(() => import('@/features/superadmin/commissions/pages/CommissionsPage'));
const LeadsPage = lazy(() => import('@/features/superadmin/leads/pages/LeadsPage'));
const UsersPage = lazy(() => import('@/features/superadmin/users/pages/UsersPage'));
const SystemLogsPage = lazy(() => import('@/features/superadmin/system/pages/SystemLogsPage'));
const RolesPage = lazy(() => import('@/features/superadmin/roles/pages/RolesPage'));
const TemplatesPage = lazy(() => import('@/features/superadmin/templates/pages/TemplatesPage'));
const MessageLogsPage = lazy(() => import('@/features/superadmin/templates/pages/MessageLogsPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const SubscriptionsPage = lazy(() => import('@/features/superadmin/subscriptions/pages/SubscriptionsPage'));
// Partner Portal Pages
const PartnerRegister = lazy(() => import('@/features/auth/pages/PartnerRegisterPage'));
const PartnerDashboard = lazy(() => import('@/features/partner/dashboard/pages/PartnerDashboardPage'));
const PartnerReferrals = lazy(() => import('@/features/partner/referrals/pages/PartnerReferralsPage'));
const PartnerCommissions = lazy(() => import('@/features/partner/commissions/pages/PartnerCommissionsPage'));
const PartnerPayouts = lazy(() => import('@/features/partner/payouts/pages/PartnerPayoutsPage'));
const PartnerProfile = lazy(() => import('@/features/partner/profile/pages/PartnerProfilePage'));
const ResourcesPage = lazy(() => import('@/features/superadmin/resources/pages/ResourcesPage'));
const PartnerResourcesPage = lazy(() => import('@/features/partner/resources/pages/PartnerResourcesPage'));

// Superadmin Payouts
const SuperadminPayouts = lazy(() => import('@/features/superadmin/payouts/pages/PayoutsPage'));

// 🏨 Hotel Management — Phase 2 (Dashboard + Rooms + Front Desk)
const HotelDashboardPage = lazy(() => import('@/features/hotel/dashboard/HotelDashboardPage').then(m => ({ default: m.HotelDashboardPage })));
const HotelRoomsPage    = lazy(() => import('@/features/hotel/rooms/pages/RoomsPage').then(m => ({ default: m.RoomsPage })));
const HotelRoomTypesPage = lazy(() => import('@/features/hotel/rooms/pages/RoomTypesPage').then(m => ({ default: m.RoomTypesPage })));
const HotelRatePlansPage = lazy(() => import('@/features/hotel/rooms/pages/RatePlansPage').then(m => ({ default: m.RatePlansPage })));
const HotelGuestsPage = lazy(() => import('@/features/hotel/guests/pages/GuestsPage').then(m => ({ default: m.GuestsPage })));
const FrontDeskPage = lazy(() => import('@/features/hotel/bookings/pages/FrontDeskPage').then(m => ({ default: m.FrontDeskPage })));
const BookingDetailPage = lazy(() => import('@/features/hotel/bookings/pages/BookingDetailPage').then(m => ({ default: m.BookingDetailPage })));
const BookingCalendarPage = lazy(() => import('@/features/hotel/bookings/pages/BookingCalendarPage').then(m => ({ default: m.BookingCalendarPage })));
// 🏨 Hotel Phase 3 — POS
const RestaurantPosPage = lazy(() => import('@/features/hotel/pos/pages/RestaurantPosPage').then(m => ({ default: m.RestaurantPosPage })));
const HotelOutletsPage  = lazy(() => import('@/features/hotel/pos/pages/OutletsPage').then(m => ({ default: m.OutletsPage })));
const HotelServicesPage = lazy(() => import('@/features/hotel/pos/pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const TablesSetupPage = lazy(() => import('@/features/hotel/pos/pages/TablesSetupPage'));
const ReservationsPage = lazy(() => import('@/features/hotel/pos/pages/ReservationsPage'));
// 🏨 Hotel Phase 4 — Housekeeping
const HousekeepingPage = lazy(() => import('@/features/hotel/housekeeping/pages/HousekeepingPage').then(m => ({ default: m.HousekeepingPage })));
// 🏨 Hotel Phase 5 — Staff Roster
const HotelDepartmentsPage = lazy(() => import('@/features/hotel/roster/pages/DepartmentsPage').then(m => ({ default: m.DepartmentsPage })));
const HotelShiftsPage = lazy(() => import('@/features/hotel/roster/pages/ShiftsPage').then(m => ({ default: m.ShiftsPage })));
const HotelShiftRosterPage = lazy(() => import('@/features/hotel/roster/pages/ShiftRosterPage').then(m => ({ default: m.ShiftRosterPage })));

// OTA Pages
const OtaChannelsPage = lazy(() => import('@/features/hotel/ota/pages/OtaChannelsPage'));
const RateSyncPage = lazy(() => import('@/features/hotel/ota/pages/RateSyncPage'));
const OtaBookingsPage = lazy(() => import('@/features/hotel/ota/pages/OtaBookingsPage'));

// Hotel Night Audit & GST
const NightAuditPage = lazy(() => import('@/features/hotel/night-audit/pages/NightAuditPage'));
const GstConfigPage = lazy(() => import('@/features/hotel/settings/pages/GstConfigPage'));

// Hotel Reports
const HotelReportsPage = lazy(() => import('@/features/hotel/reports/pages/HotelReportsPage'));

// Hotel Corporate
const CorporateAccountsPage = lazy(() => import('@/features/hotel/corporate/pages/CorporateAccountsPage'));
const CorporateDetailPage = lazy(() => import('@/features/hotel/corporate/pages/CorporateDetailPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function SuperadminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isSuperadmin = user?.roles?.some(r => r.name === 'Superadmin');
  if (!isSuperadmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function BusinessRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const { activeBusiness, isLoading, hasFetched } = useTenantStore();
  const isSuperadmin = user?.roles?.some(r => r.name === 'Superadmin');
  const isPartner = user?.roles?.some(r => r.name === 'Partner');

  if (isSuperadmin) return <Navigate to="/superadmin/dashboard" replace />;
  if (isPartner && !user?.businesses?.length) return <Navigate to="/partner/dashboard" replace />;
  if (hasFetched && !activeBusiness) return <Navigate to="/setup/profile" replace />;

  return <>{children}</>;
}

function PartnerRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isPartner = user?.roles?.some(r => r.name === 'Partner');

  if (!isPartner) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// Color palettes
const colorPalettes = {
  orange: {
    '--primary-50': '#fff7ed', '--primary-100': '#ffedd5', '--primary-200': '#fed7aa', '--primary-300': '#fdba74', '--primary-400': '#fb923c', '--primary-500': '#f97316', '--primary-600': '#ea580c', '--primary-700': '#c2410c', '--primary-800': '#9a3412', '--primary-900': '#7c2d12', '--primary-950': '#431407',
  },
  blue: {
    '--primary-50': '#eff6ff', '--primary-100': '#dbeafe', '--primary-200': '#bfdbfe', '--primary-300': '#93c5fd', '--primary-400': '#60a5fa', '--primary-500': '#3b82f6', '--primary-600': '#2563eb', '--primary-700': '#1d4ed8', '--primary-800': '#1e40af', '--primary-900': '#1e3a8a', '--primary-950': '#172554',
  },
  green: {
    '--primary-50': '#ecfdf5', '--primary-100': '#d1fae5', '--primary-200': '#a7f3d0', '--primary-300': '#6ee7b7', '--primary-400': '#34d399', '--primary-500': '#10b981', '--primary-600': '#059669', '--primary-700': '#047857', '--primary-800': '#065f46', '--primary-900': '#064e3b', '--primary-950': '#022c22',
  },
  purple: {
    '--primary-50': '#f5f3ff', '--primary-100': '#ede9fe', '--primary-200': '#ddd6fe', '--primary-300': '#c4b5fd', '--primary-400': '#a78bfa', '--primary-500': '#8b5cf6', '--primary-600': '#7c3aed', '--primary-700': '#6d28d9', '--primary-800': '#5b21b6', '--primary-900': '#4c1d95', '--primary-950': '#2e1065',
  },
  rose: {
    '--primary-50': '#fff1f2', '--primary-100': '#ffe4e6', '--primary-200': '#fecdd3', '--primary-300': '#fda4af', '--primary-400': '#fb7185', '--primary-500': '#f43f5e', '--primary-600': '#e11d48', '--primary-700': '#be123c', '--primary-800': '#9f1239', '--primary-900': '#881337', '--primary-950': '#4c0519',
  },
  slate: {
    '--primary-50': '#f8fafc', '--primary-100': '#f1f5f9', '--primary-200': '#e2e8f0', '--primary-300': '#cbd5e1', '--primary-400': '#94a3b8', '--primary-500': '#64748b', '--primary-600': '#475569', '--primary-700': '#334155', '--primary-800': '#1e293b', '--primary-900': '#0f172a', '--primary-950': '#020617',
  },
  teal: {
    '--primary-50': '#f0fdfa', '--primary-100': '#ccfbf1', '--primary-200': '#99f6e4', '--primary-300': '#5eead4', '--primary-400': '#2dd4bf', '--primary-500': '#14b8a6', '--primary-600': '#0d9488', '--primary-700': '#0f766e', '--primary-800': '#115e59', '--primary-900': '#134e4a', '--primary-950': '#042f2e',
  },
  red: {
    '--primary-50': '#fef2f2', '--primary-100': '#fee2e2', '--primary-200': '#fecaca', '--primary-300': '#fca5a5', '--primary-400': '#f87171', '--primary-500': '#ef4444', '--primary-600': '#dc2626', '--primary-700': '#b91c1c', '--primary-800': '#991b1b', '--primary-900': '#7f1d1d', '--primary-950': '#450a0a',
  }
};

const fontFamilies = {
  inter: { '--font-primary': '"Inter", sans-serif', '--font-heading': '"Outfit", sans-serif' },
  roboto: { '--font-primary': '"Roboto", sans-serif', '--font-heading': '"Roboto Condensed", sans-serif' },
  poppins: { '--font-primary': '"Lato", sans-serif', '--font-heading': '"Poppins", sans-serif' },
  jakarta: { '--font-primary': '"Plus Jakarta Sans", sans-serif', '--font-heading': '"Plus Jakarta Sans", sans-serif' },
  dmsans: { '--font-primary': '"DM Sans", sans-serif', '--font-heading': '"Outfit", sans-serif' },
  nunito: { '--font-primary': '"Nunito", sans-serif', '--font-heading': '"Nunito", sans-serif' },
  lato: { '--font-primary': '"Lato", sans-serif', '--font-heading': '"Lato", sans-serif' },
  rubik: { '--font-primary': '"Rubik", sans-serif', '--font-heading': '"Rubik", sans-serif' },
  cinzel: { '--font-primary': '"Inter", sans-serif', '--font-heading': '"Cinzel", serif' },
  montserrat: { '--font-primary': '"Montserrat", sans-serif', '--font-heading': '"Montserrat", sans-serif' },
};

function App() {
  usePublicSettings();
  const { theme, primaryColor, fontFamily } = useThemeStore();
  const location = useLocation();
  const { activeBusiness } = useTenantStore();
  const { appName, appLogo } = useAppStore();

  useEffect(() => {
    const title = activeBusiness?.settings?.whitelabel_name || appName || 'MobilePhoneCRM';
    document.title = title;

    const faviconUrl = activeBusiness?.settings?.whitelabel_favicon || activeBusiness?.settings?.whitelabel_logo || appLogo;
    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [activeBusiness?.settings?.whitelabel_name, activeBusiness?.settings?.whitelabel_favicon, activeBusiness?.settings?.whitelabel_logo, appName, appLogo]);

  useEffect(() => {
    const root = window.document.documentElement;
    // Handle theme class
    root.classList.remove('light', 'dark', 'semi-dark');

    // Check if it's an auth page
    const isAuthPage = location.pathname === '/login' || location.pathname === '/partner/register';

    if (theme === 'dark' && !isAuthPage) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    // Inject color palette
    const colors = colorPalettes[primaryColor];
    for (const [key, value] of Object.entries(colors)) {
      root.style.setProperty(key, value);
    }

    // Inject fonts
    const fonts = fontFamilies[fontFamily];
    for (const [key, value] of Object.entries(fonts)) {
      root.style.setProperty(key, value);
    }
  }, [theme, primaryColor, fontFamily, location.pathname]);

  return (
    <>
      <Toaster theme={theme === 'light' ? 'light' : 'dark'} position="top-right" richColors />
      <Suspense fallback={<PageLoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/invoice/:uuid" element={<PublicInvoiceView />} />
          <Route path="/partner/register" element={<PartnerRegister />} />

          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            {/* Business Routes */}
            <Route path="/dashboard" element={<BusinessRoute><Dashboard /></BusinessRoute>} />
            <Route path="/profile" element={<BusinessRoute><ProfilePage /></BusinessRoute>} />
            <Route path="/setup/profile" element={<BusinessProfile />} />
            <Route path="/setup/settings" element={<BusinessRoute><BusinessSettings /></BusinessRoute>} />
            <Route path="/categories" element={<BusinessRoute><CategoriesPage /></BusinessRoute>} />
            <Route path="/brands" element={<BusinessRoute><BrandsPage /></BusinessRoute>} />
            <Route path="/items" element={<BusinessRoute><InventoryPage /></BusinessRoute>} />
            <Route path="/price-lists" element={<BusinessRoute><PriceListsPage /></BusinessRoute>} />
            <Route path="/suppliers" element={<BusinessRoute><SuppliersPage /></BusinessRoute>} />
            <Route path="/suppliers/:id" element={<BusinessRoute><SupplierDetailsPage /></BusinessRoute>} />
            <Route path="/suppliers/:id/purchases/new" element={<BusinessRoute><NewPurchasePage /></BusinessRoute>} />
            <Route path="/customers" element={<BusinessRoute><CustomersPage /></BusinessRoute>} />
            <Route path="/customers/:id" element={<BusinessRoute><CustomerDetailsPage /></BusinessRoute>} />
            <Route path="/invoices/new" element={<BusinessRoute><InvoiceNewPage /></BusinessRoute>} />
            <Route path="/invoices" element={<BusinessRoute><InvoiceListPage /></BusinessRoute>} />
            <Route path="/invoices/:id" element={<BusinessRoute><InvoiceDetailPage /></BusinessRoute>} />
            <Route path="/business/sales/invoices" element={<Navigate to="/invoices" replace />} />
            <Route path="/business/invoices" element={<Navigate to="/invoices" replace />} />
            <Route path="/pos" element={<Navigate to="/invoices/new" replace />} />

            {/* Phase 3 — Document Type Routes */}
            <Route path="/challans" element={<BusinessRoute><ChallanListPage /></BusinessRoute>} />
            <Route path="/proforma" element={<BusinessRoute><ProformaListPage /></BusinessRoute>} />
            <Route path="/quotations" element={<BusinessRoute><QuotationListPage /></BusinessRoute>} />
            <Route path="/credit-notes" element={<BusinessRoute><CreditNoteListPage /></BusinessRoute>} />
            <Route path="/credit-notes/new" element={<BusinessRoute><NewCreditNotePage /></BusinessRoute>} />
            <Route path="/expenses" element={<BusinessRoute><ExpensesPage /></BusinessRoute>} />
            <Route path="/expenses/new" element={<BusinessRoute><ExpensesPage /></BusinessRoute>} />
            <Route path="/finance" element={<Navigate to="/business/outstanding" replace />} />
            <Route path="/docs" element={<BusinessRoute><DocsPage /></BusinessRoute>} />

            {/* Phase 4 — Purchase, Ledger & Outstanding Routes */}
            <Route path="/business/purchases" element={<BusinessRoute><PurchaseListPage /></BusinessRoute>} />
            <Route path="/business/purchases/new" element={<BusinessRoute><NewPurchasePage /></BusinessRoute>} />
            <Route path="/business/purchases/:id" element={<BusinessRoute><PurchaseDetailPage /></BusinessRoute>} />
            <Route path="/business/ledger/customers" element={<BusinessRoute><CustomerLedgerPage /></BusinessRoute>} />
            <Route path="/business/ledger/suppliers" element={<BusinessRoute><SupplierLedgerPage /></BusinessRoute>} />
            <Route path="/business/outstanding" element={<BusinessRoute><OutstandingPage /></BusinessRoute>} />
            <Route path="/purchases" element={<Navigate to="/business/purchases" replace />} />

            {/* Phase 5 — Cash/Bank & Cheques Routes */}
            <Route path="/business/cash-bank" element={<BusinessRoute><CashBookPage /></BusinessRoute>} />
            <Route path="/business/daybook" element={<BusinessRoute><DayBookPage /></BusinessRoute>} />
            <Route path="/business/cheques" element={<BusinessRoute><ChequeRegisterPage /></BusinessRoute>} />
            <Route path="/cashbook" element={<Navigate to="/business/cash-bank" replace />} />
            <Route path="/daybook" element={<Navigate to="/business/daybook" replace />} />
            <Route path="/cheques" element={<Navigate to="/business/cheques" replace />} />

            {/* Phase 6 — Stock & Inventory Routes */}
            <Route path="/stock/summary" element={<BusinessRoute><StockSummaryPage /></BusinessRoute>} />
            <Route path="/stock/movements/:productId" element={<BusinessRoute><StockMovementsPage /></BusinessRoute>} />
            <Route path="/stock/transfer" element={<BusinessRoute><StockTransferPage /></BusinessRoute>} />
            <Route path="/stock/transfer/new" element={<BusinessRoute><NewStockTransferPage /></BusinessRoute>} />
            <Route path="/stock/godowns" element={<BusinessRoute><GodownsPage /></BusinessRoute>} />

            {/* Phase 7 — Projects & Material Consumption Routes */}
            <Route path="/business/projects" element={<BusinessRoute><ProjectsListPage /></BusinessRoute>} />
            <Route path="/business/projects/new" element={<BusinessRoute><NewProjectPage /></BusinessRoute>} />
            <Route path="/business/projects/:id" element={<BusinessRoute><ProjectDetailPage /></BusinessRoute>} />
            <Route path="/projects/:id/consumptions/new" element={<BusinessRoute><NewConsumptionPage /></BusinessRoute>} />
            <Route path="/projects" element={<Navigate to="/business/projects" replace />} />
            <Route path="/projects/new" element={<Navigate to="/business/projects/new" replace />} />
            <Route path="/projects/:id" element={<Navigate to="/business/projects/:id" replace />} />
            <Route path="/boq" element={<BusinessRoute><BoqListPage /></BusinessRoute>} />
            <Route path="/boq/new" element={<BusinessRoute><NewBoqPage /></BusinessRoute>} />
            <Route path="/boq/:id/edit" element={<BusinessRoute><NewBoqPage /></BusinessRoute>} />
            <Route path="/business/labour/summary" element={<BusinessRoute><LabourSummaryPage /></BusinessRoute>} />

            {/* Staff & HR Routes */}
            <Route path="/staff" element={<BusinessRoute><StaffPage /></BusinessRoute>} />
            <Route path="/staff/:id" element={<BusinessRoute><StaffDetailsPage /></BusinessRoute>} />
            <Route path="/attendance" element={<BusinessRoute><AttendancePage /></BusinessRoute>} />
            <Route path="/payroll" element={<BusinessRoute><PayrollPage /></BusinessRoute>} />
            <Route path="/payroll/components" element={<BusinessRoute><PayrollComponentsPage /></BusinessRoute>} />
            <Route path="/payroll/:id" element={<BusinessRoute><PayrollDetailsPage /></BusinessRoute>} />
            <Route path="/hr/leave-requests" element={<BusinessRoute><LeaveRequestsPage /></BusinessRoute>} />
            <Route path="/hr/advances" element={<BusinessRoute><SalaryAdvancesPage /></BusinessRoute>} />

            <Route path="/reports/audit-logs" element={<BusinessRoute><AuditLogsPage /></BusinessRoute>} />
            <Route path="/reports/staff-performance" element={<BusinessRoute><StaffPerformancePage /></BusinessRoute>} />
            <Route path="/reports/staff-performance/:id/products" element={<BusinessRoute><StaffProductsSoldPage /></BusinessRoute>} />

            {/* Phase 8 — GST Reports & Core Financial Accounting Suite */}
            <Route path="/business/reports/gst" element={<BusinessRoute><GstReportsPage /></BusinessRoute>} />
            <Route path="/business/reports/profit-loss" element={<BusinessRoute><ProfitLossPage /></BusinessRoute>} />
            <Route path="/business/reports/balance-sheet" element={<BusinessRoute><BalanceSheetPage /></BusinessRoute>} />
            <Route path="/business/reports/sales" element={<BusinessRoute><SalesReportPage /></BusinessRoute>} />
            <Route path="/business/reports/product-analysis" element={<BusinessRoute><ProductAnalysisReportPage /></BusinessRoute>} />
            <Route path="/reports/gst" element={<Navigate to="/business/reports/gst" replace />} />
            <Route path="/reports/profit-loss" element={<Navigate to="/business/reports/profit-loss" replace />} />
            <Route path="/reports/balance-sheet" element={<Navigate to="/business/reports/balance-sheet" replace />} />
            <Route path="/reports/sales" element={<Navigate to="/business/reports/sales" replace />} />

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* 🏨 HOTEL MANAGEMENT ROUTES — Phase 2: Dashboard + Rooms + FD */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <Route path="/hotel/dashboard" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_dashboard">
                  <HotelDashboardPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/rooms" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_rooms">
                  <HotelRoomsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/room-types" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_rooms">
                  <HotelRoomTypesPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/rate-plans" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_rooms">
                  <HotelRatePlansPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/guests" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_reservations">
                  <HotelGuestsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/front-desk" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_reservations">
                  <FrontDeskPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/calendar" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_reservations">
                  <BookingCalendarPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/bookings/:id" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_reservations">
                  <BookingDetailPage />
                </FeatureGuard>
              </BusinessRoute>
            } />

            {/* 🏨 HOTEL POS ROUTES — Phase 3 */}
            <Route path="/hotel/pos/restaurant" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_pos">
                  <RestaurantPosPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/pos/room-service" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_pos">
                  <RestaurantPosPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/pos/outlets" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_pos">
                  <HotelOutletsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/pos/services" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_pos">
                  <HotelServicesPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/pos/tables" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_pos">
                  <TablesSetupPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/pos/reservations" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_pos">
                  <ReservationsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />

            {/* 🏨 HOTEL HOUSEKEEPING ROUTES — Phase 4 */}
            <Route path="/hotel/housekeeping" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_housekeeping">
                  <HousekeepingPage />
                </FeatureGuard>
              </BusinessRoute>
            } />

            {/* 🏨 HOTEL STAFF ROSTER ROUTES — Phase 5 */}
            <Route path="/hotel/departments" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_shift_roster">
                  <HotelDepartmentsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/shifts" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_shift_roster">
                  <HotelShiftsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/roster" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_shift_roster">
                  <HotelShiftRosterPage />
                </FeatureGuard>
              </BusinessRoute>
            } />

            {/* 🏨 HOTEL OTA ROUTES — Phase 6 */}
            <Route path="/hotel/ota" element={<Navigate to="/hotel/ota/channels" replace />} />
            <Route path="/hotel/ota/channels" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_ota">
                  <OtaChannelsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/ota/sync" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_ota">
                  <RateSyncPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/ota/bookings" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_ota">
                  <OtaBookingsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />

            {/* Night Audit & GST */}
            <Route path="/hotel/night-audit" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_night_audit">
                  <NightAuditPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/reports" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_reports">
                  <HotelReportsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/settings/gst" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_gst_compliance">
                  <GstConfigPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/corporate" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_corporate">
                  <CorporateAccountsPage />
                </FeatureGuard>
              </BusinessRoute>
            } />
            <Route path="/hotel/corporate/:id" element={
              <BusinessRoute>
                <FeatureGuard feature="has_hotel_corporate">
                  <CorporateDetailPage />
                </FeatureGuard>
              </BusinessRoute>
            } />

            {/* Superadmin Routes */}
            <Route path="/superadmin/dashboard" element={<SuperadminRoute><PermissionGuard permission="view_dashboard"><SuperadminDashboard /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/profile" element={<SuperadminRoute><ProfilePage /></SuperadminRoute>} />
            <Route path="/superadmin/plans" element={<SuperadminRoute><PermissionGuard permission="manage_plans"><PlansPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/tenants" element={<SuperadminRoute><PermissionGuard permission="manage_tenants"><TenantsPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/partners" element={<SuperadminRoute><PermissionGuard permission="manage_partners"><PartnersPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/commissions" element={<SuperadminRoute><PermissionGuard permission="manage_commissions"><CommissionsPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/subscriptions" element={<SuperadminRoute><SubscriptionsPage /></SuperadminRoute>} />
            <Route path="/superadmin/leads" element={<SuperadminRoute><PermissionGuard permission="manage_leads"><LeadsPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/users" element={<SuperadminRoute><PermissionGuard permission="manage_users"><UsersPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/roles" element={<SuperadminRoute><PermissionGuard permission="manage_roles"><RolesPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/templates" element={<SuperadminRoute><PermissionGuard permission="manage_leads"><TemplatesPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/message-logs" element={<SuperadminRoute><PermissionGuard permission="manage_leads"><MessageLogsPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/settings" element={<SuperadminRoute><PermissionGuard permission="manage_settings"><SettingsPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/logs" element={<SuperadminRoute><PermissionGuard permission="manage_system_logs"><SystemLogsPage /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/payouts" element={<SuperadminRoute><PermissionGuard permission="manage_payouts"><SuperadminPayouts /></PermissionGuard></SuperadminRoute>} />
            <Route path="/superadmin/resources" element={<SuperadminRoute><PermissionGuard permission="manage_settings"><ResourcesPage /></PermissionGuard></SuperadminRoute>} />

            {/* Partner Routes */}
            <Route path="/partner/dashboard" element={<PartnerRoute><PermissionGuard permission="view_partner_dashboard"><PartnerDashboard /></PermissionGuard></PartnerRoute>} />
            <Route path="/partner/referrals" element={<PartnerRoute><PermissionGuard permission="view_own_referrals"><PartnerReferrals /></PermissionGuard></PartnerRoute>} />
            <Route path="/partner/commissions" element={<PartnerRoute><PermissionGuard permission="view_own_commissions"><PartnerCommissions /></PermissionGuard></PartnerRoute>} />
            <Route path="/partner/payouts" element={<PartnerRoute><PermissionGuard permission="manage_own_payouts"><PartnerPayouts /></PermissionGuard></PartnerRoute>} />
            <Route path="/partner/profile" element={<PartnerRoute><PermissionGuard permission="manage_own_profile"><PartnerProfile /></PermissionGuard></PartnerRoute>} />
            <Route path="/partner/resources" element={<PartnerRoute><PermissionGuard permission="view_partner_dashboard"><PartnerResourcesPage /></PermissionGuard></PartnerRoute>} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
