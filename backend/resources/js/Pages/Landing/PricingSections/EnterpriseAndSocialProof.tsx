import { Link } from '@inertiajs/react';

const TESTIMONIALS_ROI = [
    {
        quote: "We canceled our Tally AMC (₹9,000/yr), our third-party WhatsApp bot tool (₹12,000/yr), and our biometric attendance software (₹7,500/yr). Nexus replaced all three and saves us ₹28,000 every single year.",
        author: 'Sunil Aggarwal',
        business: 'Aggarwal Supermarket Chain (4 Branches)',
        location: 'Chandigarh',
        savings: 'Saved ₹28,000/yr',
    },
    {
        quote: "The automated 4-stage WhatsApp payment recovery recovered ₹4.2 Lakhs in overdue customer payments in our very first month. The software paid for its entire annual subscription in just 3 days.",
        author: 'Meenakshi Sundaram',
        business: 'Sundaram Electricals & Hardware Distributors',
        location: 'Coimbatore',
        savings: '₹4.2L Recovered in 30 Days',
    },
    {
        quote: "Other hotel PMS software charged us per-room or per-booking commission. With Nexus Enterprise, our 42-room boutique resort and rooftop restaurant operate on a fixed ₹3,999/month without any cut on our revenue.",
        author: 'Capt. Rajesh Ranawat',
        business: 'Heritage Haveli & Palace Resort',
        location: 'Udaipur',
        savings: 'Zero Booking Commission',
    },
];

export default function EnterpriseAndSocialProof() {
    return (
        <div className="py-16 space-y-24">
            {/* ========================================================= */}
            {/* SECTION 17: RefundPolicySection                           */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50/50 border border-emerald-200">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                                <span>30-DAY NO-QUESTIONS-ASKED GUARANTEE</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                100% Risk-Free Money Back Guarantee
                            </h3>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                We stand behind the value Nexus delivers. If Nexus does not save your business at least 10 hours of manual billing
                                or recover overdue payments within 30 days of subscribing, simply shoot an email to refunds@nexusbilling.in for a full 100% refund.
                            </p>
                        </div>
                        <div className="lg:col-span-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                                30D
                            </div>
                            <div className="font-bold text-xs text-slate-900 mt-2">Full Money Back</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 18: EnterpriseCustomTier                          */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                                <span>LARGE RETAIL NETWORKS &amp; FRANCHISES</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Running 25+ Stores Or 500+ Field Engineers?
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Our Enterprise Custom Tier provides dedicated VPC infrastructure, custom ERP connectors (SAP, Microsoft Dynamics, Oracle Netsuite),
                                custom SSO/SAML logins, and 99.99% financially backed uptime SLA.
                            </p>

                            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                                    <div className="font-bold text-white">Dedicated Private VPC</div>
                                    <div className="text-slate-400 text-[11px] mt-0.5">Isolated AWS Mumbai database instance</div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                                    <div className="font-bold text-white">99.99% Uptime SLA</div>
                                    <div className="text-slate-400 text-[11px] mt-0.5">24/7 dedicated telephone hotline</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-center space-y-4">
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                                Enterprise Custom Proposal
                            </span>
                            <div className="text-2xl font-extrabold text-white">Custom Volume Quote</div>
                            <p className="text-xs text-slate-400">
                                Speak with our enterprise solutions architecture team for custom licensing and volume discounts.
                            </p>
                            <Link
                                href="/demo"
                                className="w-full block py-3.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs transition-colors"
                            >
                                Schedule Enterprise Architecture Call →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 19: ClientPricingTestimonials                     */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
                        <span>PROVEN RETURN ON INVESTMENT</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Real Business Owners. Real Documented ROI.
                    </h2>
                    <p className="mt-3 text-slate-600 text-base">
                        See how Indian merchants and business founders recover their software subscription within the first month.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS_ROI.map((item, idx) => (
                        <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold font-mono">
                                    {item.savings}
                                </span>
                                <p className="mt-4 text-xs text-slate-700 italic leading-relaxed">
                                    "{item.quote}"
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <div className="font-bold text-sm text-slate-900">{item.author}</div>
                                <div className="text-[11px] text-slate-500">{item.business}</div>
                                <div className="text-[10px] text-indigo-600 font-medium mt-0.5">📍 {item.location}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 20: CompetitorCostComparison                      */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4">
                            <span>FINANCIAL COST COMPARISON</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            The "Hidden Cost" of Legacy Desktop ERP Software
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Desktop software seems cheap initially, but mandatory AMC fees, remote access plugins, and per-user licenses make it 2.5x more expensive.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Legacy */}
                        <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3 text-xs font-mono">
                            <h4 className="font-bold text-sm text-rose-900 font-sans uppercase">Traditional Desktop ERP Stack</h4>
                            <div className="flex justify-between text-slate-700">
                                <span>Upfront Multi-User Software License:</span>
                                <span className="font-bold">₹22,500</span>
                            </div>
                            <div className="flex justify-between text-slate-700">
                                <span>Annual Mandatory AMC (Year 2 onwards):</span>
                                <span className="font-bold">₹8,000 / yr</span>
                            </div>
                            <div className="flex justify-between text-slate-700">
                                <span>Mobile Access Cloud Sync Connector:</span>
                                <span className="font-bold">₹12,000 / yr</span>
                            </div>
                            <div className="flex justify-between text-slate-700">
                                <span>WhatsApp Invoicing Bulk Add-on:</span>
                                <span className="font-bold">₹8,400 / yr</span>
                            </div>
                            <div className="pt-3 border-t border-rose-200 flex justify-between font-bold text-sm text-rose-800">
                                <span>Total 3-Year Expense:</span>
                                <span>₹1,07,700</span>
                            </div>
                        </div>

                        {/* Nexus */}
                        <div className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3 text-xs font-mono">
                            <h4 className="font-bold text-sm text-emerald-900 font-sans uppercase">Nexus Professional Cloud Platform</h4>
                            <div className="flex justify-between text-slate-700">
                                <span>Upfront Hardware or Installation Fee:</span>
                                <span className="font-bold text-emerald-600">₹0 (Zero)</span>
                            </div>
                            <div className="flex justify-between text-slate-700">
                                <span>Annual AMC or Version Upgrade Fee:</span>
                                <span className="font-bold text-emerald-600">₹0 (Included)</span>
                            </div>
                            <div className="flex justify-between text-slate-700">
                                <span>Mobile PWA &amp; Web Access:</span>
                                <span className="font-bold text-emerald-600">₹0 (Included)</span>
                            </div>
                            <div className="flex justify-between text-slate-700">
                                <span>Annual Plan (Professional Tier):</span>
                                <span className="font-bold">₹19,990 / yr</span>
                            </div>
                            <div className="pt-3 border-t border-emerald-200 flex justify-between font-bold text-sm text-emerald-800">
                                <span>Total 3-Year Expense:</span>
                                <span>₹59,970 (Save ₹47,730!)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 21: SecurityComplianceBadges                      */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs font-semibold text-slate-700">
                    <div className="p-2">
                        <span className="text-xl block mb-1">🛡️</span>
                        <span>ISO 27001 Certified</span>
                    </div>
                    <div className="p-2">
                        <span className="text-xl block mb-1">🇮🇳</span>
                        <span>AWS Mumbai Data Center</span>
                    </div>
                    <div className="p-2">
                        <span className="text-xl block mb-1">🔐</span>
                        <span>AES-256 Cloud Encryption</span>
                    </div>
                    <div className="p-2">
                        <span className="text-xl block mb-1">📋</span>
                        <span>GSTN / NIC Authorized</span>
                    </div>
                    <div className="p-2">
                        <span className="text-xl block mb-1">⚡</span>
                        <span>Hourly Encrypted Backups</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
