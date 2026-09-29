import { useState } from 'react';
import { Link } from '@inertiajs/react';

interface FAQ {
    q: string;
    a: string;
    tag: string;
}

const PRICING_FAQS: FAQ[] = [
    {
        q: 'Can I upgrade or downgrade my plan at any time?',
        a: 'Yes, absolutely. If you upgrade from Starter to Professional, your unused balance is prorated to the exact minute. You only pay the difference for the remaining period.',
        tag: 'Plan Flexibility',
    },
    {
        q: 'What happens to my company data if my subscription lapses?',
        a: 'Your data is 100% safe. We never delete your data. If your subscription expires, your account simply transitions into read-only mode so you can still search, view, and export all historical invoices, ledgers, and tax packs in Excel/JSON.',
        tag: 'Data Safety',
    },
    {
        q: 'Is official Meta WhatsApp messaging included in the plan?',
        a: 'All plans include unlimited WhatsApp invoice PDF generation and direct sharing. For automated background WhatsApp message delivery, credits are billed at official Meta pass-through rates (~₹0.18/msg) with zero markup from Nexus.',
        tag: 'WhatsApp Billing',
    },
    {
        q: 'Are the displayed prices inclusive of 18% GST?',
        a: 'Prices displayed are exclusive of 18% GST. At checkout, provide your company GSTIN to receive a full B2B GST tax invoice with SAC Code 998313, allowing you to claim 100% Input Tax Credit (ITC).',
        tag: 'GST & Invoicing',
    },
    {
        q: 'Can my Chartered Accountant access my reports for free?',
        a: 'Yes! Every paid plan includes 1 complimentary "Chartered Accountant (CA) Read-Only" portal seat. Your CA can download GSTR-1, GSTR-3B, Balance Sheet, and Trial Balance without consuming your staff seats.',
        tag: 'Free CA Seat',
    },
    {
        q: 'Do you charge extra for mobile or tablet access?',
        a: 'No. Nexus is a Progressive Web App (PWA) that runs smoothly on all Android phones, iPhones, iPads, Windows laptops, and POS terminals without extra license charges.',
        tag: 'Multi-Device',
    },
    {
        q: 'What payment modes are accepted for subscription renewal?',
        a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), Netbanking across 50+ Indian banks, all major Credit/Debit cards, and Corporate NEFT/RTGS with automated proforma invoice generation.',
        tag: 'Payment Modes',
    },
    {
        q: 'Is there any lock-in contract or cancellation penalty?',
        a: 'Zero lock-in. Month-to-month plans can be paused or cancelled at any time from your account settings with a single click.',
        tag: 'No Lock-In',
    },
];

export default function FaqAndClosingPricing() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [faqSearch, setFaqSearch] = useState('');
    const [monthlyBills, setMonthlyBills] = useState<number>(800);

    const filteredFaqs = PRICING_FAQS.filter(
        (f) =>
            f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
            f.a.toLowerCase().includes(faqSearch.toLowerCase()) ||
            f.tag.toLowerCase().includes(faqSearch.toLowerCase())
    );

    // Live ROI estimation based on monthlyBills
    const hoursSavedPerMonth = Math.round((monthlyBills * 4.5) / 60); // 4.5 mins saved per bill
    const recoveredCashEst = Math.round(monthlyBills * 42); // Overdue recovered

    return (
        <div className="py-16 space-y-24">
            {/* ========================================================= */}
            {/* SECTION 22: BillingFaqSection                             */}
            {/* ========================================================= */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
                        <span>PRICING &amp; BILLING FAQS</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Frequently Asked Billing Questions
                    </h2>
                    <p className="mt-3 text-slate-600 text-sm">
                        Everything you need to know about plans, upgrades, GST invoices, and cancellations.
                    </p>

                    {/* FAQ search */}
                    <div className="mt-6 max-w-md mx-auto">
                        <input
                            type="text"
                            value={faqSearch}
                            onChange={(e) => setFaqSearch(e.target.value)}
                            placeholder="Search pricing questions (e.g. gst, cancel, whatsapp)..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredFaqs.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div
                                key={idx}
                                className={`rounded-2xl border transition-all ${
                                    isOpen ? 'bg-white border-indigo-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                                            {faq.tag}
                                        </span>
                                        <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                                    </div>
                                    <span className="text-indigo-600 font-bold text-sm shrink-0">
                                        {isOpen ? '−' : '+'}
                                    </span>
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTIONS 23 to 28: Referral, CA, Multi-Year & Grants      */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* S-23: Referral */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">🤝</span>
                            <h3 className="font-bold text-base text-slate-900">Refer &amp; Earn 2 Free Months</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Refer another store owner or distributor. When they subscribe to an annual plan, you get 2 months free credited to your account and they get 10% off.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-600">
                            Referral Program Active →
                        </div>
                    </div>

                    {/* S-24: CA Free Portal */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">💼</span>
                            <h3 className="font-bold text-base text-slate-900">Free CA / Tax Auditor Seat</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Give your Chartered Accountant their own login. They can generate and download GSTR-1, GSTR-3B, Trial Balances, and P&amp;L anytime without asking you for OTPs.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600">
                            Included in All Plans →
                        </div>
                    </div>

                    {/* S-25: Multi-Year Lock */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">🔒</span>
                            <h3 className="font-bold text-base text-slate-900">2-Year &amp; 3-Year Price Lock</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Protect your business against inflation and software price hikes. Lock in your plan rate for 36 months and receive an extra 10% multi-year discount.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-purple-600">
                            Inflation-Proof Contract →
                        </div>
                    </div>

                    {/* S-26: NGO Grants */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">🎓</span>
                            <h3 className="font-bold text-base text-slate-900">50% Lifetime NGO Grant</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Non-profit foundations, educational schools, and charitable trusts receive an unconditional 50% lifetime grant across all software tiers.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-amber-600">
                            Apply via Support →
                        </div>
                    </div>

                    {/* S-27: White-label */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">🏷️</span>
                            <h3 className="font-bold text-base text-slate-900">100% White-Label Branding</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Remove all vendor footprints. Invoices, WhatsApp notifications, and customer portals display your business logo, custom colors, and company domain.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-600">
                            Professional &amp; Enterprise →
                        </div>
                    </div>

                    {/* S-28: Support Tiering */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">📞</span>
                            <h3 className="font-bold text-base text-slate-900">Priority WhatsApp Support Group</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Enterprise and Annual users get a dedicated WhatsApp group with our senior technical support engineers for lightning-fast sub-15 minute resolutions.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600">
                            Sub-15 Min Response SLA →
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 29: LiveRoiSimulator                              */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                                <span>LIVE ROI SIMULATOR</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Calculate Your Exact Monthly Time &amp; Cash Payback
                            </h3>
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                Adjust your estimated monthly invoices to see how automated barcode POS, WhatsApp dispatch, and payment reminders save operational hours.
                            </p>

                            <div className="pt-2">
                                <div className="flex justify-between text-xs font-mono mb-2">
                                    <span className="text-slate-300">Monthly Invoices Issued:</span>
                                    <span className="text-emerald-400 font-bold text-base">{monthlyBills} Invoices / Mo</span>
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="5000"
                                    step="50"
                                    value={monthlyBills}
                                    onChange={(e) => setMonthlyBills(Number(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
                            <div className="grid grid-cols-2 gap-3 font-mono">
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 uppercase">Billing Time Saved</span>
                                    <div className="text-2xl font-extrabold text-white mt-0.5">{hoursSavedPerMonth} Hours</div>
                                    <span className="text-[9px] text-emerald-400">per month</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 uppercase">Cash Recovery Gain</span>
                                    <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">₹{recoveredCashEst.toLocaleString('en-IN')}</div>
                                    <span className="text-[9px] text-slate-400">overdue cleared</span>
                                </div>
                            </div>
                            <div className="text-[11px] text-slate-400">
                                Based on standard Indian retail benchmarking &amp; payment cycle acceleration.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 30 & 31: Free Tools & Sales Assistance            */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* S-30: Free Tools */}
                    <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                            <span>100% FREE BUSINESS TOOLS</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Free Utilities Even Without Signing Up</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Use our free web utilities anytime: Online GST Number Validator, HSN Code Lookup Directory, Retail Profit Margin Calculator, and Free Quotation Maker.
                        </p>
                        <div className="pt-2 flex flex-wrap gap-2 text-xs">
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-800 font-medium rounded-xl">🔍 GSTIN Search</span>
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-800 font-medium rounded-xl">📚 HSN Directory</span>
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-800 font-medium rounded-xl">🧮 Margin Calculator</span>
                        </div>
                    </div>

                    {/* S-31: Sales Proposal Assistance */}
                    <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                            <span>BOARD APPROVAL PROPOSAL</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Need a Formal Executive Pitch Deck?</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Presenting to your board of directors, partners, or managing director? Download our 1-page executive summary PDF with complete feature checklist and financial ROI.
                        </p>
                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                            >
                                📄 Download Proposal PDF
                            </button>
                            <Link
                                href="/demo"
                                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                            >
                                Talk to Product Specialist
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 32: PricingClosingCTA                             */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-[2.5rem] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-indigo-800/40">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                            <span>UNCONDITIONAL 14-DAY TRIAL</span>
                        </div>

                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                            Stop Paying The Legacy Desktop Tax. Switch To Nexus Today.
                        </h2>

                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                            Join 10,000+ modern Indian merchants, distributors, and hotel operators who simplified their business and saved ₹45,000+ every year.
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/demo"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-900 font-extrabold text-base hover:bg-slate-100 transition-all shadow-xl"
                            >
                                Start 14-Day Free Trial →
                            </Link>
                            <Link
                                href="/demo"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600/30 text-white border border-white/20 font-bold text-base hover:bg-indigo-600/50 transition-all"
                            >
                                Schedule 15-Min Live Demo
                            </Link>
                        </div>

                        <p className="text-xs text-slate-400 pt-2">
                            ✓ Zero Credit Card Required • Instant Cloud Setup in 3 Minutes • 100% Free Data Migration
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
