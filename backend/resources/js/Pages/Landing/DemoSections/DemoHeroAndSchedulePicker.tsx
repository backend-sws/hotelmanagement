import React from 'react';

interface Props {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    selectedTime: string;
    setSelectedTime: (time: string) => void;
    selectedFormat: string;
    setSelectedFormat: (format: string) => void;
}

export default function DemoHeroAndSchedulePicker({
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedFormat,
    setSelectedFormat
}: Props) {
    const dates = [
        { id: 'today', label: 'Today', sub: 'Sept 18' },
        { id: 'tomorrow', label: 'Tomorrow', sub: 'Sept 19' },
        { id: 'sat', label: 'Saturday', sub: 'Sept 20' },
        { id: 'mon', label: 'Monday', sub: 'Sept 22' },
        { id: 'tue', label: 'Tuesday', sub: 'Sept 23' }
    ];

    const timeSlots = [
        '11:30 AM',
        '02:30 PM',
        '04:00 PM',
        '06:30 PM',
        '08:00 PM'
    ];

    const formats = [
        {
            id: 'meet',
            title: '1-on-1 Google Meet',
            desc: 'Live screen share with a senior ERP architect on your laptop/phone',
            icon: '📹'
        },
        {
            id: 'in_person',
            title: 'In-Person Store Visit',
            desc: 'Certified local IT engineer visits your shop across 180+ Indian cities',
            icon: '🏢'
        },
        {
            id: 'sandbox',
            title: 'Interactive Sandbox',
            desc: 'Instant in-browser simulator with barcode scanner test drive',
            icon: '⚡'
        }
    ];

    return (
        <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-gradient-to-tr from-blue-100/40 via-indigo-50/30 to-purple-100/40 blur-3xl pointer-events-none -z-10" />

            {/* ========================================================================= */}
            {/* S-01: Demo Hero & 3-Step Preview                                          */}
            {/* ========================================================================= */}
            <section className="pt-24 pb-12 sm:pt-32 sm:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto space-y-6">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Live Interactive Walkthrough • Free &amp; Zero Commitment
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                            Experience India’s #1 Cloud ERP{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Customized for Your Business
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Schedule a 20-minute tailored screen walkthrough with our product specialists. See real-time multi-counter billing, automated GSTR-2B reconciliation, and WhatsApp in-chat ordering live.
                        </p>

                        {/* ========================================================================= */}
                        {/* S-04: Live Booking Trust Ticker                                           */}
                        {/* ========================================================================= */}
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-600">●</span> 48 Demos Scheduled Today
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-blue-600">●</span> 12,000+ Businesses Running Live
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-purple-600">●</span> 100% Real-Time Cloud Sync
                            </span>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* S-02 & S-03: Interactive Scheduler & Format Picker                        */}
                    {/* ========================================================================= */}
                    <div className="mt-14 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
                        {/* Format Picker */}
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-3">
                                Step 1: Choose Your Preferred Demo Format
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {formats.map((fmt) => (
                                    <button
                                        type="button"
                                        key={fmt.id}
                                        onClick={() => setSelectedFormat(fmt.id)}
                                        className={`p-4 rounded-2xl border text-left transition-all ${
                                            selectedFormat === fmt.id
                                                ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-1 ring-blue-600'
                                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                                        }`}
                                    >
                                        <span className="text-2xl mb-1 block">{fmt.icon}</span>
                                        <div className="font-black text-slate-900 text-xs">{fmt.title}</div>
                                        <div className="text-[11px] text-slate-500 mt-1 leading-snug">{fmt.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date & Time Slot Picker */}
                        <div className="pt-4 border-t border-slate-100">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-3">
                                Step 2: Select Date &amp; Time Window
                            </span>

                            {/* Date Selector */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                                {dates.map((d) => (
                                    <button
                                        type="button"
                                        key={d.id}
                                        onClick={() => setSelectedDate(d.id)}
                                        className={`py-3 px-2 rounded-xl text-center transition-all ${
                                            selectedDate === d.id
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                    >
                                        <div className="text-xs font-bold">{d.label}</div>
                                        <div className={`text-[10px] mt-0.5 ${selectedDate === d.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {d.sub}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Time Slot Selector */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        type="button"
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all ${
                                            selectedTime === slot
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-05: Demo Quick Nav Hub (Light Sticky Navigation Bar)                    */}
            {/* ========================================================================= */}
            <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200/80 py-2.5 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
                    <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max text-xs font-bold text-slate-600">
                        <a href="#booking-form" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Booking Form
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#self-guided-sandbox" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Interactive Sandbox
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#demo-curriculum" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            What You&apos;ll Learn
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#merchant-stories" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Merchant Stories
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#demo-faqs" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            FAQs
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
