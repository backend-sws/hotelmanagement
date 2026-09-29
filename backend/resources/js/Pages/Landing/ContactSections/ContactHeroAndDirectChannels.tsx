import React from 'react';

interface Props {
    selectedInquiryType: string;
    setSelectedInquiryType: (type: string) => void;
}

export default function ContactHeroAndDirectChannels({
    selectedInquiryType,
    setSelectedInquiryType
}: Props) {
    const inquiryTypes = [
        { id: 'demo', label: 'Product Demo & Pricing' },
        { id: 'support', label: 'Technical Support & POS Setup' },
        { id: 'gst', label: 'GST & Statutory Compliance Advice' },
        { id: 'partner', label: 'CA & Channel Partnership' },
        { id: 'general', label: 'General Inquiry' }
    ];

    const languages = [
        { code: 'hi', name: 'Hindi (हिंदी)', status: 'Active Now' },
        { code: 'en', name: 'English', status: 'Active Now' },
        { code: 'gu', name: 'Gujarati (ગુજરાતી)', status: 'Active Now' },
        { code: 'mr', name: 'Marathi (मराठी)', status: 'Active Now' },
        { code: 'ta', name: 'Tamil (தமிழ்)', status: 'Active Now' },
        { code: 'te', name: 'Telugu (తెలుగు)', status: 'Active Now' }
    ];

    return (
        <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-gradient-to-tr from-blue-100/40 via-indigo-50/30 to-purple-100/40 blur-3xl pointer-events-none -z-10" />

            {/* ========================================================================= */}
            {/* S-01: Contact Hero with Live SLA Status                                   */}
            {/* ========================================================================= */}
            <section className="pt-24 pb-12 sm:pt-32 sm:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto space-y-6">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            Live Support Desk Online • Avg Response: 2m 45s
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                            We’re Here to Help You Run Your Business{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Without Interruption
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Connect with dedicated ERP engineers, retail POS technicians, and Chartered Accountants 7 days a week. We speak your language and understand the urgency of Indian retail and distribution counters.
                        </p>

                        {/* ========================================================================= */}
                        {/* S-04: Interactive Inquiry Type Selector Pills                             */}
                        {/* ========================================================================= */}
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
                            <span className="text-xs font-bold text-slate-500 mr-1">I need help with:</span>
                            {inquiryTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedInquiryType(type.id)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedInquiryType === type.id
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* S-02: Live Support Channels Strip                                         */}
                    {/* ========================================================================= */}
                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Priority Phone */}
                        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
                            <div>
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl mb-4">
                                    📞
                                </div>
                                <h3 className="font-black text-slate-900 text-base">Priority Phone Desk</h3>
                                <p className="text-xs text-slate-500 mt-1">Speak directly with a support engineer</p>
                                <div className="mt-3 text-sm font-black font-mono text-blue-600">
                                    +91 747 949 9718
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                                Mon - Sat: 8:00 AM - 10:00 PM IST
                            </div>
                        </div>

                        {/* WhatsApp Direct Chat */}
                        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
                            <div>
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl mb-4">
                                    💬
                                </div>
                                <h3 className="font-black text-slate-900 text-base">WhatsApp Support Desk</h3>
                                <p className="text-xs text-slate-500 mt-1">Quick screenshot &amp; invoice assistance</p>
                                <div className="mt-3 text-sm font-black font-mono text-emerald-600">
                                    +91 747 949 9718
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100">
                                <a
                                    href="https://wa.me/917479499718"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                                >
                                    Open WhatsApp Chat →
                                </a>
                            </div>
                        </div>

                        {/* Official Support Email */}
                        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all">
                            <div>
                                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl mb-4">
                                    ✉️
                                </div>
                                <h3 className="font-black text-slate-900 text-base">Official Support Email</h3>
                                <p className="text-xs text-slate-500 mt-1">Ticket tracking with guaranteed response SLA</p>
                                <div className="mt-3 text-sm font-black text-purple-600 break-all">
                                    support@nexusbilling.in
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                                2-Hour Response SLA on weekdays
                            </div>
                        </div>

                        {/* Enterprise Sales Desk */}
                        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all">
                            <div>
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-4">
                                    🏢
                                </div>
                                <h3 className="font-black text-slate-900 text-base">Enterprise &amp; Sales</h3>
                                <p className="text-xs text-slate-500 mt-1">For 5+ retail outlets &amp; factory ERP</p>
                                <div className="mt-3 text-sm font-black text-amber-700 break-all">
                                    sales@nexusbilling.in
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                                Dedicated account managers assigned
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* S-03: Multilingual Support Badges                                         */}
                    {/* ========================================================================= */}
                    <div className="mt-10 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-xs">
                            <span className="font-bold text-slate-900 block">7-Day Multilingual Help Desk:</span>
                            <span className="text-slate-500 text-[11px]">All our support agents speak your local regional commerce language</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {languages.map((lang) => (
                                <span
                                    key={lang.code}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {lang.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-05: Contact Quick Nav Hub (Light Sticky Navigation Bar)                 */}
            {/* ========================================================================= */}
            <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200/80 py-2.5 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
                    <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max text-xs font-bold text-slate-600">
                        <a href="#inquiry-form" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Inquiry Form
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#regional-offices" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Regional Offices
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#support-slas" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Support SLAs &amp; Escalation
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#partner-inquiries" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            CA &amp; Hardware Partners
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#contact-faqs" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            FAQs &amp; Corporate Info
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
