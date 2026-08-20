import React, { useState, useEffect } from 'react';
import { useHotelInvoiceSettings, useUpdateHotelInvoiceSettings, type HotelInvoiceSettings } from '../api/useHotelInvoiceSettings';
import HotelInvoiceLivePreview from '../components/HotelInvoiceLivePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageLoadingSkeleton } from '@/components/ui/PageLoadingSkeleton';
import { toast } from 'sonner';
import { 
  Receipt, 
  Save, 
  Layers, 
  Sliders, 
  Eye, 
  Palette, 
  UtensilsCrossed, 
  CreditCard, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Printer, 
  QrCode,
  FileText,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function HotelBillingSettingsPage() {
  const { data: remoteSettings, isLoading } = useHotelInvoiceSettings();
  const updateSettings = useUpdateHotelInvoiceSettings();

  const [activeTab, setActiveTab] = useState<'invoice' | 'receipt' | 'kot'>('invoice');

  const [settings, setSettings] = useState<HotelInvoiceSettings>({
    template: 'default',
    receipt_template: 'voucher',
    signature_label: 'Hotel Manager / Front Desk',
    default_terms: "1. Standard Check-In time is 12:00 PM & Check-Out time is 11:00 AM.\n2. Valid government photo ID is mandatory at the time of check-in.\n3. Goods once billed will not be refunded.\n4. Subject to local jurisdiction.",
    check_in_time: '12:00 PM',
    check_out_time: '11:00 AM',
    default_bank_details: '',
    upi_id: '',
    fields: {
      show_logo: true,
      logo_size: 50,
      show_gstin: true,
      show_stay_dates: true,
      show_guest_id_proof: true,
      show_room_details: true,
      show_folio_breakdown: true,
      show_tax_breakdown: true,
      show_payment_breakdown: true,
      show_amount_in_words: true,
      show_qr_code: true,
      show_terms: true,
      show_signature: true,
      show_receiver_signature: false,
    },
    styles: {
      primary_color: '#1e293b',
      secondary_color: '#64748b',
      border_color: '#e2e8f0',
      font_size: 12,
      font_family: 'Inter',
      line_spacing: 1.4,
      margin_top: 10,
      margin_bottom: 10,
      margin_left: 10,
      margin_right: 10,
      border_radius: 6,
      frame_style: 'none',
    },
    kot_settings: {
      show_restaurant_name: true,
      show_server_name: true,
      show_special_instructions: true,
      font_size: 12,
    },
  });

  useEffect(() => {
    if (remoteSettings) {
      setSettings(prev => ({
        ...prev,
        ...remoteSettings,
        fields: { ...prev.fields, ...(remoteSettings.fields || {}) },
        styles: { ...prev.styles, ...(remoteSettings.styles || {}) },
        kot_settings: { ...prev.kot_settings, ...(remoteSettings.kot_settings || {}) },
      }));
    }
  }, [remoteSettings]);

  const handleSave = () => {
    updateSettings.mutate(settings, {
      onSuccess: () => toast.success('Hotel Billing & Invoice settings saved successfully!'),
      onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to save settings'),
    });
  };

  const updateFieldToggle = (key: keyof HotelInvoiceSettings['fields']) => {
    setSettings(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [key]: !prev.fields[key],
      },
    }));
  };

  const updateKotToggle = (key: keyof HotelInvoiceSettings['kot_settings']) => {
    setSettings(prev => ({
      ...prev,
      kot_settings: {
        ...prev.kot_settings,
        [key]: !prev.kot_settings[key],
      },
    }));
  };

  // Color theme presets
  const colorPresets = [
    { name: 'Royal Navy', primary: '#1e293b', secondary: '#64748b', border: '#e2e8f0' },
    { name: 'Luxury Gold', primary: '#1c1917', secondary: '#78716c', border: '#e7e5e4' },
    { name: 'Emerald Resort', primary: '#064e3b', secondary: '#047857', border: '#a7f3d0' },
    { name: 'Classic Burgundy', primary: '#4a044e', secondary: '#701a75', border: '#f5d0fe' },
    { name: 'Modern Indigo', primary: '#312e81', secondary: '#4338ca', border: '#c7d2fe' },
  ];

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setSettings(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        primary_color: preset.primary,
        secondary_color: preset.secondary,
        border_color: preset.border,
      },
    }));
  };

  if (isLoading) return <PageLoadingSkeleton />;

  const templateOptions = [
    { id: 'default', name: 'Standard Folio', desc: 'Balanced 2-column layout with boxed stay metadata', badge: 'Popular' },
    { id: 'modern', name: 'Modern Clean', desc: 'Minimalist accents, sleek left borders & header pill', badge: 'Clean' },
    { id: 'classic', name: 'Classic Ledger', desc: 'Traditional boxed hotel ledger with centered banner', badge: 'Formal' },
    { id: 'premium', name: 'Executive Dark', desc: 'Luxury dark bar header & gold metallic accents', badge: 'Luxury' },
    { id: 'pos', name: 'POS Thermal (80mm)', desc: 'Compact thermal roll for front desk receipt printers', badge: 'Thermal' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] p-4 md:p-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Hotel Invoicing, Receipts &amp; KOT Setup
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                Dedicated Hotel Billing
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure room stay folio bills, money payment receipts, kitchen order tickets, policies, and QR payments.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2 shrink-0 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{updateSettings.isPending ? 'Saving...' : 'Save Settings'}</span>
        </Button>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Settings Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Folio Invoice Template Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Hotel Folio Bill Template
              </h3>
              <span className="text-xs text-slate-400">5 Available Designs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {templateOptions.map(t => {
                const isSelected = settings.template === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSettings(prev => ({ ...prev, template: t.id as any }));
                      setActiveTab('invoice');
                    }}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-500/10 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/40 dark:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                      }`}>
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Theme Colors & Typography */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-500" />
                Color Theme &amp; Typography
              </h3>
              <span className="text-xs text-slate-400">Branding</span>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Color Palette Presets</label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map(cp => {
                  const isActive = settings.styles.primary_color === cp.primary;
                  return (
                    <button
                      key={cp.name}
                      type="button"
                      onClick={() => applyPreset(cp)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold ring-1 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: cp.primary }} />
                      <span>{cp.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Primary Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.styles.primary_color}
                    onChange={e => setSettings(prev => ({ ...prev, styles: { ...prev.styles, primary_color: e.target.value } }))}
                    className="w-8 h-8 p-0.5 rounded-lg border border-slate-300 dark:border-white/20 cursor-pointer bg-transparent"
                  />
                  <Input
                    value={settings.styles.primary_color}
                    onChange={e => setSettings(prev => ({ ...prev, styles: { ...prev.styles, primary_color: e.target.value } }))}
                    className="rounded-xl font-mono text-xs h-8"
                  />
                </div>
              </div>

              {/* Font Family Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Font Family</label>
                <select
                  value={settings.styles.font_family}
                  onChange={e => setSettings(prev => ({ ...prev, styles: { ...prev.styles, font_family: e.target.value } }))}
                  className="w-full h-8 px-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Inter">Inter (Clean Modern)</option>
                  <option value="Roboto">Roboto (Crisp)</option>
                  <option value="Poppins">Poppins (Geometric)</option>
                  <option value="Outfit">Outfit (Luxury Tech)</option>
                  <option value="Lato">Lato (Warm)</option>
                  <option value="Arial">Arial (Standard)</option>
                  <option value="Times New Roman">Times New Roman (Serif)</option>
                  <option value="Georgia">Georgia (Classic Luxury)</option>
                </select>
              </div>

              {/* Font Size Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Base Font Size</label>
                  <span className="text-xs font-bold text-indigo-600">{settings.styles.font_size}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="15"
                  value={settings.styles.font_size}
                  onChange={e => setSettings(prev => ({ ...prev, styles: { ...prev.styles, font_size: Number(e.target.value) } }))}
                  className="w-full"
                />
              </div>

              {/* Line Spacing */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Line Spacing</label>
                  <span className="text-xs font-bold text-indigo-600">{settings.styles.line_spacing}x</span>
                </div>
                <input
                  type="range"
                  min="1.1"
                  max="1.8"
                  step="0.1"
                  value={settings.styles.line_spacing}
                  onChange={e => setSettings(prev => ({ ...prev, styles: { ...prev.styles, line_spacing: Number(e.target.value) } }))}
                  className="w-full"
                />
              </div>

              {/* Logo Size */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Logo Height</label>
                  <span className="text-xs font-bold text-indigo-600">{settings.fields.logo_size || 50}px</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={settings.fields.logo_size || 50}
                  onChange={e => setSettings(prev => ({ ...prev, fields: { ...prev.fields, logo_size: Number(e.target.value) } }))}
                  className="w-full"
                />
              </div>

              {/* Frame Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Outer Frame</label>
                <select
                  value={settings.styles.frame_style}
                  onChange={e => setSettings(prev => ({ ...prev, styles: { ...prev.styles, frame_style: e.target.value as any } }))}
                  className="w-full h-8 px-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="none">None (Borderless)</option>
                  <option value="solid">Solid Border</option>
                  <option value="dashed">Dashed Border</option>
                  <option value="dotted">Dotted Border</option>
                  <option value="elegant">Elegant Double</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Hotel Policies & Timings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Check-In / Out Timings &amp; Terms
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Standard Check-In</label>
                <Input
                  value={settings.check_in_time}
                  onChange={e => setSettings(prev => ({ ...prev, check_in_time: e.target.value }))}
                  placeholder="e.g. 12:00 PM"
                  className="rounded-xl h-9 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Standard Check-Out</label>
                <Input
                  value={settings.check_out_time}
                  onChange={e => setSettings(prev => ({ ...prev, check_out_time: e.target.value }))}
                  placeholder="e.g. 11:00 AM"
                  className="rounded-xl h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Hotel Policies &amp; Stay Terms</label>
              <Textarea
                rows={3}
                value={settings.default_terms}
                onChange={e => setSettings(prev => ({ ...prev, default_terms: e.target.value }))}
                placeholder="Hotel terms and stay conditions..."
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Authorized Signatory Label</label>
              <Input
                value={settings.signature_label}
                onChange={e => setSettings(prev => ({ ...prev, signature_label: e.target.value }))}
                placeholder="e.g. Hotel Manager / Front Desk"
                className="rounded-xl h-9 text-xs"
              />
            </div>
          </div>

          {/* 4. Payment Bank & UPI ID */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-500" />
              Settlement Bank &amp; UPI QR
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">UPI ID (For Guest Payment QR)</label>
              <Input
                value={settings.upi_id}
                onChange={e => setSettings(prev => ({ ...prev, upi_id: e.target.value }))}
                placeholder="e.g. hotelstay@hdfcbank"
                className="rounded-xl h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Hotel Bank Account Details</label>
              <Textarea
                rows={2}
                value={settings.default_bank_details}
                onChange={e => setSettings(prev => ({ ...prev, default_bank_details: e.target.value }))}
                placeholder="Bank: HDFC Bank | A/C: 50200012345678 | IFSC: HDFC0001234"
                className="rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          {/* 5. Field Display Toggles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              Invoice Field Visibility
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'show_logo', label: 'Hotel Logo' },
                { key: 'show_gstin', label: 'GSTIN Number' },
                { key: 'show_stay_dates', label: 'Stay Dates & Times' },
                { key: 'show_guest_id_proof', label: 'Guest ID Proof No.' },
                { key: 'show_room_details', label: 'Room No & Type' },
                { key: 'show_folio_breakdown', label: 'Extra Folio Charges' },
                { key: 'show_tax_breakdown', label: 'CGST / SGST Tax Breakdown' },
                { key: 'show_payment_breakdown', label: 'Payment Receipts History' },
                { key: 'show_amount_in_words', label: 'Amount in Words' },
                { key: 'show_qr_code', label: 'Verification / UPI QR' },
                { key: 'show_terms', label: 'Hotel Policies & Terms' },
                { key: 'show_signature', label: 'Signatory Line' },
              ].map(item => (
                <label
                  key={item.key}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(settings.fields[item.key as keyof typeof settings.fields])}
                    onChange={() => updateFieldToggle(item.key as any)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. KOT Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-rose-500" />
              KOT (Kitchen Order Ticket) Setup
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.kot_settings.show_restaurant_name)}
                  onChange={() => updateKotToggle('show_restaurant_name')}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Show Restaurant Name on Ticket</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.kot_settings.show_server_name)}
                  onChange={() => updateKotToggle('show_server_name')}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Show Server / Captain Name</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.kot_settings.show_special_instructions)}
                  onChange={() => updateKotToggle('show_special_instructions')}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Highlight Kitchen Special Instructions</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Live Preview (7 cols) */}
        <div className="lg:col-span-7 sticky top-6 space-y-3">
          
          {/* Segmented Document Tabs */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-2 rounded-2xl shadow-sm">
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant={activeTab === 'invoice' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('invoice')}
                className={`rounded-xl font-bold text-xs ${
                  activeTab === 'invoice' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Hotel Folio Bill
              </Button>

              <Button
                size="sm"
                variant={activeTab === 'receipt' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('receipt')}
                className={`rounded-xl font-bold text-xs ${
                  activeTab === 'receipt' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                Payment Receipt Voucher
              </Button>

              <Button
                size="sm"
                variant={activeTab === 'kot' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('kot')}
                className={`rounded-xl font-bold text-xs ${
                  activeTab === 'kot' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5 mr-1.5" />
                KOT Kitchen Ticket
              </Button>
            </div>

            <div className="flex items-center gap-2 pr-2">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Interactive
              </span>
            </div>
          </div>

          {/* Realistic Document Workbench Canvas */}
          <div className="bg-slate-200/80 dark:bg-[#07070a] border border-slate-300 dark:border-white/10 rounded-2xl p-4 sm:p-8 flex justify-center items-start min-h-[720px] overflow-auto shadow-inner custom-scrollbar">
            
            {/* Conditional Paper Shell based on document mode */}
            {activeTab === 'invoice' && settings.template !== 'pos' && (
              <div className="w-full max-w-[720px] bg-white text-slate-900 p-8 rounded-lg shadow-2xl border border-slate-200/80 transition-all duration-200">
                <HotelInvoiceLivePreview
                  settings={settings}
                  previewTab="invoice"
                  isPrintView={false}
                />
              </div>
            )}

            {activeTab === 'invoice' && settings.template === 'pos' && (
              <div className="w-full max-w-[360px] bg-white text-slate-900 px-4 py-6 rounded shadow-2xl border-t-8 border-b-8 border-slate-800/20 transition-all duration-200">
                <HotelInvoiceLivePreview
                  settings={settings}
                  previewTab="invoice"
                  isPrintView={false}
                />
              </div>
            )}

            {activeTab === 'receipt' && (
              <div className="w-full max-w-[650px] transition-all duration-200">
                <HotelInvoiceLivePreview
                  settings={settings}
                  previewTab="receipt"
                  isPrintView={false}
                />
              </div>
            )}

            {activeTab === 'kot' && (
              <div className="w-full max-w-[360px] bg-white text-slate-900 px-4 py-6 rounded shadow-2xl border-t-8 border-b-8 border-slate-800/20 transition-all duration-200">
                <HotelInvoiceLivePreview
                  settings={settings}
                  previewTab="kot"
                  isPrintView={false}
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
