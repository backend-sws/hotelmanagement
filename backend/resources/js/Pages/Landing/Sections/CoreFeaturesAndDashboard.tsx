import { useState } from 'react';
import AnimatedSection from '@/Components/Site/AnimatedSection';
import FeatureCard from '@/Components/Site/FeatureCard';

export default function CoreFeaturesAndDashboard() {
    const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'fieldops'>('sales');

    const coreFeatures = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'GST Billing & e-Invoicing',
            description: 'Direct NIC portal integration for instantaneous IRN & QR code generation, B2B/B2C invoices, e-Way bills, and credit/debit notes.',
            badge: 'Govt Compliant',
            accentColor: 'indigo',
            href: '/gst-compliance',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            title: 'WhatsApp Auto-Invoicing',
            description: 'Send branded PDF invoices, payment receipts, and automated gentle overdue payment reminders right to your customer’s WhatsApp with 97% open rates.',
            badge: '97% Open Rate',
            accentColor: 'emerald',
            href: '/whatsapp-features',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            title: 'Smart Multi-Godown Stock',
            description: 'Batch-wise tracking, manufacturing & expiry management, barcode generator, automatic low-stock alerts, and warehouse transfers.',
            badge: 'Real-time Sync',
            accentColor: 'amber',
            href: '/features',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            ),
            title: 'High-Speed Barcode POS',
            description: 'Lightning-fast counter checkout with USB/Bluetooth barcode scanner, thermal receipt 2-inch/3-inch printing, and real-time cloud multi-device sync.',
            badge: 'Cloud Sync',
            accentColor: 'sky',
            href: '/features',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'WhatsApp Bot FieldOps',
            description: 'Field engineers and delivery staff mark attendance via WhatsApp selfie, GPS geofencing, submit watermarked photo work proof, and auto-calculate TA/DA.',
            badge: 'Gemini AI Vision',
            accentColor: 'violet',
            href: '/solutions/field-services',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'CA-Ready Financial Reports',
            description: 'Instant GSTR-1, GSTR-3B JSON exports, Profit & Loss statements, Balance Sheet, Ledger statements, and automated ITC reconciliation.',
            badge: '1-Click Export',
            accentColor: 'rose',
            href: '/features',
        },
    ];

    return (
        <section className="py-24 relative bg-white overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-50/60 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* S-06: CoreFeaturesGrid */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            All-in-One Operating System
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                            Built for everything your business does daily
                        </h2>
                        <p className="mt-4 text-slate-600 text-base sm:text-lg">
                            Replace 6 disconnected software tools with one harmonized cloud platform that runs on your phone, tablet, and desktop.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                        {coreFeatures.map((feat, idx) => (
                            <FeatureCard
                                key={idx}
                                icon={feat.icon}
                                title={feat.title}
                                description={feat.description}
                                badge={feat.badge}
                                accentColor={feat.accentColor}
                                href={feat.href}
                            />
                        ))}
                    </div>
                </AnimatedSection>

                {/* S-07: LiveDashboardPreview */}
                <AnimatedSection direction="up" delay={150}>
                    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-300/40 overflow-hidden">
                        {/* Browser Top Navigation Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-slate-100/80 border-b border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                </div>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 font-mono shadow-xs">
                                    <span>🔒 https://app.nexusbilling.in/dashboard</span>
                                </div>
                            </div>

                            {/* View Switcher Tabs */}
                            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('sales')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === 'sales'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Billing &amp; Revenue
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('inventory')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === 'inventory'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Stock &amp; Godown
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('fieldops')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === 'fieldops'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    WhatsApp FieldOps
                                </button>
                            </div>
                        </div>

                        {/* Interactive View Body */}
                        <div className="p-6 sm:p-8 bg-slate-50/40">
                            {activeTab === 'sales' && (
                                <div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                            <p className="text-xs font-semibold text-slate-500">Total Month Sales</p>
                                            <p className="text-2xl font-black text-slate-900 mt-1">₹14,82,500</p>
                                            <span className="text-xs text-emerald-600 font-bold">↑ 18.2% from last month</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                            <p className="text-xs font-semibold text-slate-500">Invoices Generated</p>
                                            <p className="text-2xl font-black text-slate-900 mt-1">1,247</p>
                                            <span className="text-xs text-indigo-600 font-bold">100% IRN / QR compliant</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                            <p className="text-xs font-semibold text-slate-500">Collected via WhatsApp UPI</p>
                                            <p className="text-2xl font-black text-emerald-600 mt-1">₹11,40,200</p>
                                            <span className="text-xs text-slate-500 font-medium">Instant bank settlement</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                            <p className="text-xs font-semibold text-slate-500">Overdue Follow-ups</p>
                                            <p className="text-2xl font-black text-amber-600 mt-1">₹1,18,000</p>
                                            <span className="text-xs text-slate-500 font-medium">6 auto-reminders scheduled</span>
                                        </div>
                                    </div>

                                    {/* Chart Box in Deep Slate Contrast */}
                                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-white">Daily Revenue &amp; GST Invoicing Velocity</h4>
                                                <p className="text-xs text-slate-400">September 2026 • Live synchronized</p>
                                            </div>
                                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                Active Stream
                                            </span>
                                        </div>
                                        {/* Bar Chart Visual */}
                                        <div className="h-44 flex items-end justify-between gap-2 pt-6">
                                            {[45, 60, 52, 75, 90, 68, 82, 95, 78, 88, 110, 135, 120, 145].map((val, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <div
                                                        style={{ height: `${val}px` }}
                                                        className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-violet-400 group-hover:from-emerald-400 group-hover:to-teal-300 transition-all duration-300 shadow-md"
                                                    />
                                                    <span className="text-[10px] text-slate-400 font-mono">D{i + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inventory' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl bg-white border border-slate-200">
                                            <p className="text-xs font-semibold text-slate-500">Total Godowns</p>
                                            <p className="text-xl font-bold text-slate-900 mt-1">4 Active Warehouses</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white border border-slate-200">
                                            <p className="text-xs font-semibold text-slate-500">Total SKU Inventory</p>
                                            <p className="text-xl font-bold text-slate-900 mt-1">2,840 Items Tracked</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                                            <p className="text-xs font-bold text-rose-700">Low Stock Warnings</p>
                                            <p className="text-xl font-bold text-rose-800 mt-1">3 SKUs Need Reorder</p>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3">Product Name</th>
                                                    <th className="px-4 py-3">Batch &amp; Expiry</th>
                                                    <th className="px-4 py-3">Godown</th>
                                                    <th className="px-4 py-3">Available Stock</th>
                                                    <th className="px-4 py-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                                <tr>
                                                    <td className="px-4 py-3 font-bold text-slate-900">UltraShield 20L Emulsion Paint</td>
                                                    <td className="px-4 py-3">BAT-2026-A • Exp 12/28</td>
                                                    <td className="px-4 py-3">Central Warehouse</td>
                                                    <td className="px-4 py-3 font-mono font-bold text-slate-900">142 Buckets</td>
                                                    <td className="px-4 py-3"><span className="text-emerald-700 font-bold">In Stock</span></td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-bold text-slate-900">Smart LED Panel 15W Round</td>
                                                    <td className="px-4 py-3">BAT-4491 • Exp N/A</td>
                                                    <td className="px-4 py-3">Branch Outlet #2</td>
                                                    <td className="px-4 py-3 font-mono font-bold text-slate-900">12 Units</td>
                                                    <td className="px-4 py-3"><span className="text-amber-700 font-bold">Low Stock Alert</span></td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-bold text-slate-900">Copper Flexible Wire 2.5mm 90m</td>
                                                    <td className="px-4 py-3">BAT-993 • Exp N/A</td>
                                                    <td className="px-4 py-3">Godown B (Depot)</td>
                                                    <td className="px-4 py-3 font-mono font-bold text-slate-900">85 Rolls</td>
                                                    <td className="px-4 py-3"><span className="text-emerald-700 font-bold">In Stock</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'fieldops' && (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="p-4 rounded-xl bg-white border border-slate-200">
                                            <p className="text-xs font-semibold text-slate-500">Field Staff On Duty</p>
                                            <p className="text-xl font-bold text-slate-900 mt-1">16 Technicians Live</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white border border-slate-200">
                                            <p className="text-xs font-semibold text-slate-500">AI Verified Proofs</p>
                                            <p className="text-xl font-bold text-emerald-600 mt-1">42 Tasks Validated</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white border border-slate-200">
                                            <p className="text-xs font-semibold text-slate-500">TA/DA Auto-Calculated</p>
                                            <p className="text-xl font-bold text-indigo-600 mt-1">₹3,410 Today</p>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between font-medium">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                            Staff punches &amp; GPS geofence tracks directly sync into HRMS Payroll without any manual spreadsheets.
                                        </span>
                                        <a href="/solutions/field-services" className="font-bold underline text-indigo-700">Explore FieldOps →</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
