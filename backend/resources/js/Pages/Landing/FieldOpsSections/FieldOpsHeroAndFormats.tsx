import React from 'react';
import { Link } from '@inertiajs/react';

interface FieldOpsHeroAndFormatsProps {
    selectedFormat: string;
    onSelectFormat: (format: string) => void;
}

export const FIELDOPS_FORMATS = [
    {
        id: 'hvac',
        name: 'HVAC & Commercial AC',
        icon: '❄️',
        tag: 'Compressor & Gas',
        headline: 'Gas Pressure Photo Verification, Compressor Serial Tracking & Seasonal AMC',
        points: [
            'Gemini AI Vision inspects refrigerant gauge PSI reading photo before and after gas refilling',
            'Compressor serial number barcode scanning to validate brand warranty eligibility',
            'Summer peak season technician load-balancing and emergency 2-hour breakdown tickets',
            'Pre-season comprehensive AC wet-servicing multi-point checklist with customer e-signature'
        ]
    },
    {
        id: 'water',
        name: 'RO & Home Appliances',
        icon: '💧',
        tag: 'TDS & Filter AMC',
        headline: 'TDS Meter Photo Proof, Membrane Replacement Logs & Automated AMC Dunning',
        points: [
            'Technician snaps photo of water TDS tester; AI extracts raw vs purified water numbers',
            'Automatic copper/sediment filter replacement countdown based on customer water hardness',
            'Scheduled WhatsApp AMC renewal alerts sent 30 days prior with direct UPI renewal link',
            'Motorcycle technician bag spare parts inventory tracking with daily restock indents'
        ]
    },
    {
        id: 'solar',
        name: 'Solar Rooftop & Inverters',
        icon: '☀️',
        tag: 'Tilt Angle & Wiring',
        headline: 'Solar Panel Tilt Verification, Inverter Generation Audit & Net-Metering Forms',
        points: [
            'AI Vision verifies solar module tilt angle, earthing wire grounding & cable tie finishing',
            'DISCOM net-metering inspection checklist with geo-tagged customer terrace photographs',
            'Quarterly scheduled solar panel chemical cleaning & string voltage degradation reports',
            'Technician safety harness, helmet, and high-voltage rubber gloves PPE audit before climb'
        ]
    },
    {
        id: 'elevators',
        name: 'Elevators & Escalators',
        icon: '🛗',
        tag: 'Safety & P1 Breakdown',
        headline: 'Mandatory Monthly Safety Inspections, P1 Passenger Trap Dispatches & Logbooks',
        points: [
            'High-priority P1 emergency ticket routing: auto-dials nearest technician if passenger is trapped',
            'State lift inspector statutory logbook generation ready for government safety audits',
            'Hoist rope tension, brake lining thickness, and governor test data entry via WhatsApp',
            'Annual comprehensive maintenance contract (AMC) milestone billing with Tally sync'
        ]
    },
    {
        id: 'telecom',
        name: 'Telecom, Fiber & CCTV',
        icon: '📡',
        tag: 'OTDR & Splicing',
        headline: 'Optical Fiber Splicing Proof, OTDR Loss Graphs & CCTV Camera Angles',
        points: [
            'Technician captures OTDR power meter screen; Gemini AI verifies dB loss below threshold',
            'CCTV installation camera angle photo proof matching customer security coverage map',
            'Underground cable drum serial scanning and meterage consumption per installation site',
            'Same-day customer internet restoration SLA escalation with automatic manager alerts'
        ]
    },
    {
        id: 'pest',
        name: 'Pest Control & Hygiene',
        icon: '🛡️',
        tag: 'Chemical Dosage',
        headline: 'Chemical Batch Dosage Verification, Termite Warranty & Food Factory Audits',
        points: [
            'Logging Bayer/Syngenta chemical batch numbers and dilution ratio for FSSAI audits',
            '1-Year / 5-Year Termite drill-and-fill warranty certificate generation with QR verification',
            'Commercial kitchen quarterly pest audit report with trap catch counts and pest activity score',
            'Commercial contract auto-invoicing on 1st of every month with WhatsApp payment links'
        ]
    }
];

export default function FieldOpsHeroAndFormats({
    selectedFormat,
    onSelectFormat
}: FieldOpsHeroAndFormatsProps) {
    const activeData = FIELDOPS_FORMATS.find(f => f.id === selectedFormat) || FIELDOPS_FORMATS[0];

    return (
        <>
            {/* ========================================================================= */}
            {/* S-01: FieldOps Hero Section                                               */}
            {/* ========================================================================= */}
            <section className="relative pt-32 sm:pt-36 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* Ambient Radial Lights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-80px] left-1/4 w-[500px] h-[500px] bg-teal-200/25 rounded-full blur-[140px]" />
                    <div className="absolute top-[60px] right-1/4 w-[450px] h-[450px] bg-indigo-200/25 rounded-full blur-[140px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
                        
                        {/* Left Column: Copy & Value Proposition */}
                        <div className="lg:col-span-7 text-left">
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-teal-200/90 text-xs font-bold text-slate-800 mb-6 shadow-xs shadow-teal-600/5">
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                                    Gemini 1.5 Vision Live
                                </span>
                                <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Zero App Downloads • 100% WhatsApp Native FieldOps
                                </span>
                                <span className="text-teal-600">&rarr;</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] font-black text-slate-900 tracking-[-0.035em] leading-[1.08] mb-6">
                                India's #1 WhatsApp-Native{' '}
                                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-700 bg-clip-text text-transparent">
                                    Field Service ERP
                                </span>
                                <br />
                                <span className="text-slate-900">
                                    &amp; AI-Verified FieldOps
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
                                Dispatch jobs on WhatsApp without app downloads. Track technicians on live GPS radar, verify before/after repair photos with Google Gemini AI Vision, and automate TA/DA travel expenses in real time.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                <Link
                                    href="/demo"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white text-base overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 shadow-xl shadow-teal-600/25 hover:shadow-teal-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-teal-500/20"
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
                                        <span className="w-7 h-7 rounded-full bg-teal-50 group-hover:bg-teal-100 text-teal-700 flex items-center justify-center text-xs transition-colors border border-teal-200/60 shadow-2xs">
                                            ▶
                                        </span>
                                        <span>Test WhatsApp Field Bot</span>
                                    </span>
                                </Link>
                            </div>

                            {/* Trust Proof */}
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Official Meta WhatsApp Cloud API
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Gemini 1.5 Flash Vision AI
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    100% Real-Time Cloud Sync
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Interactive Live FieldOps Radar Mockup */}
                        <div className="lg:col-span-5 relative">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-teal-600/25 via-emerald-600/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />

                            {/* Floating Badge: Gemini AI Verified */}
                            <div className="absolute -top-5 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 animate-float">
                                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-base border border-teal-200/80 shadow-2xs">
                                    🤖
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[11px] font-black text-slate-900">Gemini AI Vision Passed</p>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-[10px] text-slate-500">Compressor Replaced • Score: 98.4%</p>
                                </div>
                            </div>

                            {/* Master Terminal Box */}
                            <div className="relative rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl shadow-teal-950/20 p-5 sm:p-6 backdrop-blur-2xl overflow-hidden text-white">
                                {/* Titlebar */}
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                                        <span className="text-[11px] font-mono text-slate-400 ml-2">nexus-ops.in/field-radar</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 text-[10.5px] font-bold border border-teal-500/30">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        34 Techs Online
                                    </span>
                                </div>

                                {/* Live GPS Technician List */}
                                <div className="space-y-2 mb-4">
                                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
                                                RS
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white">Rahul Sharma (AC Senior Tech)</p>
                                                <p className="text-[10px] text-slate-400">Sector 62, Noida • Task #4910</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                On-Site Working
                                            </span>
                                            <p className="text-[9px] text-slate-400 mt-1">Geofence Verified</p>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center border border-blue-500/30">
                                                VK
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white">Vikram Kumar (RO Tech)</p>
                                                <p className="text-[10px] text-slate-400">En Route via Bike • Speed: 32 km/h</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                Driving (8 km)
                                            </span>
                                            <p className="text-[9px] text-slate-400 mt-1">TA/DA: +₹28.00</p>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 font-black text-xs flex items-center justify-center border border-teal-500/30">
                                                💬
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white">WhatsApp Bot: Job #4912 Closed</p>
                                                <p className="text-[10px] text-slate-400">Customer e-Sign &amp; ₹1,850 UPI Paid</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-emerald-400">Verified</span>
                                    </div>
                                </div>

                                {/* Bottom Live Bar */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[10.5px] text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Auto TA/DA GPS Meter Active
                                    </span>
                                    <span className="text-teal-400 font-bold">WhatsApp Sync: 0s Latency</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-02: Field Service Vertical Switcher (6 Specialized Industries)           */}
            {/* ========================================================================= */}
            <section className="py-16 bg-white border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-xs font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
                            Custom Built for Your Field Trade
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            Tailored for Every Major Indian Field Service Industry
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            Select your field operation to see how Nexus manages WhatsApp job dispatch, Gemini AI proof validation, van stock, and AMC renewals.
                        </p>
                    </div>

                    {/* Format Tabs Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-10">
                        {FIELDOPS_FORMATS.map((fmt) => {
                            const isSelected = selectedFormat === fmt.id;
                            return (
                                <button
                                    key={fmt.id}
                                    type="button"
                                    onClick={() => onSelectFormat(fmt.id)}
                                    className={`p-3 rounded-2xl text-center transition-all border ${
                                        isSelected 
                                            ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-[1.02]' 
                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{fmt.icon}</div>
                                    <p className="text-xs font-bold leading-tight">{fmt.name}</p>
                                    <span className={`text-[10px] inline-block mt-1 px-1.5 py-0.2 rounded font-medium ${
                                        isSelected ? 'bg-white/20 text-teal-100' : 'bg-slate-200/70 text-slate-600'
                                    }`}>
                                        {fmt.tag}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Vertical Showcase Card */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30 mb-2">
                                    <span>{activeData.icon}</span>
                                    <span>{activeData.name} Architecture</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-white">
                                    {activeData.headline}
                                </h3>
                            </div>
                            <Link
                                href="/demo"
                                className="px-5 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black shadow-md shadow-teal-500/30 transition-all shrink-0"
                            >
                                Schedule FieldOps Workflow Demo &rarr;
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
            {/* S-03: Live FieldOps Metrics Stream                                        */}
            {/* ========================================================================= */}
            <section className="py-8 bg-slate-950 text-white border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-3">
                            <p className="text-2xl sm:text-3xl font-black text-teal-400">12,480</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Daily WhatsApp Job Cards Closed</p>
                        </div>
                        <div className="p-3 border-l border-slate-800">
                            <p className="text-2xl sm:text-3xl font-black text-emerald-400">98.6%</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Gemini AI Vision Accuracy</p>
                        </div>
                        <div className="p-3 border-l border-slate-800">
                            <p className="text-2xl sm:text-3xl font-black text-indigo-400">0 App Downloads</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">100% WhatsApp Native</p>
                        </div>
                        <div className="p-3 border-l border-slate-800">
                            <p className="text-2xl sm:text-3xl font-black text-amber-400">-32%</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Fuel &amp; TA/DA Fraud Leakage</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-04: FieldOps Quick Action Hub (Jump Navigation)                         */}
            {/* ========================================================================= */}
            <div className="sticky top-[70px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 overflow-x-auto no-scrollbar gap-4">
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] shrink-0">FieldOps Modules:</span>
                    <a href="#whatsapp-dispatch" className="hover:text-teal-600 transition-colors shrink-0">📲 WhatsApp Job Cards</a>
                    <a href="#gps-radar" className="hover:text-teal-600 transition-colors shrink-0">📍 Live GPS Radar &amp; TA/DA</a>
                    <a href="#gemini-ai" className="hover:text-teal-600 transition-colors shrink-0">🤖 Gemini AI Vision Proof</a>
                    <a href="#van-stock" className="hover:text-teal-600 transition-colors shrink-0">🚐 Mobile Van Inventory</a>
                    <a href="#amc-contracts" className="hover:text-teal-600 transition-colors shrink-0">📅 AMC Lifecycle &amp; Renewal</a>
                    <a href="#fieldops-roi" className="hover:text-teal-600 transition-colors shrink-0">💰 FieldOps ROI Calculator</a>
                </div>
            </div>
        </>
    );
}
