import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AnimatedSection from '@/Components/Site/AnimatedSection';

export default function InteractiveBotAndDemoSection() {
    const [botStep, setBotStep] = useState<number>(1);

    const { data, setData, post, processing, wasSuccessful, reset, errors } = useForm({
        business_name: '',
        contact_person: '',
        phone: '',
        email: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/lead', {
            onSuccess: () => reset(),
        });
    };

    return (
        <section className="py-24 relative bg-slate-50/70 border-t border-slate-200 overflow-hidden">
            {/* Ambient Lights */}
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-100/50 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 relative z-10">
                {/* S-31: GstComplianceBanner */}
                <AnimatedSection direction="up">
                    <div className="rounded-3xl bg-white border-2 border-emerald-500/30 p-8 sm:p-12 shadow-xl shadow-emerald-500/5">
                        <div className="text-center max-w-3xl mx-auto space-y-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                                100% Statutory Guarantee
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                100% GST Compliant — Guaranteed Updates within 24 Hours
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                Whenever the GST Council amends tax slabs, HSN codes, or e-invoice rules, our cloud platform auto-updates across all tenants within 24 hours. You never face fines or notice penalties.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-6">
                                {[
                                    'e-Invoicing IRN',
                                    'e-Way Bill Bulk',
                                    'GSTR-1 JSON',
                                    'GSTR-3B Summary',
                                    'ITC Reconciliation',
                                    'Immutable Audit Trail',
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center"
                                    >
                                        <span className="text-emerald-700 text-xs font-bold block mb-1">✔ Active</span>
                                        <span className="text-xs font-semibold text-slate-800">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-32: WhatsAppBotDemo */}
                <AnimatedSection direction="up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                                Interactive WhatsApp Simulation
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                Try the WhatsApp Bot yourself
                            </h2>
                            <p className="text-slate-600 text-base leading-relaxed mb-6">
                                Click the interactive options on the mock WhatsApp phone to experience how field staff punch attendance, verify GPS, submit AI work photos, and receive automated payslips.
                            </p>

                            <div className="flex gap-2 mb-6">
                                {[1, 2, 3, 4].map((step) => (
                                    <button
                                        key={step}
                                        type="button"
                                        onClick={() => setBotStep(step)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            botStep === step
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Step {step}
                                    </button>
                                ))}
                            </div>

                            <p className="text-xs text-slate-500 font-medium">
                                Step 1: Greeting • Step 2: Live Location • Step 3: AI Photo Audit • Step 4: Attendance Success
                            </p>
                        </div>

                        {/* Interactive Phone Simulation (Contrast Phone Frame) */}
                        <div className="lg:col-span-6">
                            <div className="max-w-sm mx-auto rounded-[36px] bg-slate-900 border-4 border-slate-800 p-4 shadow-2xl shadow-emerald-950/20">
                                {/* Header */}
                                <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08] mb-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                                        NB
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white flex items-center gap-1">
                                            Nexus Staff Bot
                                            <span className="text-emerald-400 text-[10px]">✓</span>
                                        </p>
                                        <p className="text-[10px] text-emerald-400">Online • Automated Assistant</p>
                                    </div>
                                </div>

                                {/* Dynamic Chat Messages based on botStep */}
                                <div className="space-y-3 font-sans text-xs min-h-[280px]">
                                    <div className="bg-[#202c33] text-slate-200 p-3 rounded-2xl rounded-tl-none space-y-1">
                                        <p className="font-semibold text-emerald-300">🙏 Namaste Rajesh!</p>
                                        <p className="text-[11px]">Welcome to Nexus Staff Portal. Please choose an action:</p>
                                    </div>

                                    {botStep >= 1 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setBotStep(2)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                    botStep === 1
                                                        ? 'bg-emerald-400 text-slate-950 animate-bounce'
                                                        : 'bg-emerald-500/20 text-emerald-300'
                                                }`}
                                            >
                                                📍 Punch In
                                            </button>
                                            <span className="px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] text-slate-400">
                                                📋 My Tasks (3)
                                            </span>
                                        </div>
                                    )}

                                    {botStep >= 2 && (
                                        <div className="bg-[#202c33] text-slate-200 p-3 rounded-2xl rounded-tl-none space-y-1 animate-fadeIn">
                                            <p className="text-[11px]">📍 Please send your Live GPS Location to confirm geofence.</p>
                                            <div
                                                onClick={() => setBotStep(3)}
                                                className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-bold cursor-pointer hover:bg-emerald-500/20 transition-colors"
                                            >
                                                Share Current Location (Click to verify)
                                            </div>
                                        </div>
                                    )}

                                    {botStep >= 3 && (
                                        <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-none space-y-1 animate-fadeIn">
                                            <p className="text-[11px]">Location received: Sector 62, Noida (Within Geofence ✅)</p>
                                            <p className="text-[11px] font-semibold">📷 Now snap a quick selfie for Gemini AI verification.</p>
                                            <div
                                                onClick={() => setBotStep(4)}
                                                className="mt-2 p-2 rounded-lg bg-white/20 text-center font-bold cursor-pointer hover:bg-white/30"
                                            >
                                                Upload Selfie (Click to simulate)
                                            </div>
                                        </div>
                                    )}

                                    {botStep >= 4 && (
                                        <div className="bg-[#202c33] text-slate-200 p-3.5 rounded-2xl rounded-tl-none space-y-1 animate-fadeIn border border-emerald-500/30">
                                            <p className="font-bold text-emerald-400">🎉 Punch In Successful!</p>
                                            <p className="text-[11px] text-slate-300">
                                                Time: 09:12 AM • Gemini AI Face Match: 98.4% Confidence • Geofence: OK.
                                            </p>
                                            <p className="text-[10px] text-indigo-300 mt-1 font-medium">
                                                Have a great, productive day!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-33: NewsMediaMentions */}
                <AnimatedSection direction="up">
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
                            Recognized across leading national media &amp; technology journals
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 hover:opacity-100 transition-opacity">
                            {['Economic Times', 'YourStory', 'Inc42', 'Entrackr', 'Business Standard', 'TechCircle'].map((media, i) => (
                                <span key={i} className="text-base sm:text-lg font-black tracking-tight text-slate-700">
                                    {media}
                                </span>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-34: DemoRequestSection */}
                <AnimatedSection direction="up">
                    <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-6 space-y-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                                    Personalized Consultation
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                    Book a live 20-minute product walkthrough
                                </h2>
                                <p className="text-slate-600 text-base leading-relaxed">
                                    See exactly how NexusBilling automates GST billing, inventory, and WhatsApp field tracking for your exact business model.
                                </p>

                                <div className="space-y-3 text-sm text-slate-700 font-medium">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
                                        <span>Custom demo tailored to your specific trade</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
                                        <span>Free data migration plan from Tally / Vyapar / Busy</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
                                        <span>Instant WhatsApp contact from our solutions architect</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lead Form */}
                            <div className="lg:col-span-6">
                                <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                                    {wasSuccessful && (
                                        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                                            <span>✅</span>
                                            <span>Thank you! We will reach out on WhatsApp within 30 minutes.</span>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Business Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.business_name}
                                            onChange={(e) => setData('business_name', e.target.value)}
                                            placeholder="e.g. Apex Traders Ltd"
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-indigo-600 focus:outline-none shadow-2xs"
                                        />
                                        {errors.business_name && <p className="text-xs text-rose-600 mt-1">{errors.business_name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-800 mb-1.5">Your Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.contact_person}
                                                onChange={(e) => setData('contact_person', e.target.value)}
                                                placeholder="e.g. Rahul Verma"
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-indigo-600 focus:outline-none shadow-2xs"
                                            />
                                            {errors.contact_person && <p className="text-xs text-rose-600 mt-1">{errors.contact_person}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-800 mb-1.5">WhatsApp Mobile No *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="e.g. +91 747 949 9718"
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-indigo-600 focus:outline-none shadow-2xs"
                                            />
                                            {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Work Email (Optional)</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="e.g. rahul@apextraders.com"
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-indigo-600 focus:outline-none shadow-2xs"
                                        />
                                        {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-800 mb-1.5">What are your top challenges?</label>
                                        <textarea
                                            rows={2}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="e.g. Invoicing speed, staff attendance tracking, multi-godown stock..."
                                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:border-indigo-600 focus:outline-none shadow-2xs"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : 'Request WhatsApp Demo Walkthrough →'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
