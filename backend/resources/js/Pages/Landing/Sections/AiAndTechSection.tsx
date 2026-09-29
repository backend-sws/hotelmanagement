import AnimatedSection from '@/Components/Site/AnimatedSection';

export default function AiAndTechSection() {
    return (
        <section className="py-24 relative bg-white overflow-hidden">
            {/* Background Orb */}
            <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[180px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 relative z-10">
                {/* S-27: MobilePwaSection */}
                <AnimatedSection direction="up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-4">
                                Progressive Web App (PWA)
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                Runs effortlessly on any phone, tablet, Mac or PC
                            </h2>
                            <p className="text-slate-600 text-base leading-relaxed mb-6">
                                No clunky 500MB software installations, no operating system driver conflicts. Open Google Chrome, Safari, or Edge — add to your home screen with 1 tap, and you’re ready to bill.
                            </p>

                            <div className="space-y-3 text-xs text-slate-700 font-medium">
                                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                                    <span className="text-xl">📲</span>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Add to Home Screen in 1 Tap</p>
                                        <p className="text-slate-500">Launches full screen just like a native Android or iOS application.</p>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                                    <span className="text-xl">⚡</span>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Sub-50ms Cloud POS Engine</p>
                                        <p className="text-slate-500">Instant barcode scanning and lightning-fast thermal receipt printing.</p>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                                    <span className="text-xl">🔄</span>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Zero Update Downtime</p>
                                        <p className="text-slate-500">Always on the latest GST compliant version without manual software patching.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Multi-Device Mockup Visual */}
                        <div className="lg:col-span-6">
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl relative">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                        <span className="text-xs font-bold text-slate-900">Cross-Platform Synchronized</span>
                                        <span className="text-xs text-emerald-700 font-mono font-bold">Real-time WebSocket</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                                            <span className="text-2xl">📱</span>
                                            <p className="text-xs font-bold text-slate-900 mt-1">Mobile</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Field attendance &amp; bills</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                                            <span className="text-2xl">📟</span>
                                            <p className="text-xs font-bold text-slate-900 mt-1">Tablet POS</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Counter touch checkout</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                                            <span className="text-2xl">💻</span>
                                            <p className="text-xs font-bold text-slate-900 mt-1">Desktop</p>
                                            <p className="text-[10px] text-slate-500 font-medium">CA reports &amp; analytics</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
                                        <p className="text-xs font-bold text-indigo-800">
                                            One account syncs across all your devices simultaneously. No per-seat fee.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-28: AiFeaturesHighlight — High Contrast AI Feature Card Combination */}
                <AnimatedSection direction="up">
                    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                        <div className="max-w-3xl space-y-4 mb-12">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-extrabold uppercase tracking-wider">
                                <span>✨</span>
                                <span>Powered by Google Gemini AI</span>
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                Intelligence built directly into your day-to-day workflow
                            </h2>
                            <p className="text-slate-300 text-base leading-relaxed">
                                We leverage multimodal artificial intelligence to automate compliance verification, detect fraud, and optimize inventory without manual oversight.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/40 transition-all">
                                <span className="text-3xl">🤖</span>
                                <h3 className="text-base font-bold text-white mt-4 mb-2">AI Vision Proof Audit</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Gemini Vision analyzes technician site photos in real-time, verifying that the actual installation or repair work was performed and rejecting photos taken off laptop screens.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/40 transition-all">
                                <span className="text-3xl">📈</span>
                                <h3 className="text-base font-bold text-white mt-4 mb-2">Predictive Stock Reorder</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Machine learning forecasts high-demand spikes based on upcoming festivals, seasonal buying cycles, and vendor lead times so you never run out of top sellers.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/40 transition-all">
                                <span className="text-3xl">💬</span>
                                <h3 className="text-base font-bold text-white mt-4 mb-2">Smart Tone Reminders</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Adaptive messaging adjusts reminder tone dynamically based on client relationship history — polite and warm for loyal customers, assertive for persistent defaulters.
                                </p>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-29: PartnerProgramTeaser */}
                <AnimatedSection direction="up">
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 shadow-xs">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8 space-y-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                                    Partner &amp; Reseller Program
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                                    Are you a Chartered Accountant, GST Practitioner, or IT Reseller?
                                </h3>
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    Earn 30% recurring monthly commission on every client you onboard. Get a free CA Master Dashboard to audit client accounts, file GSTR returns, and automate practice management.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-slate-700">
                                    <span>✔ 30% Lifetime recurring revenue</span>
                                    <span>✔ Free CA Master Audit portal</span>
                                    <span>✔ Co-branded marketing collaterals</span>
                                </div>
                            </div>
                            <div className="lg:col-span-4 text-left lg:text-right">
                                <a
                                    href="/partners"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
                                >
                                    <span>Join Partner Network</span>
                                    <span>→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-30: BlogHighlights */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            Resources &amp; Knowledge
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">
                            Latest GST insights &amp; SME growth playbooks
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                tag: 'GST Compliance',
                                title: 'New GST e-Invoicing Guidelines for Businesses Above ₹5 Crore',
                                excerpt: 'Learn how to generate IRN e-invoices instantly and avoid hefty 100% tax penalty notices on B2B transactions.',
                                time: '4 min read',
                                slug: 'gst-einvoicing-guidelines-2026',
                            },
                            {
                                tag: 'WhatsApp Automation',
                                title: 'How WhatsApp Invoicing Boosts Cash Flow Collection by 300%',
                                excerpt: 'Case analysis on why email invoices get ignored and how dynamic UPI QR links get your invoices paid immediately.',
                                time: '5 min read',
                                slug: 'whatsapp-invoicing-boosts-cashflow',
                            },
                            {
                                tag: 'Field Operations',
                                title: 'Preventing Fake Field Staff Travel & Attendance Claims with AI',
                                excerpt: 'A comprehensive operational guide to eliminating manual attendance fraud and automating verified TA/DA calculation.',
                                time: '6 min read',
                                slug: 'preventing-field-attendance-fraud-ai',
                            },
                        ].map((article, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                        {article.tag}
                                    </span>
                                    <h4 className="text-base font-bold text-slate-900 mt-2 mb-2 leading-snug">
                                        {article.title}
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                                        {article.excerpt}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                                    <span className="text-slate-500 font-medium">{article.time}</span>
                                    <a href={`/blog/${article.slug}`} className="font-bold text-indigo-600 hover:underline">
                                        Read Article →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <a href="/blog" className="text-sm font-bold text-indigo-600 hover:underline transition-colors">
                            Explore all 40+ free business guides in our Resource Center →
                        </a>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
