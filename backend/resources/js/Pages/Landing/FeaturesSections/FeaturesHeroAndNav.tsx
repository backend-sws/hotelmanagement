import { useState } from 'react';
import { Link } from '@inertiajs/react';

interface FeaturesHeroAndNavProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    selectedCategory: string;
    onSelectCategory: (cat: string) => void;
    activeNav: string;
    onNavClick: (navId: string) => void;
}

const CATEGORIES = [
    { id: 'all', label: 'All 34 Features', count: 34 },
    { id: 'billing', label: 'GST & Invoicing', count: 7 },
    { id: 'pos', label: 'Retail POS', count: 4 },
    { id: 'inventory', label: 'Inventory & PO', count: 4 },
    { id: 'hr', label: 'HR & Payroll', count: 5 },
    { id: 'fieldops', label: 'FieldOps & AI', count: 4 },
    { id: 'hospitality', label: 'Hotel & F&B', count: 2 },
    { id: 'reports', label: 'Finance & Reports', count: 5 },
    { id: 'security', label: 'Security & API', count: 3 },
];

const JUMP_LINKS = [
    { id: 'gst-billing', label: '🧾 GST & Invoicing' },
    { id: 'automation', label: '⚡ Automation & WhatsApp' },
    { id: 'retail-pos', label: '🛒 Barcode POS' },
    { id: 'inventory-po', label: '📦 Inventory & Godown' },
    { id: 'hr-payroll', label: '👥 HR & Payroll' },
    { id: 'fieldops-ai', label: '📍 FieldOps & Gemini AI' },
    { id: 'hospitality', label: '🏨 Hotel & Restaurant' },
    { id: 'finance-reports', label: '📊 Finance & Ledgers' },
    { id: 'security-api', label: '🔒 API & Security' },
    { id: 'roadmap', label: '🚀 Roadmap' },
];

export default function FeaturesHeroAndNav({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onSelectCategory,
    activeNav,
    onNavClick,
}: FeaturesHeroAndNavProps) {
    return (
        <>
            {/* ========================================================= */}
            {/* SECTION 1: FeaturesHero                                  */}
            {/* ========================================================= */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-[#fafafa] border-b border-slate-200">
                {/* Background decorative glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-indigo-200/40 via-blue-200/30 to-emerald-200/30 blur-3xl -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                        <span>34 Enterprise Modules Included In All Plans</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-5xl mx-auto">
                        Everything Your Business Needs.{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600">
                            Zero Bloat. Zero Per-Invoice Tax.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Replace 8 fragmented subscriptions with one unified cloud operating system. From NIC-integrated
                        e-Invoicing and real-time cloud POS to WhatsApp bot geo-attendance, Gemini AI proof validation, and hotel PMS.
                    </p>

                    {/* Quick Metric Pills */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-slate-700">
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-emerald-600">✓</span> 100% Real-Time Cloud POS
                        </div>
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-emerald-600">✓</span> Govt NIC Direct E-Invoice IRN
                        </div>
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-emerald-600">✓</span> Official Meta WhatsApp Cloud API
                        </div>
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-emerald-600">✓</span> Google Gemini 1.5 Vision AI
                        </div>
                    </div>

                    {/* Interactive Feature Search & Category Chips */}
                    <div className="mt-12 max-w-3xl mx-auto bg-white p-3 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-200">
                        <div className="relative flex items-center">
                            <svg
                                className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search any feature (e.g. e-way bill, barcode pos, geofence punch, gemini ai, hotel folio)..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => onSearchChange('')}
                                    className="absolute right-4 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                                >
                                    CLEAR
                                </button>
                            )}
                        </div>

                        {/* Category filter pills */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                            <span className="text-slate-400 font-medium whitespace-nowrap pl-1">Filters:</span>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => onSelectCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                                        selectedCategory === cat.id
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                    }`}
                                >
                                    {cat.label}{' '}
                                    <span
                                        className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                                            selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                                        }`}
                                    >
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 2: FeatureNavJump (Sticky Navigation Bar)        */}
            {/* ========================================================= */}
            <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 text-xs sm:text-sm">
                        <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider whitespace-nowrap mr-2 hidden md:inline">
                            Quick Jump:
                        </span>
                        {JUMP_LINKS.map((link) => (
                            <button
                                key={link.id}
                                type="button"
                                onClick={() => onNavClick(link.id)}
                                className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                                    activeNav === link.id
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
