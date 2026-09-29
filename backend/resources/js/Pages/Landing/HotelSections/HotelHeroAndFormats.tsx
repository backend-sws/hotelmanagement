import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

interface HotelHeroAndFormatsProps {
    selectedFormat: string;
    onSelectFormat: (format: string) => void;
}

export const HOSPITALITY_FORMATS = [
    {
        id: 'resorts',
        name: 'Hotels & Heritage Resorts',
        icon: '🏨',
        tag: 'PMS & Folios',
        headline: 'Visual Room Calendar, Govt C-Form Check-in & Unified Guest Folios',
        points: [
            'Color-coded interactive room availability grid (Occupied, Vacant, Cleaning, Maintenance)',
            '30-second guest check-in with camera ID upload (Aadhaar / Passport) & police C-Form export',
            'Consolidated single folio: Room tariff + Laundry + Room Service F&B + Spa charges',
            'Automated midnight night audit with daily room revenue posting & tax summary'
        ]
    },
    {
        id: 'finedining',
        name: 'Fine Dining & Multi-Cuisine',
        icon: '🍽️',
        tag: 'Table & KOT',
        headline: 'Floor Plan Customizer, Waiter Captain App & Multi-Kitchen KOT Routing',
        points: [
            'Interactive table layout (AC Hall, Rooftop, Garden Lawn, Family Lounge) with occupancy colors',
            'Captain mobile tablet app to punch orders table-side with instant kitchen ticket printing',
            'Automatic item routing: Tandoor items to Tandoor printer, Chinese to Main Kitchen, Drinks to Bar',
            'Table merge for large parties, table seat transfer & split bill tender across Cash/UPI/Card'
        ]
    },
    {
        id: 'qsr',
        name: 'QSRs, Cafes & Bakeries',
        icon: '☕',
        tag: 'Token & Kiosk',
        headline: 'Lightning 0.3s Counter Checkout, Token Display Screen & Combo Combos',
        points: [
            'Order token display screen with "Preparing" and "Ready for Pickup" audio chimes',
            'Self-ordering QR code stands allowing customers to order & pay without standing in queues',
            'Bakery batch expiry tracking & daily unsold stock write-off logs',
            'Add-on modifier engine: Extra cheese, spice levels, sugar preferences with dynamic pricing'
        ]
    },
    {
        id: 'cloudkitchen',
        name: 'Cloud Kitchens & Delivery',
        icon: '🛵',
        tag: 'Swiggy & Zomato',
        headline: 'Centralized Swiggy & Zomato Auto-Accept with Kitchen Display System (KDS)',
        points: [
            'Direct integration with Swiggy and Zomato: auto-accept orders with single kitchen KOT print',
            'Touchscreen Kitchen Display System (KDS) with color-coded countdown preparation timers',
            'Delivery rider dispatch queue with OTP handover and packaging status updates',
            'Multi-brand virtual kitchen support: run 5 virtual food brands from a single kitchen license'
        ]
    },
    {
        id: 'dhaba',
        name: 'Highway Dhabas & Family Dining',
        icon: '🥘',
        tag: 'High-Volume Turn',
        headline: 'High-Speed Table Clearance, Theft-Proof Cashier Drawers & Anti-Void OTP',
        points: [
            'Rapid queue clearance: turn tables 25% faster during peak weekend lunch & dinner rushes',
            'Manager OTP mandatory for KOT cancellation, item voids, or bill discounts to stop theft',
            'Shift cash drawer balance reconciliation matching physical cash with cashier login counts',
            'WhatsApp digital receipt sent instantly to guest mobile saving thermal paper costs'
        ]
    },
    {
        id: 'bars',
        name: 'Pubs, Bars & Microbreweries',
        icon: '🍺',
        tag: 'Liquor Excise',
        headline: 'State Liquor Excise Register, 750ml Bottle-to-Peg Sync & Happy Hours',
        points: [
            'Automated liquor inventory: 750ml bottle auto-converts to 30ml / 60ml pegs upon billing',
            'Daily State Excise Form register generated automatically ready for inspection audits',
            'Configurable Happy Hours: 2+1 on craft beers or 25% off cocktails between 5:00 PM to 8:00 PM',
            'Separate bar billing counter with dual food and liquor tax split invoices'
        ]
    }
];

export default function HotelHeroAndFormats({
    selectedFormat,
    onSelectFormat
}: HotelHeroAndFormatsProps) {
    const [mockupMode, setMockupMode] = useState<'rooms' | 'restaurant'>('rooms');
    const activeData = HOSPITALITY_FORMATS.find(f => f.id === selectedFormat) || HOSPITALITY_FORMATS[0];

    return (
        <>
            {/* ========================================================================= */}
            {/* S-01: Hotel & Restaurant Hero Section                                     */}
            {/* ========================================================================= */}
            <section className="relative pt-32 sm:pt-36 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* Ambient Radial Lights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-80px] left-1/4 w-[500px] h-[500px] bg-amber-200/25 rounded-full blur-[140px]" />
                    <div className="absolute top-[60px] right-1/4 w-[450px] h-[450px] bg-indigo-200/25 rounded-full blur-[140px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
                        
                        {/* Left Column: Copy & Value Proposition */}
                        <div className="lg:col-span-7 text-left">
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-200/90 text-xs font-bold text-slate-800 mb-6 shadow-xs shadow-amber-600/5">
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                                    Hospitality Cloud 2.4
                                </span>
                                <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    100% Real-Time Cloud Sync • Room PMS &amp; Restaurant KOT
                                </span>
                                <span className="text-amber-600">&rarr;</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] font-black text-slate-900 tracking-[-0.035em] leading-[1.08] mb-6">
                                India's #1 Cloud{' '}
                                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 bg-clip-text text-transparent">
                                    Hotel PMS &amp; Restaurant
                                </span>
                                <br />
                                <span className="text-slate-900">
                                    POS Operating System
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
                                One unified cloud platform for boutique hotels, resorts, fine-dining restaurants &amp; cloud kitchens. Visual room calendar, instant kitchen KOT routing, waiter captain app, recipe inventory, and unified guest folios.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                <Link
                                    href="/demo"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white text-base overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 shadow-xl shadow-amber-600/25 hover:shadow-amber-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-amber-500/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Start Free 14-Day Trial
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </Link>

                                <Link
                                    href="/demo"
                                    className="inline-flex items-center justify-center px-6 py-4 rounded-full font-bold text-slate-800 text-base bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all group"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-full bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center text-xs transition-colors border border-amber-200/60 shadow-2xs">
                                            ▶
                                        </span>
                                        <span>Watch Hospitality Demo</span>
                                    </span>
                                </Link>
                            </div>

                            {/* Trust Proof */}
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    FSSAI &amp; GST Compliant
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    4,000+ Indian Properties
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    100% Real-Time Cloud Sync
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Interactive Dual Mockup Terminal (Room PMS vs Table KOT) */}
                        <div className="lg:col-span-5 relative">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-amber-600/25 via-orange-600/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />

                            {/* Floating Badge: 0.3s KOT Printed */}
                            <div className="absolute -top-5 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 animate-float">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base border border-amber-200/80 shadow-2xs">
                                    🍳
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[11px] font-black text-slate-900">KOT #482 to Kitchen</p>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-[10px] text-slate-500">Table T-08 • 0.3s Thermal Print</p>
                                </div>
                            </div>

                            {/* Master Terminal Box */}
                            <div className="relative rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl shadow-amber-950/20 p-5 sm:p-6 backdrop-blur-2xl overflow-hidden text-white">
                                {/* Titlebar with View Toggle */}
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                                        <span className="text-[11px] font-mono text-slate-400 ml-2">nexus-hotel.in/live</span>
                                    </div>

                                    {/* Mockup Mode Selector */}
                                    <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setMockupMode('rooms')}
                                            className={`px-2 py-1 rounded transition-colors ${
                                                mockupMode === 'rooms' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Room PMS
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMockupMode('restaurant')}
                                            className={`px-2 py-1 rounded transition-colors ${
                                                mockupMode === 'restaurant' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Table KOT
                                        </button>
                                    </div>
                                </div>

                                {mockupMode === 'rooms' ? (
                                    /* Room PMS Grid View */
                                    <div>
                                        <div className="flex items-center justify-between mb-3 text-xs">
                                            <span className="font-bold text-slate-300">Live Room Occupancy Grid</span>
                                            <span className="text-emerald-400 font-bold">24 / 28 Occupied (86%)</span>
                                        </div>

                                        {/* Color Matrix */}
                                        <div className="grid grid-cols-4 gap-2 mb-4">
                                            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-center">
                                                <p className="text-xs font-black text-blue-300">101</p>
                                                <p className="text-[9px] text-slate-400">Dr. Mehta</p>
                                                <span className="text-[8px] px-1 bg-blue-500/20 text-blue-300 rounded">Occupied</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                                                <p className="text-xs font-black text-emerald-300">102</p>
                                                <p className="text-[9px] text-slate-400">Deluxe</p>
                                                <span className="text-[8px] px-1 bg-emerald-500/20 text-emerald-300 rounded">Vacant</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
                                                <p className="text-xs font-black text-amber-300">103</p>
                                                <p className="text-[9px] text-slate-400">Maid Clean</p>
                                                <span className="text-[8px] px-1 bg-amber-500/20 text-amber-300 rounded">Cleaning</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-center">
                                                <p className="text-xs font-black text-blue-300">104</p>
                                                <p className="text-[9px] text-slate-400">Rahul V.</p>
                                                <span className="text-[8px] px-1 bg-blue-500/20 text-blue-300 rounded">Occupied</span>
                                            </div>
                                        </div>

                                        {/* Active Guest Folio Snapshot */}
                                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-white">Active Folio: Room #101</span>
                                                <span className="text-emerald-400 font-mono">₹14,850</span>
                                            </div>
                                            <div className="mt-2 space-y-1 text-[10.5px] text-slate-400">
                                                <div className="flex justify-between">
                                                    <span>2 Nights Deluxe Stay (18% GST):</span>
                                                    <span className="text-slate-200">₹11,800</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>In-Room Dining KOT #389:</span>
                                                    <span className="text-slate-200">₹2,450</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Laundry Service (4 items):</span>
                                                    <span className="text-slate-200">₹600</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Restaurant Table KOT View */
                                    <div>
                                        <div className="flex items-center justify-between mb-3 text-xs">
                                            <span className="font-bold text-slate-300">Dining Floor: AC Hall</span>
                                            <span className="text-amber-400 font-bold">14 Active KOTs</span>
                                        </div>

                                        {/* Table Grid */}
                                        <div className="grid grid-cols-4 gap-2 mb-4">
                                            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
                                                <p className="text-xs font-black text-amber-300">T-01</p>
                                                <p className="text-[9px] text-slate-400">4 Guests</p>
                                                <span className="text-[8px] px-1 bg-amber-500/20 text-amber-300 rounded">Dining</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                                                <p className="text-xs font-black text-emerald-300">T-02</p>
                                                <p className="text-[9px] text-slate-400">2 Seats</p>
                                                <span className="text-[8px] px-1 bg-emerald-500/20 text-emerald-300 rounded">Available</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
                                                <p className="text-xs font-black text-amber-300">T-03</p>
                                                <p className="text-[9px] text-slate-400">6 Guests</p>
                                                <span className="text-[8px] px-1 bg-amber-500/20 text-amber-300 rounded">Bill Print</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-center">
                                                <p className="text-xs font-black text-blue-300">T-04</p>
                                                <p className="text-[9px] text-slate-400">Captain App</p>
                                                <span className="text-[8px] px-1 bg-blue-500/20 text-blue-300 rounded">KOT Sent</span>
                                            </div>
                                        </div>

                                        {/* Active KOT Stream */}
                                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-white">Live KOT #482 (Table T-01)</span>
                                                <span className="text-amber-400 text-[10px]">Preparing (8 min)</span>
                                            </div>
                                            <div className="mt-2 space-y-1 text-[10.5px] text-slate-400">
                                                <p className="text-slate-200 font-medium">1x Butter Chicken • 3x Butter Naan • 1x Dal Makhani</p>
                                                <p className="text-[10px] text-slate-500">Auto-Deducted from Raw Material Recipe Stock</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Live Bar */}
                                <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-800/80 text-[10.5px] text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        100% Real-Time Cloud Sync
                                    </span>
                                    <span className="text-amber-400 font-bold">Kitchen Display Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-02: Hospitality Format Switcher (6 Specialized Verticals)               */}
            {/* ========================================================================= */}
            <section className="py-16 bg-white border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                            Engineered for Hospitality
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            Tailored for Every Major Indian Hospitality Format
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            Select your property type to see how Nexus manages room folios, kitchen displays, table turns, and food cost variance.
                        </p>
                    </div>

                    {/* Format Tabs Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-10">
                        {HOSPITALITY_FORMATS.map((fmt) => {
                            const isSelected = selectedFormat === fmt.id;
                            return (
                                <button
                                    key={fmt.id}
                                    type="button"
                                    onClick={() => onSelectFormat(fmt.id)}
                                    className={`p-3 rounded-2xl text-center transition-all border ${
                                        isSelected 
                                            ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20 scale-[1.02]' 
                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{fmt.icon}</div>
                                    <p className="text-xs font-bold leading-tight">{fmt.name}</p>
                                    <span className={`text-[10px] inline-block mt-1 px-1.5 py-0.2 rounded font-medium ${
                                        isSelected ? 'bg-white/20 text-amber-100' : 'bg-slate-200/70 text-slate-600'
                                    }`}>
                                        {fmt.tag}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Vertical Showcase Card */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
                                    <span>{activeData.icon}</span>
                                    <span>{activeData.name} Architecture</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-white">
                                    {activeData.headline}
                                </h3>
                            </div>
                            <Link
                                href="/demo"
                                className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/30 transition-all shrink-0"
                            >
                                Schedule Property Demo &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                            {activeData.points.map((pt, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                        ✓
                                    </span>
                                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                                        {pt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-03: Live Hospitality Metrics Stream                                     */}
            {/* ========================================================================= */}
            <section className="py-8 bg-slate-950 text-white border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-3">
                            <p className="text-2xl sm:text-3xl font-black text-amber-400">94.2%</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Peak Season Room Occupancy</p>
                        </div>
                        <div className="p-3 border-l border-slate-800">
                            <p className="text-2xl sm:text-3xl font-black text-emerald-400">0.3s</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Kitchen KOT Print Latency</p>
                        </div>
                        <div className="p-3 border-l border-slate-800">
                            <p className="text-2xl sm:text-3xl font-black text-indigo-400">100%</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Real-Time Cloud Synchronization</p>
                        </div>
                        <div className="p-3 border-l border-slate-800">
                            <p className="text-2xl sm:text-3xl font-black text-rose-400">Zero</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Kitchen Theft &amp; Untracked Food</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-04: Hospitality Quick Action Hub (Jump Navigation)                      */}
            {/* ========================================================================= */}
            <div className="sticky top-[70px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 overflow-x-auto no-scrollbar gap-4">
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] shrink-0">Hospitality Modules:</span>
                    <a href="#room-pms" className="hover:text-amber-600 transition-colors shrink-0">🏨 Room Calendar Grid</a>
                    <a href="#table-kot" className="hover:text-amber-600 transition-colors shrink-0">🍽️ Table KOT &amp; Captain App</a>
                    <a href="#recipe-bom" className="hover:text-amber-600 transition-colors shrink-0">🍲 Recipe Stock Deduction</a>
                    <a href="#swiggy-sync" className="hover:text-amber-600 transition-colors shrink-0">🛵 Swiggy &amp; Zomato Sync</a>
                    <a href="#hospitality-gst" className="hover:text-amber-600 transition-colors shrink-0">🧾 Hotel GST 5% vs 18%</a>
                    <a href="#hospitality-roi" className="hover:text-amber-600 transition-colors shrink-0">💰 Table Turn ROI</a>
                </div>
            </div>
        </>
    );
}
