import { useState, useMemo } from 'react';
import AnimatedSection from '@/Components/Site/AnimatedSection';
import FAQItem from '@/Components/Site/FAQItem';

export default function FaqAndClosingSection() {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const timelineSteps = [
        { step: '01', title: 'Sign Up in 2 Min', desc: 'No credit card required. Enter your basic phone number and business name.' },
        { step: '02', title: 'Add GSTIN & Branch', desc: 'Auto-fetches company address and tax details from the national GST registry.' },
        { step: '03', title: 'Import Existing Data', desc: 'Upload your items, contacts, and opening balances via our free Excel/Tally importer.' },
        { step: '04', title: 'Invite Your Team', desc: 'Staff receive an auto-invitation on WhatsApp. Attendance & tasks start immediately.' },
        { step: '05', title: 'Start Billing & Growing', desc: 'Issue your first IRN e-invoice and dispatch WhatsApp bills in under 60 seconds.' },
    ];

    const categories = [
        { id: 'all', label: 'All Questions' },
        { id: 'gst', label: '🏛️ GST & e-Invoicing' },
        { id: 'whatsapp', label: '📲 WhatsApp & FieldOps' },
        { id: 'pos', label: '🛒 POS & Inventory' },
        { id: 'security', label: '🔒 Security & Hosting' },
        { id: 'migration', label: '⚡ Migration & Pricing' },
    ];

    const allFaqs = [
        {
            category: 'security',
            badge: 'Bank-Grade',
            question: 'Is my business and financial data secure?',
            answer: 'Yes, absolutely. We use AES-256 bank-level encryption at rest and TLS 1.3 in transit. Your data is stored securely in tier-4 data centers located physically in Mumbai & Hyderabad, India in full compliance with Indian data sovereignty laws. Automated geo-redundant backups are run daily with 30-day point-in-time recovery.',
        },
        {
            category: 'migration',
            badge: 'Free Migration',
            question: 'Can I migrate data from Tally, Busy, or Excel?',
            answer: 'Yes. We offer 1-click import templates for items, customers, suppliers, opening stock, and previous invoices from Tally Prime, Busy Accounting, Vyapar, Marg, and Excel. Our dedicated support team also assists with manual reconciliation free of charge during your 14-day trial.',
        },
        {
            category: 'whatsapp',
            badge: 'Official Cloud API',
            question: 'How does WhatsApp invoicing and attendance work?',
            answer: 'We use official Meta / WhatsApp Cloud APIs. When you save an invoice, a formatted PDF with dynamic UPI payment link is dispatched directly to the customer’s WhatsApp. For staff, the WhatsApp bot allows geofenced selfie punch-in, GPS route tracking, and task status updates without installing any mobile app from app stores.',
        },
        {
            category: 'pos',
            badge: 'Cloud Speed',
            question: 'Does Nexus Retail POS require an internet connection?',
            answer: 'Yes, Nexus is a 100% modern cloud-based ERP and POS system. Every invoice generated and barcode scanned updates your central inventory and accounting in real time across all branches and mobile devices, requiring an active broadband or mobile internet connection.',
        },
        {
            category: 'gst',
            badge: 'NIC GSP API',
            question: 'Is government e-Invoicing (IRN) and e-Way bill included?',
            answer: 'Yes. Our platform connects directly with the National Informatics Centre (NIC) and GSTN e-Invoice portal. Generate 64-character IRN numbers, signed QR codes, and distance-based e-Way bills automatically in real-time without logging into multiple websites.',
        },
        {
            category: 'pos',
            badge: 'Multi-User',
            question: 'Can multiple employees use the software at the same time?',
            answer: 'Yes. NexusBilling supports role-based multi-user access. Cashiers can only access counter POS; billing clerks manage invoicing; warehouse managers control godown stock; CAs view tax reports; and owners have complete executive visibility. There are zero extra per-device license charges.',
        },
        {
            category: 'pos',
            badge: 'Hardware Support',
            question: 'What hardware (printers and scanners) is supported?',
            answer: 'NexusBilling works with all standard USB, Bluetooth, and Wi-Fi thermal printers (58mm and 80mm ESC/POS), A4/A5 laser and inkjet printers, standard 1D/2D USB and wireless barcode scanners, and touch-screen POS terminals.',
        },
        {
            category: 'migration',
            badge: 'Transparent Fees',
            question: 'Are there any hidden costs or setup charges?',
            answer: 'None whatsoever. All plan pricing is completely transparent. There are no server setup fees, no software upgrade fees, and no per-terminal fees. Annual plans also include 2 months completely free.',
        },
        {
            category: 'whatsapp',
            badge: '24/7 Priority',
            question: 'What kind of customer support do you provide?',
            answer: 'All plans include priority WhatsApp and chat support with average response times under 5 minutes. Growth and Enterprise plans also receive dedicated phone support, video screen-sharing onboarding, and a named account manager.',
        },
        {
            category: 'migration',
            badge: '14-Day Full Access',
            question: 'How does the free trial work?',
            answer: 'You get 14 days of full, unrestricted access to all features across invoicing, POS, inventory, WhatsApp bot, and AI FieldOps. No credit card is required to sign up. If you decide not to subscribe after 14 days, you can export all your data in Excel format at any time.',
        },
        {
            category: 'gst',
            badge: 'Tax Compliance',
            question: 'What happens when the GST Council amends tax slabs or HSN codes?',
            answer: 'Our cloud platform automatically updates all statutory tax rules, HSN rate tables, and e-invoicing schema changes within 24 hours of official government notification. You never have to wait for manual software CD updates or pay maintenance fees.',
        },
        {
            category: 'whatsapp',
            badge: 'AI Anti-Fraud',
            question: 'How does Gemini AI verify field engineer work proofs?',
            answer: 'When a field technician uploads work photos via WhatsApp, Gemini AI Vision scans the image for visual authenticity, detects whether the photo is being re-photographed from a computer monitor, checks watermarked timestamp metadata, and compares GPS coordinates to ensure the technician is at the registered customer location.',
        },
    ];

    // Filter FAQs based on active category & search query
    const filteredFaqs = useMemo(() => {
        return allFaqs.filter((faq) => {
            const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
            const matchesSearch =
                searchQuery.trim() === '' ||
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.badge.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    return (
        <section className="py-24 relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
                {/* S-35: HowItWorksTimeline */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            Effortless Setup
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            From signup to your first GST invoice in 5 minutes
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                        {timelineSteps.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-3xl font-black text-indigo-200 font-mono block mb-3">
                                        {item.step}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* S-36: TrustAndCompliance */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                            Certifications &amp; Standards
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">
                            Enterprise Security &amp; Compliance Standards
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { badge: 'GSTN Ready', desc: 'Direct NIC GSP e-Invoicing API' },
                            { badge: 'India Data Residency', desc: '100% Mumbai / Hyderabad Cloud' },
                            { badge: 'ISO 27001 Certified', desc: 'Information Security Management' },
                            { badge: '99.9% Cloud SLA', desc: 'High Availability Cloud Cluster' },
                            { badge: 'HTTPS / TLS 1.3', desc: 'End-to-End Network Encryption' },
                            { badge: 'MFA & Biometrics', desc: 'Zero unauthorized account access' },
                            { badge: 'Automated Backups', desc: '30-day point in time snapshots' },
                            { badge: '24x7 Tech Desk', desc: 'Instant support on WhatsApp' },
                        ].map((c, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center shadow-2xs">
                                <span className="text-emerald-700 text-sm font-bold block mb-1">✔ {c.badge}</span>
                                <p className="text-[11px] text-slate-500 font-medium">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* S-37: FrequentlyAskedSection — Ultra-Professional Knowledge Center */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold uppercase tracking-wider mb-4">
                            Knowledge Center
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Frequently Asked Questions
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Everything you need to know about pricing, GST compliance, WhatsApp automation, and switching your business.
                        </p>
                    </div>

                    {/* Interactive Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions (e.g. 'Tally', 'cloud sync', 'GST', 'backup', 'cost')..."
                                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white shadow-inner transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
                        <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                        activeCategory === cat.id
                                            ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Items Grid */}
                    {filteredFaqs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredFaqs.map((faq, idx) => (
                                <FAQItem
                                    key={idx}
                                    question={faq.question}
                                    answer={faq.answer}
                                    badge={faq.badge}
                                    defaultOpen={idx === 0 && !searchQuery}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200">
                            <p className="text-base font-bold text-slate-800 mb-1">No questions found matching &ldquo;{searchQuery}&rdquo;</p>
                            <p className="text-xs text-slate-500 mb-4">Have a specific question not covered here? Reach our team directly.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                className="text-xs font-bold text-indigo-600 underline"
                            >
                                Clear search filter
                            </button>
                        </div>
                    )}

                    {/* Professional "Still Have Questions?" Support Callout Card */}
                    <div className="mt-14 rounded-3xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border border-indigo-200 p-8 sm:p-10 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Support Specialists Online Now</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Still have questions about your specific trade?</h3>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                    Our Chartered Accountants and technical billing experts respond on WhatsApp in under 3 minutes.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                                <a
                                    href="https://wa.me/917479499718?text=Hello%20NexusBilling,%20I%20have%20a%20question%20about%20your%20software"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
                                >
                                    <span>💬 Ask on WhatsApp</span>
                                </a>
                                <a
                                    href="/demo"
                                    className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-all"
                                >
                                    Schedule 1-on-1 Call
                                </a>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-38: FinalHeroCTA — Contrast Combination Banner */}
                <AnimatedSection direction="up">
                    <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white border border-slate-800 p-10 sm:p-20 text-center relative overflow-hidden shadow-2xl backdrop-blur-2xl">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[140px] pointer-events-none" />

                        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                                🚀 Upgrade Your Business Today
                            </span>

                            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                                Ready to experience modern billing &amp; operations?
                            </h2>

                            <p className="text-slate-300 text-base sm:text-xl leading-relaxed">
                                Join 10,000+ Indian businesses automating GST billing, POS counter sales, and WhatsApp field tracking today.
                            </p>

                            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <a
                                    href="/register"
                                    className="px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-base shadow-xl shadow-indigo-500/40 hover:scale-105 transition-all"
                                >
                                    Start Free 14-Day Trial →
                                </a>
                                <a
                                    href="/demo"
                                    className="px-8 py-5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-bold text-base transition-all"
                                >
                                    Book Live Demo
                                </a>
                            </div>

                            <p className="text-xs text-slate-400 pt-2">
                                No credit card needed • Cancel anytime • Free data migration support included
                            </p>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
