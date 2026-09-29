import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function WholesaleSocialProofAndClosing() {
    // S-34 State: Interactive Wholesale ROI Calculator
    const [turnoverLakhs, setTurnoverLakhs] = useState(75); // ₹75 Lakhs monthly turnover
    const [dsoDaysReduction, setDsoDaysReduction] = useState(12); // 12 days faster recovery

    // ROI Calculations
    // Faster collection saves commercial interest cost @ 12% p.a.
    const monthlyTurnover = turnoverLakhs * 100000;
    const workingCapitalUnlocked = Math.round((monthlyTurnover / 30) * dsoDaysReduction);
    const annualInterestSaved = Math.round((workingCapitalUnlocked * 0.12));
    const manHoursSavedYearly = 720; // ~60 hours per month saved on manual billing & e-way generation

    // S-33 State: Wholesale FAQ Search
    const [faqSearch, setFaqSearch] = useState('');

    const faqs = [
        {
            q: 'Does Nexus Wholesale ERP work completely online in the cloud?',
            a: 'Yes, 100%. Nexus is a pure cloud-native ERP hosted on AWS Mumbai with 99.99% uptime. This ensures real-time stock sync across your central warehouse, city depots, sales reps in the field, and counter billing machines with zero synchronization delay or database corruption.'
        },
        {
            q: 'How does the automated NIC E-Way Bill generation work without going to the govt portal?',
            a: 'Nexus connects directly to the government NIC E-Way Bill API. As soon as you save a tax invoice or delivery challan above ₹50,000, Nexus pulls party details, calculates the exact highway distance between your godown PIN code and destination PIN code, and generates Part-A and Part-B with official E-Way Bill Number (EBN) in under 0.5 seconds.'
        },
        {
            q: 'Can we lock different prices for Grade A, B, and C wholesale customers?',
            a: 'Yes. You can assign customer grades or individual contract rate lists. When a sales order is booked for a Grade A distributor, the system automatically pulls their contracted price list, applies volume slab discounts, and enforces their approved credit limit.'
        },
        {
            q: 'How does broker (Dalal) commission tracking work in textiles and commodities?',
            a: 'You can tag one or multiple brokers to every sales invoice with a defined percentage (e.g. 1.5%) or fixed per-unit brokerage. Nexus maintains an independent Broker Commission Ledger, calculates TDS deductions, and generates commission payout vouchers once payments are recovered from the buyer.'
        },
        {
            q: 'Can our Chartered Accountant export data directly into Tally Prime?',
            a: 'Yes. Nexus provides a native 2-way Tally Prime XML and ODBC connector. Your accountant can import daily sales vouchers, purchase inward registers, party khata adjustments, and GST summaries into Tally Prime or Busy with a single click.'
        },
        {
            q: 'What happens if a wholesale party exceeds their credit limit or has overdue bills?',
            a: 'Nexus automatically triggers a Credit Limit Lock. The billing operator is blocked from generating a new invoice or delivery challan for that party. An authorized manager or business owner can unlock it on the fly using a secure mobile OTP.'
        },
        {
            q: 'How does the system handle Master Cartons, Inner Boxes, and Loose Pieces?',
            a: 'Nexus features automated multi-tier unit conversions. You can stock items in base pieces, but purchase and invoice in Master Cartons or Boxes. If a box is broken for loose sales, you can configure an optional loose-piece surcharge.'
        },
        {
            q: 'Can we manage multiple godowns with transit stock tracking?',
            a: 'Yes. When goods move from a central warehouse to a regional depot via Stock Transfer Notes (STN), the inventory is marked as "In-Transit" until the receiving godown completes a physical barcode audit and marks the GRN as verified.'
        }
    ];

    const filteredFaqs = faqs.filter(f => 
        f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
        f.a.toLowerCase().includes(faqSearch.toLowerCase())
    );

    return (
        <>
            {/* ========================================================================= */}
            {/* S-32: Verified Wholesale Case Studies                                     */}
            {/* ========================================================================= */}
            <section className="py-20 bg-slate-50 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
                            Real Distributor Outcomes
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            Trusted by Leading Wholesalers Across India
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            See how Indian superstockists, textile traders, and distributors modernized their operations with Nexus.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Case Study 1: FMCG Superstockist */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                        FMCG Superstockist
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">Bhiwandi, Maharashtra</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900">
                                    Singhania Logistics &amp; Distribution
                                </h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    Handling 42,000 monthly cartons across 1,800 retail stores with zero dispatch bottlenecks.
                                </p>

                                <div className="grid grid-cols-2 gap-3 my-6 text-center">
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-blue-600">-68%</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Billing Time Per Order</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-emerald-600">Zero</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">FEFO Expiry Losses</p>
                                    </div>
                                </div>
                            </div>
                            <blockquote className="text-xs text-slate-500 italic pt-4 border-t border-slate-100">
                                "The automatic case-to-box unit conversion and WhatsApp dispatch notifications cut our phone inquiry calls by 90%."
                            </blockquote>
                        </div>

                        {/* Case Study 2: Surat Textile Trader */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                                        Textile &amp; Garments
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">Surat, Gujarat</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900">
                                    Mahavir Rayon &amp; Silk Mills
                                </h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    Coordinating 180 independent cloth brokers and managing lump/thaan meterage with automated commission ledgers.
                                </p>

                                <div className="grid grid-cols-2 gap-3 my-6 text-center">
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-purple-600">180</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Brokers Managed</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-emerald-600">100%</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Dispute-Free Dalali</p>
                                    </div>
                                </div>
                            </div>
                            <blockquote className="text-xs text-slate-500 italic pt-4 border-t border-slate-100">
                                "Brokers now receive automated payment confirmation slips on WhatsApp as soon as buyer cheques clear. Absolute game changer."
                            </blockquote>
                        </div>

                        {/* Case Study 3: Pharma & Surgical C&F */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100">
                                        Pharma C&amp;F Depot
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">Lucknow, UP</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900">
                                    Apex Healthcare &amp; Surgicals
                                </h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    Managing 3,200 chemist accounts with mandatory drug license validations and automated Part-A E-Way bills.
                                </p>

                                <div className="grid grid-cols-2 gap-3 my-6 text-center">
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-teal-600">-14 Days</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">DSO Debt Recovery</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-emerald-600">0.4s</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">E-Way Bill Generation</p>
                                    </div>
                                </div>
                            </div>
                            <blockquote className="text-xs text-slate-500 italic pt-4 border-t border-slate-100">
                                "Automated WhatsApp payment reminders alone unlocked over ₹45 Lakhs in delayed receivables in the first 60 days."
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-34: Interactive Wholesale ROI & Working Capital Calculator              */}
            {/* ========================================================================= */}
            <section id="roi-calculator" className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-12 border border-slate-800 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            
                            {/* Sliders */}
                            <div className="lg:col-span-6">
                                <span className="text-xs font-black uppercase tracking-wider text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                                    B2B Financial Model
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                                    Calculate Your Working Capital Savings
                                </h3>
                                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                                    See how reducing your market collection cycle by just 8 to 15 days unlocks lakhs in idle capital and slashes commercial bank overdraft interest.
                                </p>

                                <div className="space-y-6 mt-8">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-300">Monthly B2B Turnover:</span>
                                            <span className="text-emerald-400 text-sm">₹{turnoverLakhs} Lakhs</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="15"
                                            max="300"
                                            step="5"
                                            value={turnoverLakhs}
                                            onChange={(e) => setTurnoverLakhs(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                            <span>₹15 Lakhs</span>
                                            <span>₹1.5 Crores</span>
                                            <span>₹3 Crores</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-300">Days Sales Outstanding (DSO) Reduction:</span>
                                            <span className="text-blue-400 text-sm">{dsoDaysReduction} Days Faster</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="5"
                                            max="25"
                                            value={dsoDaysReduction}
                                            onChange={(e) => setDsoDaysReduction(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                            <span>5 Days</span>
                                            <span>15 Days</span>
                                            <span>25 Days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ROI Results Display */}
                            <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Estimated Annual Financial Impact</p>
                                
                                <div className="mt-4">
                                    <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                                        ₹{workingCapitalUnlocked.toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-xs text-slate-300 mt-1">
                                        Immediate Working Capital Cash Flow Unlocked
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                                    <div>
                                        <p className="text-xs text-slate-400">Annual CC/OD Interest Saved</p>
                                        <p className="text-xl font-bold text-white mt-0.5">₹{annualInterestSaved.toLocaleString('en-IN')}</p>
                                        <p className="text-[10px] text-slate-400">@ 12% Bank CC Rate</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Man-Hours Saved in Billing</p>
                                        <p className="text-xl font-bold text-white mt-0.5">{manHoursSavedYearly} Hours</p>
                                        <p className="text-[10px] text-slate-400">~60 Hours/Month</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <Link
                                        href="/demo"
                                        className="w-full block text-center py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-xs font-black shadow-lg shadow-blue-500/30 transition-all"
                                    >
                                        Deploy Nexus Wholesale in Your Business &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-33: Wholesale FAQ Section with Search Filter                            */}
            {/* ========================================================================= */}
            <section className="py-20 bg-slate-50 border-b border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
                            Got Questions?
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            Frequently Asked Questions by Indian Wholesalers
                        </h2>
                        
                        {/* Search Box */}
                        <div className="mt-6 max-w-md mx-auto">
                            <input
                                type="text"
                                value={faqSearch}
                                onChange={(e) => setFaqSearch(e.target.value)}
                                placeholder="Search e-way bills, slab rates, tally sync..."
                                className="w-full px-4 py-2.5 rounded-full border border-slate-300 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredFaqs.map((faq, idx) => (
                            <details key={idx} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                                <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-sm sm:text-base select-none">
                                    <span>{faq.q}</span>
                                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 group-open:rotate-180 transition-transform shrink-0 ml-2">
                                        ▼
                                    </span>
                                </summary>
                                <p className="text-slate-600 text-xs sm:text-sm mt-3 pt-3 border-t border-slate-100 leading-relaxed font-normal">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-35: Wholesale Closing CTA Ribbon                                        */}
            {/* ========================================================================= */}
            <section className="py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold border border-white/20 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        14-Day Full Access • Zero Card Required
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
                        Supercharge Your Wholesale &amp; Distribution Operations Today
                    </h2>
                    <p className="text-blue-100 text-sm sm:text-lg max-w-2xl mx-auto mb-8 font-normal">
                        Join over 5,000+ Indian superstockists, textile traders, and distributors operating on India's #1 Cloud B2B ERP.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/demo"
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-900 hover:bg-blue-50 font-black text-sm shadow-xl shadow-blue-950/20 transition-all hover:scale-105"
                        >
                            Start Free 14-Day Trial &rarr;
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600/60 hover:bg-blue-600 border border-white/20 text-white font-bold text-sm transition-all"
                        >
                            Talk to Wholesale Architect
                        </Link>
                    </div>

                    <p className="text-[11px] text-blue-200 mt-6 font-medium">
                        ✓ 100% Real-Time Cloud Sync • ✓ Direct NIC E-Way Portal • ✓ Free Data Migration from Tally / Busy
                    </p>
                </div>
            </section>
        </>
    );
}
