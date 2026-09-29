import React, { useState } from 'react';

export default function GstSocialProofAndClosing() {
    // S-28 State: Interactive GST Penalty Savings Calculator
    const [monthlyPurchasesLakhs, setMonthlyPurchasesLakhs] = useState<number>(45);
    const [supplierDefaultRate, setSupplierDefaultRate] = useState<number>(6);

    // Calculated metrics
    const monthlyDefaultPurchases = (monthlyPurchasesLakhs * 100000 * (supplierDefaultRate / 100));
    const estimatedTaxCreditAt18 = monthlyDefaultPurchases * 0.18;
    const annualItcSaved = Math.round(estimatedTaxCreditAt18 * 12);
    const annualInterestSavedAt18 = Math.round(annualItcSaved * 0.18);
    const totalStatutorySavings = annualItcSaved + annualInterestSavedAt18 + 50000; // includes penalty prevention

    // S-29 State: FAQ Filter & Active Accordion
    const [faqSearch, setFaqSearch] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "Who is mandated to generate E-Invoices under GST in India?",
            a: "Currently, businesses with an aggregate annual turnover exceeding ₹5 Crores in any preceding financial year from 2017-18 onwards are legally mandated to generate B2B E-Invoices through an authorized IRP. Nexus automates this end-to-end with direct NIC portal integration."
        },
        {
            q: "What is the difference between GSTR-2A and GSTR-2B, and why does Nexus use GSTR-2B?",
            a: "GSTR-2A is dynamic and changes continuously as suppliers upload invoices. GSTR-2B is a static, definitive statement generated on the 14th of every month. The GST law mandates that Input Tax Credit (ITC) must only be claimed based on GSTR-2B. Nexus performs two-way matching against GSTR-2B to protect you from Section 16(2)(aa) demand notices."
        },
        {
            q: "What happens if an E-Way Bill expires while the truck is in transit?",
            a: "Nexus enables 1-click E-Way Bill extension within 8 hours before or after expiry directly from your smartphone or desktop, updating transporter vehicle breakdown details to prevent vehicle seizure and 200% penalty under Section 129."
        },
        {
            q: "Can I generate E-Invoices and E-Way Bills directly from Nexus without logging into the NIC portal?",
            a: "Yes. Nexus is directly connected to government IRP portals via authorized GSP APIs. You never need to visit the NIC portal, copy-paste JSON files, or manually fill captive captcha codes. Everything generates in under 200ms right when clicking 'Save & Print Invoice'."
        },
        {
            q: "How does Nexus prevent claiming excess ITC beyond Rule 36(4)?",
            a: "Nexus continuously computes your eligible GSTR-2B credit pool and hard-locks monthly GSTR-3B Table 4(A)(5) claims to strictly 100% of auto-populated eligible 2B credits, eliminating arbitrary overclaims that trigger ASMT-10 scrutiny."
        },
        {
            q: "Does Nexus support dynamic UPI QR codes for B2C retail invoices?",
            a: "Yes. For eligible retail businesses and entities with turnover >₹500 Cr, Nexus automatically encodes a dynamic NPCI-compliant UPI QR code on consumer bills, embedding the merchant VPA, invoice number, and exact payable amount."
        },
        {
            q: "Can our Chartered Accountant access data remotely or export directly to Tally Prime?",
            a: "Absolutely. You can give your CA free auditor access with custom read-only or filing privileges. They can export one-click GSTR-1 and GSTR-3B JSON files for the GST portal or trigger native XML sync into Tally Prime / Tally.ERP 9."
        },
        {
            q: "How does Nexus handle multi-state GSTINs for businesses with warehouses across India?",
            a: "Nexus supports unlimited GSTINs under a single master account. You can switch between Maharashtra, Gujarat, Karnataka, or Delhi depots with one click, maintaining separate sequential invoice numbering and consolidated reporting."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.a.toLowerCase().includes(faqSearch.toLowerCase())
    );

    return (
        <section id="gst-closing" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ========================================================================= */}
                {/* S-27: 3 Verified GST Case Studies                                          */}
                {/* ========================================================================= */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
                        Proven Results
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        How India’s Leading Businesses Protect Their Balance Sheet
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Real-world case studies from MSMEs, wholesale distributors, and multi-depot manufacturers running 100% compliant operations on Nexus.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Case 1 */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                                    FMCG Distribution
                                </span>
                                <span className="text-xs font-semibold text-slate-400">Nagpur, MH</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Mahalaxmi FMCG Distributors</h3>
                            <p className="text-xs text-slate-500 mt-1">4,200 monthly inward supply invoices from 65 FMCG brands</p>

                            <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                                <div className="text-2xl font-black text-emerald-800">₹14.8 Lakhs</div>
                                <div className="text-xs font-bold text-emerald-900">Unclaimed GSTR-2B ITC Recovered</div>
                                <p className="text-[11px] text-emerald-700 leading-relaxed">
                                    Automated WhatsApp follow-ups compelled non-compliant suppliers to file pending GSTR-1s before the 30th November deadline.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic">
                            &quot;Nexus paid for its entire lifetime subscription in our very first monthly GSTR-2B reconciliation cycle.&quot;
                        </div>
                    </div>

                    {/* Case 2 */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                                    Heavy Engineering
                                </span>
                                <span className="text-xs font-semibold text-slate-400">Rajkot, GJ</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Kailash Engineering Works</h3>
                            <p className="text-xs text-slate-500 mt-1">Precision CNC machinery manufacturer shipping pan-India</p>

                            <div className="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                                <div className="text-2xl font-black text-purple-800">Zero Inquiries</div>
                                <div className="text-xs font-bold text-purple-900">100% Highway Transit Compliance</div>
                                <p className="text-[11px] text-purple-700 leading-relaxed">
                                    Automated simultaneous IRN + E-Way Bill generation eliminated highway checkpoint seizures and transporter delays.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic">
                            &quot;Our dispatch team prints authenticated IRN bills in 2 seconds. Transporters love doing business with us.&quot;
                        </div>
                    </div>

                    {/* Case 3 */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                    Chemicals &amp; Polymers
                                </span>
                                <span className="text-xs font-semibold text-slate-400">Vapi, GJ &amp; Daman</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Siddhi Polychem</h3>
                            <p className="text-xs text-slate-500 mt-1">Multi-state depots in Maharashtra, Gujarat, and Daman</p>

                            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                                <div className="text-2xl font-black text-amber-800">3 Depots, 1 Click</div>
                                <div className="text-xs font-bold text-amber-900">Consolidated GSTR-9 Filing Pack</div>
                                <p className="text-[11px] text-amber-700 leading-relaxed">
                                    Inter-depot stock transfers automatically tagged with correct IGST values and matched in Form GSTR-9 Table 4 &amp; 8.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic">
                            &quot;Managing multiple GSTINs used to take 5 full days every month. Now it takes our accounts team 30 minutes.&quot;
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-28: Interactive GST Penalty Savings Calculator                          */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Statutory Savings Estimator</span>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                                    Calculate Your Potential GST &amp; ITC Recovery
                                </h3>
                                <p className="text-slate-600 text-xs sm:text-sm mt-2">
                                    See how much money your business is currently losing due to non-compliant suppliers, missed GSTR-2B credits, and Section 50 interest penalties.
                                </p>
                            </div>

                            {/* Slider 1 */}
                            <div>
                                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                                    <span>Monthly Purchase Bill Volume</span>
                                    <span className="text-blue-600 font-mono text-sm">₹{monthlyPurchasesLakhs} Lakhs / mo</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="200"
                                    step="5"
                                    value={monthlyPurchasesLakhs}
                                    onChange={(e) => setMonthlyPurchasesLakhs(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>₹5 Lakhs</span>
                                    <span>₹1 Crore</span>
                                    <span>₹2 Crores</span>
                                </div>
                            </div>

                            {/* Slider 2 */}
                            <div>
                                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                                    <span>Estimated Supplier Default Rate (% Missing in 2B)</span>
                                    <span className="text-blue-600 font-mono text-sm">{supplierDefaultRate}% of Vendors</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="1"
                                    value={supplierDefaultRate}
                                    onChange={(e) => setSupplierDefaultRate(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>1% (Low)</span>
                                    <span>10% (Average)</span>
                                    <span>20% (Severe)</span>
                                </div>
                            </div>
                        </div>

                        {/* Result Card */}
                        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white border border-slate-800 shadow-xl">
                            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                                Total Estimated Annual Recovery
                            </div>
                            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                                ₹{totalStatutorySavings.toLocaleString('en-IN')}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Direct cash saved through protected input tax credit, zero demand notices, and automated vendor follow-up.
                            </p>

                            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Recovered Input Tax Credit (ITC @ 18%):</span>
                                    <span className="font-mono font-bold text-white">₹{annualItcSaved.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Section 50 Interest Avoided (@ 18% p.a.):</span>
                                    <span className="font-mono font-bold text-emerald-400">₹{annualInterestSavedAt18.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Section 122 Late &amp; Mismatch Penalties:</span>
                                    <span className="font-mono font-bold text-emerald-400">₹50,000</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href="/demo"
                                    className="block w-full py-3 text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Protect Your ITC — Book Free GST Audit
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-29: GST Knowledge Base & Comprehensive FAQs                             */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm mb-20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Frequently Asked Questions</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">
                                GST Statutory &amp; Technical Questions Answered
                            </h3>
                        </div>

                        {/* Search input */}
                        <div className="w-full sm:w-72">
                            <input
                                type="text"
                                value={faqSearch}
                                onChange={(e) => setFaqSearch(e.target.value)}
                                placeholder="Search GST questions (e.g. 2B, IRN, Tally)..."
                                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                            />
                        </div>
                    </div>

                    <div className="mt-6 divide-y divide-slate-100">
                        {filteredFaqs.map((faq, index) => (
                            <div key={index} className="py-4">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between text-left gap-4 group"
                                >
                                    <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                        {faq.q}
                                    </span>
                                    <span className="text-slate-400 font-bold text-lg leading-none">
                                        {expandedFaq === index ? '−' : '+'}
                                    </span>
                                </button>
                                {expandedFaq === index && (
                                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-8">
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-30: Government Compliance & Security Badges                             */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 mb-20">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Statutory Trust Architecture</span>
                        <h4 className="text-lg font-black text-slate-900 mt-1">
                            Enterprise-Grade Security &amp; Official Government Integrations
                        </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-white rounded-2xl border border-slate-200">
                            <div className="text-blue-600 font-black text-base mb-1">🏛️ NIC / IRP Direct</div>
                            <div className="text-xs font-bold text-slate-900">Authorized GSP Bridge</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">&lt;200ms Direct Portal Sync</p>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200">
                            <div className="text-emerald-600 font-black text-base mb-1">🔒 256-Bit AES</div>
                            <div className="text-xs font-bold text-slate-900">Bank-Grade Encryption</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">TLS 1.3 in Flight &amp; at Rest</p>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200">
                            <div className="text-purple-600 font-black text-base mb-1">🛡️ ISO 27001</div>
                            <div className="text-xs font-bold text-slate-900">Certified Infrastructure</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">SOC-2 Type II Verified</p>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200">
                            <div className="text-amber-600 font-black text-base mb-1">⚡ 100% Cloud Sync</div>
                            <div className="text-xs font-bold text-slate-900">Real-Time Redundancy</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">99.99% Availability SLA</p>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-32: CA & Tax Practitioner Partner Program (Above Closing CTA)            */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-20 border border-blue-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-3">
                            <span className="text-xs font-black uppercase tracking-wider text-blue-300 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-700">
                                For Chartered Accountants &amp; GST Practitioners
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white">
                                Manage 50+ Client GST Filings from One Master Dashboard
                            </h3>
                            <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
                                Join the Nexus CA Partner Network. Get complimentary practice software licenses, multi-client single sign-on switchers, bulk GSTR-1 JSON export, and priority compliance support for your firm.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2 text-xs text-blue-100 font-medium">
                                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Free CA Practice License</span>
                                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Multi-Client Switcher</span>
                                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Direct Tally Sync Bridge</span>
                            </div>
                        </div>
                        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                            <a
                                href="/partners"
                                className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-950 font-black rounded-xl text-center text-xs uppercase tracking-wider transition-all shadow-md"
                            >
                                Apply for CA Partner Portal
                            </a>
                            <a
                                href="/contact"
                                className="px-6 py-3 bg-blue-800/80 hover:bg-blue-800 text-white font-bold rounded-xl text-center text-xs uppercase tracking-wider transition-all border border-blue-700"
                            >
                                Schedule Practice Demo
                            </a>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-31: Closing Conversion CTA                                              */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-black/20 px-3.5 py-1 rounded-full border border-amber-300/30">
                            Zero Penalty Guarantee
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                            Never Pay a GST Penalty Again. Start Your 14-Day Free Trial.
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                            Join 12,000+ Indian businesses that generate instant E-Invoices, automate GSTR-2B reconciliation, and protect every rupee of Input Tax Credit.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <a
                                href="/demo"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-blue-900 font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all shadow-xl shadow-black/20 hover:scale-105"
                            >
                                Start 14-Day Free Trial
                            </a>
                            <a
                                href="/contact"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-950/40 text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-950/60 transition-all border border-white/20"
                            >
                                Book Free CA Consultation
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-xs text-blue-200">
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> Instant GSTIN Auto-Setup
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> Zero Credit Card Required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> Free GSTR-2B Health Audit
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
