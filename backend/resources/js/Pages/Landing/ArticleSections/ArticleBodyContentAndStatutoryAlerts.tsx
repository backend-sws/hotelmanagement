import React, { useState } from 'react';

interface Props {
    fontSize: 'sm' | 'base' | 'lg';
}

export default function ArticleBodyContentAndStatutoryAlerts({ fontSize }: Props) {
    // S-10 State: Interactive ITC Mismatch Risk Calculator
    const [monthlyPurchasesLakhs, setMonthlyPurchasesLakhs] = useState<number>(50);
    const [vendorDefaultPct, setVendorDefaultPct] = useState<number>(8);

    const defaultAmount = (monthlyPurchasesLakhs * 100000 * (vendorDefaultPct / 100));
    const itcAtRiskAnnual = Math.round((defaultAmount * 0.18) * 12);
    const section50InterestAnnual = Math.round(itcAtRiskAnnual * 0.18);
    const totalExposure = itcAtRiskAnnual + section50InterestAnnual;

    const textSizeClass = fontSize === 'sm' ? 'text-xs leading-relaxed' : fontSize === 'lg' ? 'text-base leading-relaxed' : 'text-sm leading-relaxed';

    return (
        <section className="py-12 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* ========================================================================= */}
                    {/* S-06: Sticky Table of Contents Sidebar                                    */}
                    {/* ========================================================================= */}
                    <div className="hidden lg:block lg:col-span-4">
                        <div className="sticky top-28 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                                Table of Contents
                            </h3>
                            <nav className="space-y-2 text-xs">
                                <a href="#statutory-background" className="block text-slate-600 hover:text-blue-600 transition-colors font-medium">
                                    1. Statutory Background: Section 16(2)(aa)
                                </a>
                                <a href="#rule-36-4" className="block text-slate-600 hover:text-blue-600 transition-colors font-medium">
                                    2. Rule 36(4) 105% ITC Capping Math
                                </a>
                                <a href="#matching-workflow" className="block text-slate-600 hover:text-blue-600 transition-colors font-medium">
                                    3. Step-by-Step 2B Matching Workflow
                                </a>
                                <a href="#mismatch-calculator" className="block text-slate-600 hover:text-blue-600 transition-colors font-medium">
                                    4. Interactive ITC Risk Calculator
                                </a>
                                <a href="#asmt-11-template" className="block text-slate-600 hover:text-blue-600 transition-colors font-medium">
                                    5. Form GST ASMT-11 Reply Template
                                </a>
                                <a href="#common-pitfalls" className="block text-slate-600 hover:text-blue-600 transition-colors font-medium">
                                    6. Common CA Audit Pitfalls
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Main Article Content Column */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* ========================================================================= */}
                        {/* S-07: Statutory Background & Section 16(2)(aa) Deep Dive                 */}
                        {/* ========================================================================= */}
                        <div id="statutory-background" className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                1. Statutory Background: The Death of GSTR-2A and Rise of Section 16(2)(aa)
                            </h2>
                            <p className={`text-slate-700 ${textSizeClass}`}>
                                Prior to the introduction of sub-clause (aa) to Section 16(2) of the Central Goods and Services Tax (CGST) Act, 2017, taxpayers frequently relied on Form GSTR-2A for availing Input Tax Credit (ITC). Because GSTR-2A was dynamic and perpetually fluctuating as suppliers filed late returns, business accountants claimed estimates in GSTR-3B under the premise that vendors would eventually file.
                            </p>
                            <p className={`text-slate-700 ${textSizeClass}`}>
                                With the statutory notification of <strong>Section 16(2)(aa)</strong>, the legislative stance shifted decisively. The law now mandates that <em>no registered person shall be entitled to the credit of any input tax unless the details of the invoice or debit note have been furnished by the supplier in the statement of outward supplies (GSTR-1) and communicated to the recipient in Form GSTR-2B</em>.
                            </p>
                            <p className={`text-slate-700 ${textSizeClass}`}>
                                Form GSTR-2B is a static statement generated on the <strong>14th of every month</strong>. If your supplier fails to upload their GSTR-1 by the 11th (or 13th for QRMP), that credit cannot be claimed in your current month’s GSTR-3B—period.
                            </p>
                        </div>

                        {/* ========================================================================= */}
                        {/* S-08: Statutory Alert Callout Box (Rule 36(4) Capping Math)               */}
                        {/* ========================================================================= */}
                        <div id="rule-36-4" className="p-6 bg-rose-50 rounded-3xl border border-rose-200/90 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
                                <span>⚠️</span>
                                <span>STATUTORY ALERT: Automated Scrutiny Trigger under Rule 88B &amp; ASMT-10</span>
                            </div>
                            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
                                The GST system now uses automated bot scrutiny. If the total Input Tax Credit claimed in <strong>Table 4(A)(5) of Form GSTR-3B</strong> exceeds the auto-populated eligible ITC in <strong>Form GSTR-2B</strong>, an automated red flag is generated under Form GST DRC-01C or ASMT-10.
                            </p>
                            <div className="bg-white p-4 rounded-xl border border-rose-200 text-xs text-slate-800 space-y-1 font-mono">
                                <div><strong>Example Mismatch Calculation:</strong></div>
                                <div>• Eligible ITC in GSTR-2B (Table 3): <span className="text-emerald-700 font-bold">₹10,00,000</span></div>
                                <div>• Claimed by Accountant in GSTR-3B: <span className="text-rose-700 font-bold">₹11,50,000</span> (₹1.5L un-reflected)</div>
                                <div>• Section 50 Interest @ 18% p.a. (3 months): <span className="text-rose-700 font-bold">₹6,750</span></div>
                                <div>• Section 122 Penalty for Ineligible Credit: <span className="text-rose-700 font-bold">₹10,000 to ₹1,50,000</span></div>
                            </div>
                        </div>

                        {/* ========================================================================= */}
                        {/* S-09: Step-by-Step Implementation Workflow                                */}
                        {/* ========================================================================= */}
                        <div id="matching-workflow" className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                2. Step-by-Step GSTR-2B Two-Way Matching Workflow
                            </h2>
                            <p className={`text-slate-700 ${textSizeClass}`}>
                                Manual Excel VLOOKUP matching takes 15 to 20 hours per month for a distributor with 500 invoices and inevitably leads to missed invoices due to slash, zero, or hyphen format variations (e.g. <code>INV/2026/01</code> vs <code>INV-2026-1</code>). Here is how an automated cloud pipeline structures reconciliation:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div className="text-blue-600 font-black text-sm mb-1">Step 1: Auto GSP Fetch</div>
                                    <p className="text-xs text-slate-600">
                                        On the 14th morning, Nexus triggers direct API pulls from the GST portal, downloading JSON line-item details of all supplier filings.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div className="text-blue-600 font-black text-sm mb-1">Step 2: Fuzzy Logic Matching</div>
                                    <p className="text-xs text-slate-600">
                                        Matches against your Purchase Register with ±₹1 rounding tolerance and invoice number character normalization.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div className="text-blue-600 font-black text-sm mb-1">Step 3: Discrepancy Triaging</div>
                                    <p className="text-xs text-slate-600">
                                        Separates into 3 buckets: 100% Matched, Rate/Tax Mismatch, and Invoices Present in Books but Missing in 2B.
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div className="text-blue-600 font-black text-sm mb-1">Step 4: WhatsApp Dunning</div>
                                    <p className="text-xs text-slate-600">
                                        Generates 1-click WhatsApp alerts to defaulting suppliers listing exact missing invoice numbers blocking your credit.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ========================================================================= */}
                        {/* S-10: Interactive ITC Mismatch Risk Calculator                            */}
                        {/* ========================================================================= */}
                        <div id="mismatch-calculator" className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Financial Risk Simulator</span>
                                <h3 className="text-xl font-black text-slate-900 mt-1">
                                    Calculate Your Financial Exposure to Defaulting Suppliers
                                </h3>
                                <p className="text-xs text-slate-600 mt-1">
                                    Move the sliders to evaluate how much Input Tax Credit and statutory interest your business risks losing if suppliers fail to file GSTR-1.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                                        <span>Monthly Inward Purchase Volume</span>
                                        <span className="text-blue-600 font-mono">₹{monthlyPurchasesLakhs} Lakhs / mo</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="200"
                                        step="5"
                                        value={monthlyPurchasesLakhs}
                                        onChange={(e) => setMonthlyPurchasesLakhs(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                                        <span>Estimated Non-Filing / Mismatched Vendors (%)</span>
                                        <span className="text-blue-600 font-mono">{vendorDefaultPct}% of Suppliers</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="2"
                                        max="20"
                                        step="1"
                                        value={vendorDefaultPct}
                                        onChange={(e) => setVendorDefaultPct(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            </div>

                            {/* Result Box */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl text-white border border-slate-800 space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Annual Blocked ITC (18% GST):</span>
                                    <span className="font-mono font-bold text-emerald-400">₹{itcAtRiskAnnual.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Potential Section 50 Interest Penalty (@ 18% p.a.):</span>
                                    <span className="font-mono font-bold text-amber-400">₹{section50InterestAnnual.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                                    <span className="text-xs font-bold text-white">Total Annual Balance Sheet Exposure:</span>
                                    <span className="text-lg font-black font-mono text-white">₹{totalExposure.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
