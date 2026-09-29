import React, { useState } from 'react';

export default function SocialImpactFaqAndClosing() {
    // S-28 State: FAQ Accordion
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "Who owns Nexus Billing, and is it an Indian company?",
            a: "Nexus Billing Technologies Pvt Ltd is a 100% Indian-founded, Indian-headquartered company incorporated under the Companies Act. Our global research and engineering headquarters are located in Koramangala, Bengaluru, Karnataka."
        },
        {
            q: "Where are Nexus servers located, and is our financial data stored in India?",
            a: "100% of your data remains strictly within the sovereign territory of the Republic of India. Our primary active-standby cloud clusters run in AWS Mumbai (ap-south-1) and AWS Hyderabad (ap-south-2) in full compliance with Reserve Bank of India (RBI) and GST statutory data sovereignty regulations."
        },
        {
            q: "How does Nexus make money without selling merchant data?",
            a: "We operate on a transparent, straightforward software-as-a-service (SaaS) subscription model paid directly by merchants. We do not sell advertisements, we do not monetize customer phone directories, and we never broker merchant data to predatory lending apps."
        },
        {
            q: "Can we export our complete customer khata and invoice records if we ever leave?",
            a: "Yes. You have total data sovereignty. At any time, you can generate a complete export of your entire business history—customers, suppliers, products, batches, stock ledgers, and GST invoices—in standard CSV, Excel, and JSON formats with a single click."
        },
        {
            q: "How does Nexus guarantee 99.99% uptime during peak holiday sales like Diwali?",
            a: "Our infrastructure utilizes automated multi-region auto-scaling clusters, in-memory Redis caching, and independent microservice isolation. Even during peak Dhanteras and Diwali shopping weekends where traffic spikes 15x, our systems maintain sub-50ms billing speeds."
        },
        {
            q: "Does Nexus offer physical on-site installation and staff training?",
            a: "Yes. In addition to our 7-day multilingual phone and WhatsApp support desk, we have a network of 450+ certified local implementation partners across 180+ Indian cities who provide in-person hardware cabling, thermal printer setup, and counter staff training."
        }
    ];

    return (
        <section id="social-impact" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ========================================================================= */}
                {/* S-26: Social Impact & Green Paperless Billing                             */}
                {/* ========================================================================= */}
                <div className="bg-emerald-50 rounded-3xl p-6 sm:p-10 border border-emerald-200/90 mb-20 shadow-sm">
                    <div className="max-w-3xl mb-8">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-3 py-1 rounded-full border border-emerald-300">
                            Sustainability &amp; Green Billing
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                            Saving Trees, Water &amp; Health with Digital Receipts
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                            Traditional thermal paper rolls contain BPA chemicals and end up in landfills. By delivering digital WhatsApp and SMS tax invoices, Nexus merchants are making a tangible positive environmental impact every single day.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm">
                            <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">140M+</div>
                            <div className="text-xs font-bold text-slate-900 mt-1">Paperless Invoices Sent</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Via WhatsApp &amp; SMS Links</p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm">
                            <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">18,500+</div>
                            <div className="text-xs font-bold text-slate-900 mt-1">Trees Preserved</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">From Paper Pulp Processing</p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm">
                            <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">46M Liters</div>
                            <div className="text-xs font-bold text-slate-900 mt-1">Clean Water Conserved</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Zero BPA Chemical Waste</p>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-27: Corporate Governance & Strict Data Ethics                           */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 space-y-4">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Data Sovereignty</span>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                                Your Business Data is 100% Yours. Forever.
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                Many tech platforms offer &quot;free&quot; software to scrape merchant supplier lists, customer phone numbers, and daily turnovers to sell loans or fuel third-party ad networks. We believe this practice is deeply unethical.
                            </p>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold text-slate-800">
                                At Nexus, your database is cryptographically isolated in your own tenant container. We never look at your invoice contents, we never sell your customer contacts, and we never share your data.
                            </p>
                        </div>

                        <div className="lg:col-span-6 grid grid-cols-2 gap-4 text-xs">
                            <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                <div className="text-blue-600 font-bold mb-1">🔒 Zero Data Selling</div>
                                Strict legal guarantee: your customer phone numbers and purchase rates will never be sold or shared.
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                <div className="text-emerald-600 font-bold mb-1">🇮🇳 100% Indian Servers</div>
                                All data stored in AWS Mumbai &amp; Hyderabad, fully compliant with RBI and DPDP Act 2023.
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                <div className="text-purple-600 font-bold mb-1">📤 1-Click Open Export</div>
                                Download your entire sales, inventory, and ledger history in Excel/JSON anytime with no lock-in.
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                <div className="text-amber-600 font-bold mb-1">🛡️ AES-256 Encryption</div>
                                Bank-grade encryption both in transit and at rest, verified by third-party security auditors.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-28: Frequently Asked Questions About Nexus                              */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm mb-20">
                    <div className="max-w-2xl mb-8">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Company FAQs</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">
                            Everything You Need to Know About Nexus
                        </h3>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {faqs.map((faq, index) => (
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
                {/* S-29: Enterprise Trust & Compliance Badges                                */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 mb-20">
                    <div className="text-center max-w-2xl mx-auto mb-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Statutory Credentials</span>
                        <h4 className="text-base font-black text-slate-900 mt-1">
                            Accredited by Global &amp; Indian Regulatory Authorities
                        </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                            <div className="text-xs font-black text-slate-900">🏛️ GSP Certified</div>
                            <p className="text-[10px] text-slate-500 mt-0.5">NIC IRP Direct API Partner</p>
                        </div>
                        <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                            <div className="text-xs font-black text-slate-900">🔒 ISO 27001:2022</div>
                            <p className="text-[10px] text-slate-500 mt-0.5">Information Security Certified</p>
                        </div>
                        <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                            <div className="text-xs font-black text-slate-900">🇮🇳 DPIIT Recognized</div>
                            <p className="text-[10px] text-slate-500 mt-0.5">Govt of India #DIPP89104</p>
                        </div>
                        <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                            <div className="text-xs font-black text-slate-900">💼 NASSCOM Member</div>
                            <p className="text-[10px] text-slate-500 mt-0.5">100% Indian Technology</p>
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
                            Join 12,000+ Thriving Businesses
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                            Ready to Modernize Your Business with India’s Most Dependable Cloud ERP?
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                            Start your 14-day free trial in under 60 seconds. Full access to real-time cloud sync, automated GST e-invoicing, WhatsApp commerce, and live CA export.
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
                                Schedule Guided Walkthrough
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-xs text-blue-200">
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> No Credit Card Required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> Free Tally Master Data Migration
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> 7-Day Multilingual Support Desk
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
