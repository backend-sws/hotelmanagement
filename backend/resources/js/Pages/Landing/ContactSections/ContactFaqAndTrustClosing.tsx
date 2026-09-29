import React, { useState } from 'react';

export default function ContactFaqAndTrustClosing() {
    // S-26 State: FAQ Accordion
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "Can someone from Nexus visit our shop or warehouse in person?",
            a: "Yes. In addition to our 7-day multilingual phone and remote support desk, we maintain a network of 450+ certified on-ground implementation partners across 180+ Indian cities who can visit your location for hardware cabling, thermal printer configuration, and staff training."
        },
        {
            q: "What are your support hours on Sundays, National Holidays, and peak festival weekends?",
            a: "Our core support desk operates Monday through Saturday from 8:00 AM to 10:00 PM IST. On Sundays and major Indian festival shopping days (such as Dhanteras, Diwali, Eid, and New Year's Eve), our Emergency Counter SOS hotline runs with priority on-call engineers to ensure zero retail checkout downtime."
        },
        {
            q: "Is remote desktop assistance via AnyDesk or TeamViewer secure?",
            a: "Absolutely. All remote sessions require your explicit verbal authorization and a temporary one-time session PIN that you control. Our engineers never install background daemon agents, and the session terminates completely the moment you close the window."
        },
        {
            q: "Can we migrate our 5 years of Tally master stock items and debtors for free?",
            a: "Yes. Our onboarding specialists provide complimentary master data migration from Tally Prime, Tally.ERP 9, Marg, Vyapar, or Excel. We transfer your complete item catalog, HSN codes, opening stock, and customer khata balances within 24 hours at zero cost."
        },
        {
            q: "How do I request custom thermal bill print formats or add our store logo?",
            a: "You can customize bill designs directly from the Nexus web dashboard (2-inch, 3-inch, 4-inch, or A4/A5 full invoices), or message our support desk on WhatsApp with your logo and preferred layout. Our template team configures it for you within 2 hours."
        },
        {
            q: "What happens if our shop broadband cuts out during customer checkout?",
            a: "Because Nexus operates a 100% Real-Time Cloud Sync engine, you can simply switch your billing laptop or mobile phone to your mobile phone hotspot in 5 seconds. All pending line items and cash drawer balances sync smoothly to the central cloud cluster without losing any bill data."
        }
    ];

    return (
        <section id="contact-faqs" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ========================================================================= */}
                {/* S-26: Contact & Support FAQs                                              */}
                {/* ========================================================================= */}
                <div className="max-w-3xl mx-auto mb-20">
                    <div className="text-center mb-10">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Help &amp; Answers</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            Frequently Asked Questions About Support &amp; Onboarding
                        </h3>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm divide-y divide-slate-200">
                        {faqs.map((faq, index) => (
                            <div key={index} className="py-4 first:pt-0 last:pb-0">
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
                                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-27 & S-28: Statutory Corporate Information & Trust Badges               */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-2 text-xs">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Corporate Identity</span>
                            <h4 className="text-base font-black text-slate-900">Nexus Billing Technologies Private Limited</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1 font-mono text-[11px]">
                                <div><strong>CIN:</strong> U72900KA2021PTC148921</div>
                                <div><strong>GSTIN:</strong> 29AAACN8921A1Z9</div>
                                <div><strong>PAN:</strong> AAACN8921A</div>
                                <div><strong>TAN:</strong> BLRN09821E</div>
                            </div>
                            <p className="text-slate-500 pt-1 text-[11px]">
                                <strong>Registered Office:</strong> Nexus Tower, 4th Block, 80 Feet Road, Koramangala, Bengaluru, Karnataka 560034 India
                            </p>
                        </div>

                        <div className="lg:col-span-4 grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-700">
                            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                                <div>🏛️ GSP Partner</div>
                                <div className="text-slate-400 font-normal">NIC Authorized</div>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                                <div>🔒 ISO 27001</div>
                                <div className="text-slate-400 font-normal">Certified Security</div>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                                <div>🇮🇳 DPIIT Startup</div>
                                <div className="text-slate-400 font-normal">#DIPP89104</div>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                                <div>⚡ 100% Cloud</div>
                                <div className="text-slate-400 font-normal">AWS India Hosted</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-30: Closing Conversion CTA                                              */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-black/20 px-3.5 py-1 rounded-full border border-amber-300/30">
                            Self-Serve Instant Setup
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                            Don’t Want to Wait for a Callback? Start Free Right Now.
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                            Onboard your store or wholesale warehouse in under 60 seconds. Full access to real-time multi-counter billing, automated GST e-invoicing, and WhatsApp catalogs.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <a
                                href="/demo"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-blue-900 font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all shadow-xl shadow-black/20 hover:scale-105"
                            >
                                Start 14-Day Free Trial
                            </a>
                            <a
                                href="https://wa.me/917479499718"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg"
                            >
                                💬 Chat on WhatsApp Directly
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-xs text-blue-200">
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> No Credit Card Required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> Free Tally Master Data Import
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> 7-Day Phone &amp; WhatsApp Support
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
