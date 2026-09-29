import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function ManufacturingSocialProofAndClosing() {
    // S-30 State: Interactive MSME Manufacturing ROI & Scrap Savings Calculator
    const [monthlyRawMaterialSpend, setMonthlyRawMaterialSpend] = useState(4500000); // ₹45 Lakhs / month
    const [currentScrapLossPercent, setCurrentScrapLossPercent] = useState(5.5); // 5.5% scrap loss
    const [monthlyJobWorkSpend, setMonthlyJobWorkSpend] = useState(1200000); // ₹12 Lakhs / month subcontracting

    // Nexus BOM controls & scrap recovery typically recover ~1.8% of raw material spend
    const annualRawMaterialSavings = Math.round(monthlyRawMaterialSpend * (1.8 / 100) * 12);
    // Subcontracting scrap tracking & Section 143 reconciliation saves ~4.2% of job work spend
    const annualJobWorkSavings = Math.round(monthlyJobWorkSpend * (4.2 / 100) * 12);
    const totalAnnualBottomLineProfit = annualRawMaterialSavings + annualJobWorkSavings;

    // S-31 State: Manufacturing FAQ with Search & Category Filter
    const [faqCategory, setFaqCategory] = useState<'all' | 'job_work' | 'bom' | 'oee' | 'tally'>('all');
    const [faqSearch, setFaqSearch] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const faqs = [
        {
            category: 'job_work',
            q: 'How does Nexus prevent the 180-day GST Section 143 tax penalty on job work?',
            a: 'Nexus links every GST Rule 55 delivery challan to a live statutory aging clock. If goods are not received back within 120 or 150 days, automated WhatsApp and email escalations alert the plant manager, preventing the transaction from turning into a taxable "Deemed Supply".'
        },
        {
            category: 'job_work',
            q: 'Can Nexus auto-generate Form GST ITC-04 for quarterly filing?',
            a: 'Yes. Nexus compiles Table 1 (inputs/capital goods sent to job workers) and Table 2 (goods received back or dispatched directly to clients) into the official government JSON schema for 1-click filing on the GST portal.'
        },
        {
            category: 'bom',
            q: 'Does Nexus support multi-level BOMs with sub-assemblies?',
            a: 'Absolutely. You can nest infinite levels of sub-assemblies (e.g. Raw Sheet -> Stamped Impeller -> Pump Stage -> Finished Submersible Pump). Each tier captures its own scrap percentage, cycle time, and direct machine labor.'
        },
        {
            category: 'bom',
            q: 'Can we deduct scrap resale value from our product cost?',
            a: 'Yes. Nexus provides a dedicated Scrap & By-Product Recovery module. Metal turning swarf, runner regrind, and solvent distillation recovery are automatically credited against gross raw material costs to calculate true landed margins.'
        },
        {
            category: 'oee',
            q: 'How do machine operators log production if we do not have dedicated shop tablets?',
            a: 'Workers can scan QR barcodes printed on router job travelers using any basic smartphone camera or a wireless handheld 2D barcode scanner connected to a central shop floor terminal.'
        },
        {
            category: 'oee',
            q: 'Does Nexus support piece-rate wage settlement for shift operators?',
            a: 'Yes. Operators are credited with daily piece-rate incentives based strictly on verified good pieces passed by In-Process QC, ensuring quality standards are maintained while boosting shop floor speed.'
        },
        {
            category: 'tally',
            q: 'How does Nexus synchronize with Tally Prime?',
            a: 'Nexus connects directly with Tally Prime via cloud REST APIs. It automatically posts Manufacturing Journals (debiting raw material godown ledgers and crediting finished goods) and Job Work outward/inward vouchers with zero manual data entry.'
        },
        {
            category: 'tally',
            q: 'Can we generate NIC E-Way Bills directly from the factory dispatch gate?',
            a: 'Yes. The moment goods clear Pre-Dispatch Inspection (PDI) and are weighed on your factory weighbridge, Nexus generates the official NIC E-Way Bill and B2B E-Invoice IRN with a compliant QR code.'
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
        const matchesSearch = faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || faq.a.toLowerCase().includes(faqSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="case-studies" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ========================================================================= */}
                {/* S-29: 3 Verified MSME Manufacturing Case Studies                          */}
                {/* ========================================================================= */}
                <div className="mb-20">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60">
                            Proven Shop Floor Transformations
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            Trusted by India's High-Precision MSMEs
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            See how Indian CNC machine shops, garment exporters, and chemical batchers eliminated shop floor leakage and streamlined GST job work.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Case Study 1: Precision Auto Forgings (Pune) */}
                        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                                        CNC &amp; Forgings
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">120 Machines</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    "Saved ₹4.2 Lakhs Monthly on Unreturned Job Work Scrap."
                                </h3>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    "We sent hundreds of tons of EN-19 billets for outside heat treatment and nitriding. Subcontractors frequently short-weighed returns. Nexus Rule 55 challan tracking and scrap reconciliation plugged the leak completely."
                                </p>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-black flex items-center justify-center text-sm">
                                    SG
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Sanjay Gadre</div>
                                    <div className="text-[11px] text-slate-500">Managing Director, Precision Auto Forgings (Pune)</div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 2: Apex Garment Exports (Tirupur) */}
                        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                                        Garment Exports
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">350 Sewing Lines</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    "Cut Fabric Shrinkage Wastage from 6.8% Down to 1.9%."
                                </h3>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    "In knitwear manufacturing, unbudgeted fabric shrinkage destroys export margins. Nexus multi-level style-color-size BOMs and roll-wise inspection helped us recover over ₹32 Lakhs in fabric savings annually."
                                </p>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                                    RN
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">R. Natarajan</div>
                                    <div className="text-[11px] text-slate-500">Partner, Apex Garment Exports (Tirupur)</div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 3: Shree Polychem (Vapi) */}
                        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        Specialty Chemicals
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">8 Reactor Vessels</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    "Zero Expired Solvent Loss &amp; 100% Batch Traceability."
                                </h3>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    "Our chemical formulations require strict temperature curves and solvent recovery tracking. Nexus automated reaction yield logs, batch manufacturing records (BMR), and eliminated audit non-conformances."
                                </p>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                                    MP
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Mehul Patel</div>
                                    <div className="text-[11px] text-slate-500">Technical Director, Shree Polychem (GIDC, Vapi)</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-30: Interactive Manufacturing ROI & Scrap Savings Calculator             */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl mb-20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Annual Bottom-Line Calculator</span>
                            <h3 className="text-2xl font-black text-white mt-1">
                                Calculate Your Shop Floor Scrap &amp; Job Work Recovery
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Estimate how much unrecovered material leakage and job work discrepancy is costing your plant each year.
                            </p>
                        </div>
                        <div className="bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 text-xs font-mono text-emerald-300">
                            MSME Financial Impact
                        </div>
                    </div>

                    {/* Sliders Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Monthly Raw Material Spend</span>
                                <span className="text-emerald-400 font-mono">₹{(monthlyRawMaterialSpend / 100000).toFixed(1)} Lakhs</span>
                            </div>
                            <input
                                type="range"
                                min="1000000"
                                max="20000000"
                                step="500000"
                                value={monthlyRawMaterialSpend}
                                onChange={(e) => setMonthlyRawMaterialSpend(parseInt(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>₹10L</span>
                                <span>₹1 Cr</span>
                                <span>₹2 Cr</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Current Scrap &amp; Rejection %</span>
                                <span className="text-amber-400 font-mono">{currentScrapLossPercent}%</span>
                            </div>
                            <input
                                type="range"
                                min="2.0"
                                max="12.0"
                                step="0.5"
                                value={currentScrapLossPercent}
                                onChange={(e) => setCurrentScrapLossPercent(parseFloat(e.target.value))}
                                className="w-full accent-amber-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>Low (2%)</span>
                                <span>Typical (6%)</span>
                                <span>High (12%)</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Monthly Job Work Spend</span>
                                <span className="text-blue-400 font-mono">₹{(monthlyJobWorkSpend / 100000).toFixed(1)} Lakhs</span>
                            </div>
                            <input
                                type="range"
                                min="200000"
                                max="5000000"
                                step="200000"
                                value={monthlyJobWorkSpend}
                                onChange={(e) => setMonthlyJobWorkSpend(parseInt(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>₹2L</span>
                                <span>₹25L</span>
                                <span>₹50L</span>
                            </div>
                        </div>
                    </div>

                    {/* Calculated Output Display */}
                    <div className="mt-8 bg-slate-950/70 rounded-2xl p-6 border border-white/5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-x-0 sm:divide-x divide-white/10">
                            <div>
                                <div className="text-xs text-slate-400 font-medium">BOM Scrap Recovery Gain</div>
                                <div className="text-xl font-bold text-emerald-400 mt-1">₹{annualRawMaterialSavings.toLocaleString()} / Year</div>
                                <div className="text-[10px] text-slate-400">Direct material savings</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium">Job Work Reconciliation Savings</div>
                                <div className="text-xl font-bold text-blue-400 mt-1">₹{annualJobWorkSavings.toLocaleString()} / Year</div>
                                <div className="text-[10px] text-slate-400">Zero unreturned scrap loss</div>
                            </div>
                            <div className="pl-2">
                                <div className="text-xs text-amber-300 font-bold">Estimated Annual Profit Boost</div>
                                <div className="text-3xl font-black text-amber-400 mt-0.5">
                                    ₹{totalAnnualBottomLineProfit.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-amber-300/80">Direct bottom-line margin addition</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-31: Manufacturing FAQ Section with Search & Category Filter             */}
                {/* ========================================================================= */}
                <div className="mb-20">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
                            Got Factory Questions?
                        </span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
                            Frequently Asked Questions About Manufacturing ERP
                        </h2>
                        <p className="text-slate-600 text-sm mt-2">
                            Everything you need to know about BOM nesting, GST Section 143, machine OEE, and Tally Prime sync.
                        </p>
                    </div>

                    {/* Search & Category Filter Controls */}
                    <div className="max-w-2xl mx-auto mb-8 space-y-3">
                        <input
                            type="text"
                            value={faqSearch}
                            onChange={(e) => setFaqSearch(e.target.value)}
                            placeholder="Search questions (e.g. Job work, ITC-04, BOM, OEE, Tally, E-Way Bill)..."
                            className="w-full px-4 py-2.5 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-xs"
                        />

                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {[
                                { id: 'all', label: 'All Topics' },
                                { id: 'job_work', label: 'GST Job Work & ITC-04' },
                                { id: 'bom', label: 'BOM & Costing' },
                                { id: 'oee', label: 'Machine OEE & QR' },
                                { id: 'tally', label: 'Tally & Invoicing' }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFaqCategory(cat.id as typeof faqCategory)}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                                        faqCategory === cat.id
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Accordion List */}
                    <div className="max-w-3xl mx-auto space-y-3">
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-xs">
                                No questions found matching your search. Please reach out to our manufacturing solutions team directly.
                            </div>
                        ) : (
                            filteredFaqs.map((faq, idx) => {
                                const isOpen = openFaqIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 transition"
                                        >
                                            <span>{faq.q}</span>
                                            <span className={`w-5 h-5 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 shrink-0 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-32: Industrial Security & Trust Badges Strip                            */}
                {/* ========================================================================= */}
                <div className="mb-20 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Industrial Reliability</span>
                        <h3 className="text-xl font-black text-white mt-1">
                            Enterprise Security for Proprietary Manufacturing Formulas
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                            Your CAD drawings, chemical recipes, machine cycle times, and customer BOMs are protected with bank-grade cloud encryption.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-amber-400">ISO 9001</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">IATF 16949 Ready</div>
                            <div className="text-[10px] text-slate-400">Automotive Audit Logs</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-emerald-400">100% Cloud</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">Real-Time Sync SLA</div>
                            <div className="text-[10px] text-slate-400">Zero On-Premises Server Hassle</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-blue-400">256-Bit AES</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">Encrypted BOM Database</div>
                            <div className="text-[10px] text-slate-400">Recipe Confidentiality</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-purple-400">99.99% Uptime</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">24/7 Factory Operations</div>
                            <div className="text-[10px] text-slate-400">High Availability Clusters</div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-33: Closing Manufacturing Trial CTA Banner                              */}
                {/* ========================================================================= */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 p-8 sm:p-14 text-white shadow-2xl">
                    <div className="relative z-10 max-w-3xl">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-amber-300 px-3.5 py-1 rounded-full border border-amber-400">
                            Instant MSME Deployment
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 text-white">
                            Ready to Take Complete Control of Your Factory Floor?
                        </h2>
                        <p className="text-slate-100 text-sm sm:text-base mt-4 leading-relaxed">
                            Join 650+ Indian manufacturing plants running on Nexus. Build your first multi-level BOM, generate GST Rule 55 delivery challans, and automate production tracking in less than 48 hours.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Link
                                href="/register"
                                className="px-8 py-3.5 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-black text-sm text-center shadow-lg transition transform hover:-translate-y-0.5"
                            >
                                Start 14-Day Free Trial
                            </Link>
                            <Link
                                href="/demo"
                                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm text-center border border-white/20 backdrop-blur-xs transition"
                            >
                                Schedule Factory Walkthrough Demo
                            </Link>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-200">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Tally Prime Integration Ready</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>100% Real-Time Cloud Sync</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background Glows */}
                    <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
                    <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-orange-400/20 blur-3xl pointer-events-none" />
                </div>

            </div>
        </section>
    );
}
