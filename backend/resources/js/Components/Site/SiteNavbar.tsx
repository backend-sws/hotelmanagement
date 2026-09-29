import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

const products = [
    { 
        label: 'GST Billing & e-Invoice', 
        href: '/features', 
        icon: '🧾', 
        tag: 'NIC Direct',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        desc: 'B2B/B2C invoicing with live IRN & signed QR generation' 
    },
    { 
        label: 'Barcode Cloud POS', 
        href: '/solutions/retail', 
        icon: '🛒', 
        tag: '0.3s Speed',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        desc: 'High-speed counter checkout with real-time multi-till sync' 
    },
    { 
        label: 'Multi-Godown Inventory', 
        href: '/features', 
        icon: '📦', 
        tag: 'FEFO Engine',
        bg: 'bg-blue-50 text-blue-700 border-blue-100',
        desc: 'Front shelf vs godown sync, batch tracking & 45-day radar' 
    },
    { 
        label: 'HR & Indian Payroll', 
        href: '/features', 
        icon: '👥', 
        tag: 'Salary Slips',
        bg: 'bg-purple-50 text-purple-700 border-purple-100',
        desc: 'Geofenced selfie attendance, leave approvals & PF/ESIC' 
    },
    { 
        label: 'WhatsApp Bot FieldOps', 
        href: '/features/whatsapp', 
        icon: '📲', 
        tag: 'GPS Radar',
        bg: 'bg-teal-50 text-teal-700 border-teal-100',
        desc: 'Live map tracking, Gemini AI photo proof & auto TA/DA' 
    },
    { 
        label: 'Hotel & Restaurant PMS', 
        href: '/solutions/hotel', 
        icon: '🏨', 
        tag: 'Room & KOT',
        bg: 'bg-amber-50 text-amber-700 border-amber-100',
        desc: 'Room reservation matrix, guest folios & kitchen orders' 
    },
];

const solutions = [
    { 
        label: 'Retail & Supermarkets', 
        href: '/solutions/retail', 
        icon: '🛍️', 
        badge: '0.3s Barcode POS',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        desc: 'Weighing scale sync, 2D apparel matrix & store loyalty' 
    },
    { 
        label: 'Wholesale & Traders', 
        href: '/solutions/wholesale', 
        icon: '📦', 
        badge: 'B2B Credit Khata',
        bg: 'bg-blue-50 text-blue-700 border-blue-100',
        desc: 'Customer credit limits, bulk tier pricing & E-Way bills' 
    },
    { 
        label: 'Hotels & Dining', 
        href: '/solutions/hotel', 
        icon: '🏨', 
        badge: 'PMS & Table KOT',
        bg: 'bg-amber-50 text-amber-700 border-amber-100',
        desc: 'Room reservation calendar, folios & instant kitchen KOT' 
    },
    { 
        label: 'Field Service Teams', 
        href: '/solutions/field-services', 
        icon: '🔧', 
        badge: 'WhatsApp Dispatch',
        bg: 'bg-purple-50 text-purple-700 border-purple-100',
        desc: 'Job tickets on WhatsApp, GPS tracking & trip allowances' 
    },
    { 
        label: 'Manufacturing & Plants', 
        href: '/solutions/manufacturing', 
        icon: '🏭', 
        badge: 'BOM Costing',
        bg: 'bg-rose-50 text-rose-700 border-rose-100',
        desc: 'Multi-level BOM recipes, production stages & scrap calculation' 
    },
];

const resources = [
    { 
        label: 'GST Compliance Hub', 
        href: '/features/gst', 
        icon: '📊', 
        desc: 'GSTR-1 Table 7 B2CS, 3B reconciliation & composition rules' 
    },
    { 
        label: 'Knowledge Base & Blog', 
        href: '/blog', 
        icon: '📰', 
        desc: 'Industry best practices, billing guides & business case studies' 
    },
    { 
        label: 'Bank-Grade Security', 
        href: '/security', 
        icon: '🔒', 
        desc: 'AWS Mumbai, ISO 27001, TLS 1.3 encryption & daily cloud backups' 
    },
    { 
        label: 'About Company', 
        href: '/about', 
        icon: '🏢', 
        desc: 'Our journey, engineering team, values & enterprise roadmap' 
    },
];

export default function SiteNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [pinnedDropdown, setPinnedDropdown] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLDivElement | null>(null);
    const { url } = usePage();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 15);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { 
        setMobileOpen(false); 
        setActiveDropdown(null);
        setPinnedDropdown(null);
    }, [url]);

    // Close on outside click or Esc key
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setActiveDropdown(null);
                setPinnedDropdown(null);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveDropdown(null);
                setPinnedDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // 350ms forgiving grace period so mouse movement never triggers accidental closing
    const handleMouseEnter = (menuKey: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setActiveDropdown(menuKey);
    };

    const handleMouseLeave = () => {
        // If pinned by click, do NOT close on mouse leave
        if (pinnedDropdown) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 350);
    };

    const handleToggle = (menuKey: string) => {
        if (pinnedDropdown === menuKey) {
            setPinnedDropdown(null);
            setActiveDropdown(null);
        } else {
            setPinnedDropdown(menuKey);
            setActiveDropdown(menuKey);
        }
    };

    const isActive = (href: string) => url === href || (href !== '/' && url.startsWith(href));

    return (
        <header 
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-md shadow-slate-900/5' 
                    : 'bg-white/92 backdrop-blur-md border-b border-slate-200/70'
            }`}
        >
            {/* Top Announcement Bar */}
            {showBanner && (
                <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white text-[11.5px] py-1.5 px-4 hidden md:flex items-center justify-between border-b border-slate-800/80 transition-all">
                    <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                        <div className="flex items-center gap-2.5 mx-auto">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-bold text-[10px] border border-emerald-400/30 tracking-wider inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                LIVE DESK
                            </span>
                            <span className="text-slate-200 font-medium">
                                Direct Sales &amp; WhatsApp: <a href="https://wa.me/917479499718" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">+91 747 949 9718</a> • Official Meta WhatsApp Cloud API &amp; 0.3s Barcode POS
                            </span>
                            <Link 
                                href="/demo" 
                                className="text-indigo-300 hover:text-white font-bold inline-flex items-center gap-1 transition-colors ml-1 underline decoration-indigo-400/50 underline-offset-2 hover:decoration-white"
                            >
                                <span>Book Live Demo</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowBanner(false)}
                            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors text-xs"
                            title="Dismiss announcement"
                            aria-label="Dismiss banner"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Top Luxury Gradient Accent Hairline */}
            <div className="h-[2px] bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 w-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-[70px]">

                    {/* Left: Brand Logo & Cloud Status Badge */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0 py-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 flex items-center justify-center shadow-md shadow-indigo-600/25 group-hover:scale-105 group-hover:shadow-indigo-600/40 transition-all border border-indigo-500/30">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl font-black text-slate-900 tracking-tight">
                                Nexus<span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">Billing</span>
                            </span>
                            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/80 shadow-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Cloud ERP
                            </span>
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation Bar */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {/* 1. Products Dropdown */}
                        <div 
                            className="relative py-2"
                            onMouseEnter={() => handleMouseEnter('products')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                type="button"
                                onClick={() => handleToggle('products')}
                                className={`flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-xl transition-all ${
                                    activeDropdown === 'products' 
                                        ? 'text-indigo-600 bg-indigo-50/90 font-bold shadow-xs' 
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                                }`}
                            >
                                <span>Products</span>
                                <svg 
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                        activeDropdown === 'products' ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                                    }`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Container with Full Invisible Bridge so Cursor Never Leaves */}
                            {activeDropdown === 'products' && (
                                <div 
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 pointer-events-auto"
                                    onMouseEnter={() => handleMouseEnter('products')}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {/* Invisible Hover Shield connecting trigger to menu */}
                                    <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />
                                    
                                    <div className="w-[740px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/15 p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                        <div className="grid grid-cols-3 gap-3">
                                            {/* Products Grid: 2 Columns */}
                                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                                {products.map((p) => (
                                                    <Link 
                                                        key={p.label} 
                                                        href={p.href} 
                                                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all group"
                                                    >
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg border shadow-xs ${p.bg}`}>
                                                            {p.icon}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center justify-between gap-1">
                                                                <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                                                                    {p.label}
                                                                </p>
                                                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                                                    {p.tag}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                                                                {p.desc}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Right Featured Column */}
                                            <div className="bg-gradient-to-br from-indigo-50/90 via-violet-50/50 to-blue-50/70 border border-indigo-100/90 rounded-xl p-4 flex flex-col justify-between">
                                                <div>
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider mb-2.5 shadow-xs">
                                                        <span>⚡ Spotlight</span>
                                                    </div>
                                                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                                                        Direct NIC Invoicing Engine
                                                    </h4>
                                                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                                                        Generate B2B E-Invoices with IRN &amp; signed QR codes instantly without any third-party gateway charges.
                                                    </p>
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-indigo-100">
                                                    <Link 
                                                        href="/features" 
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 group"
                                                    >
                                                        <span>Explore All 34 Modules</span>
                                                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Feature Strip */}
                                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between px-2 text-xs">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="font-medium">100% Real-Time Cloud Sync across All Devices &amp; Counters</span>
                                            </div>
                                            <Link 
                                                href="/features" 
                                                className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <span>Interactive Spec Sheet &rarr;</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Solutions Dropdown */}
                        <div 
                            className="relative py-2"
                            onMouseEnter={() => handleMouseEnter('solutions')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                type="button"
                                onClick={() => handleToggle('solutions')}
                                className={`flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-xl transition-all ${
                                    activeDropdown === 'solutions' 
                                        ? 'text-indigo-600 bg-indigo-50/90 font-bold shadow-xs' 
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                                }`}
                            >
                                <span>Solutions</span>
                                <svg 
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                        activeDropdown === 'solutions' ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                                    }`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {activeDropdown === 'solutions' && (
                                <div 
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 pointer-events-auto"
                                    onMouseEnter={() => handleMouseEnter('solutions')}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {/* Invisible Hover Shield */}
                                    <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

                                    <div className="w-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/15 p-3.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                        <div className="space-y-1">
                                            {solutions.map((s) => (
                                                <Link 
                                                    key={s.href} 
                                                    href={s.href} 
                                                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base border shadow-xs ${s.bg}`}>
                                                            {s.icon}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                                {s.label}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                                                {s.desc}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md shrink-0 ml-2">
                                                        {s.badge}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between px-2 text-xs">
                                            <span className="text-slate-500 font-medium">Looking for multi-chain deployment?</span>
                                            <Link 
                                                href="/contact" 
                                                className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
                                            >
                                                Talk to Architect &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Features Direct Link */}
                        <Link 
                            href="/features" 
                            className={`px-3.5 py-2 text-[13.5px] font-semibold rounded-xl transition-all ${
                                isActive('/features') 
                                    ? 'text-indigo-600 bg-indigo-50/90 font-bold' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                            }`}
                        >
                            Features
                        </Link>

                        {/* 4. Pricing Direct Link */}
                        <Link 
                            href="/pricing" 
                            className={`px-3.5 py-2 text-[13.5px] font-semibold rounded-xl transition-all ${
                                isActive('/pricing') 
                                    ? 'text-indigo-600 bg-indigo-50/90 font-bold' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                            }`}
                        >
                            Pricing
                        </Link>

                        {/* 5. Resources Dropdown */}
                        <div 
                            className="relative py-2"
                            onMouseEnter={() => handleMouseEnter('resources')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                type="button"
                                onClick={() => handleToggle('resources')}
                                className={`flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-xl transition-all ${
                                    activeDropdown === 'resources' 
                                        ? 'text-indigo-600 bg-indigo-50/90 font-bold shadow-xs' 
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                                }`}
                            >
                                <span>Resources</span>
                                <svg 
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                        activeDropdown === 'resources' ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                                    }`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {activeDropdown === 'resources' && (
                                <div 
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 pointer-events-auto"
                                    onMouseEnter={() => handleMouseEnter('resources')}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {/* Invisible Hover Shield */}
                                    <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

                                    <div className="w-[380px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/15 p-3 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                        <div className="space-y-1">
                                            {resources.map((r) => (
                                                <Link 
                                                    key={r.href} 
                                                    href={r.href} 
                                                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all group"
                                                >
                                                    <span className="text-xl mt-0.5">{r.icon}</span>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                            {r.label}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                                            {r.desc}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between px-2 text-xs">
                                            <span className="text-slate-500 font-medium">Need immediate onboarding help?</span>
                                            <Link 
                                                href="/contact" 
                                                className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
                                            >
                                                Help Desk &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right: Actions */}
                    <div className="hidden lg:flex items-center gap-2.5">
                        {/* Direct WhatsApp Call/Chat Pill */}
                        <a 
                            href="https://wa.me/917479499718" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/90 rounded-xl border border-emerald-200/80 transition-all shadow-2xs group"
                            title="Chat on WhatsApp"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>💬 +91 747 949 9718</span>
                        </a>

                        {/* Book Demo Button */}
                        <Link 
                            href="/demo" 
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-xl border border-slate-200/80 hover:border-indigo-200 transition-all shadow-2xs"
                        >
                            <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Book Demo</span>
                        </Link>

                        <div className="h-4 w-px bg-slate-200/80" />

                        {/* Sign In Button */}
                        <Link 
                            href="/login" 
                            className="text-[13px] font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-100/80 transition-colors"
                        >
                            Sign In
                        </Link>

                        {/* Primary Action Button */}
                        <Link
                            href="/demo"
                            className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-full shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap shrink-0 border border-indigo-500/30"
                        >
                            <span>Start Free Trial</span>
                            <svg 
                                className="w-3.5 h-3.5 text-indigo-200 group-hover:text-white group-hover:translate-x-0.5 transition-all" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-t border-slate-200 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-6 space-y-4">
                        {/* Direct Mobile Contact Banner */}
                        <a
                            href="https://wa.me/917479499718"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-xl">💬</span>
                                <div>
                                    <div className="text-xs font-black">WhatsApp &amp; Phone Support</div>
                                    <div className="text-[11px] font-mono font-bold text-emerald-700">+91 747 949 9718</div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">Chat Now →</span>
                        </a>

                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Products</p>
                            <div className="space-y-1">
                                {products.map((p) => (
                                    <Link 
                                        key={p.href + p.label} 
                                        href={p.href} 
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="text-base">{p.icon}</span>
                                        <span className="text-xs font-semibold text-slate-800">{p.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Solutions</p>
                            <div className="space-y-1">
                                {solutions.map((s) => (
                                    <Link 
                                        key={s.href} 
                                        href={s.href} 
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="text-base">{s.icon}</span>
                                        <span className="text-xs font-semibold text-slate-800">{s.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="flex flex-col gap-1 text-xs font-bold text-slate-700">
                            <Link href="/features" className="px-3 py-2.5 rounded-xl hover:bg-slate-50">✨ Features (34 Modules)</Link>
                            <Link href="/pricing" className="px-3 py-2.5 rounded-xl hover:bg-slate-50">💰 Pricing Plans</Link>
                            <Link href="/features/gst" className="px-3 py-2.5 rounded-xl hover:bg-slate-50">📊 GST Compliance Hub</Link>
                            <Link href="/blog" className="px-3 py-2.5 rounded-xl hover:bg-slate-50">📰 Knowledge Base &amp; Blog</Link>
                            <Link href="/contact" className="px-3 py-2.5 rounded-xl hover:bg-slate-50">📞 Contact &amp; Support</Link>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="flex flex-col gap-2 pt-1">
                            <Link 
                                href="/demo" 
                                className="text-center py-3 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Book Live 1-on-1 Demo
                            </Link>
                            <Link 
                                href="/demo" 
                                className="text-center py-3 text-xs font-black bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl shadow-md"
                            >
                                Start 14-Day Free Trial &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
