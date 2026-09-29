import React, { useState } from 'react';

export default function WhatsAppDispatchAndJobCards() {
    // S-07 State: Interactive WhatsApp Ticket Dispatch Simulator
    const [dispatched, setDispatched] = useState(false);
    const [jobStep, setJobStep] = useState<'assigned' | 'reached' | 'completed'>('assigned');

    const handleSimulateDispatch = () => {
        setDispatched(true);
        setJobStep('assigned');
    };

    return (
        <section id="whatsapp-dispatch" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/60">
                        Zero-Friction Technician Experience
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Zero-App WhatsApp Job Dispatch &amp; Digital Job Cards
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Technicians hate heavy mobile apps that drain battery and freeze. Nexus operates entirely through official Meta WhatsApp bots with interactive buttons, live GPS, and customer e-signatures.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-07: Interactive WhatsApp Dispatch Simulator                             */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* Left Side: Dispatch Controls */}
                        <div className="lg:col-span-6">
                            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Interactive Bot Simulator</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">
                                Experience Live WhatsApp Ticket Dispatch
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                See how a central dispatcher in your head office assigns an AC repair job, and how your field technician receives it on WhatsApp in under 1 second.
                            </p>

                            <div className="space-y-3 mt-6">
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                                        <span>Customer: Rahul Singhania (Noida)</span>
                                        <span className="text-rose-600 font-black">P1 High Priority</span>
                                    </div>
                                    <p className="text-slate-500">Problem: Split AC Not Cooling • Error Code E4 (Gas Leakage)</p>
                                    <p className="text-slate-400 mt-1">Assigned Technician: Sunil Verma (+91 747 949 9718)</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSimulateDispatch}
                                        className="px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-all shadow-xs"
                                    >
                                        🚀 Dispatch Ticket to WhatsApp
                                    </button>
                                    {dispatched && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setJobStep('reached')}
                                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                                    jobStep === 'reached' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-700 border-slate-200'
                                                }`}
                                            >
                                                Tech Taps "I have Reached"
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setJobStep('completed')}
                                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                                    jobStep === 'completed' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-700 border-slate-200'
                                                }`}
                                            >
                                                Upload Photo &amp; Close
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Technician WhatsApp Chat Phone Mockup */}
                        <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl max-w-sm mx-auto text-white">
                            {/* WhatsApp Header */}
                            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-slate-950">
                                    N
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                        Nexus FieldOps Bot
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    </p>
                                    <p className="text-[10px] text-slate-400">Official Meta Cloud API • Live</p>
                                </div>
                            </div>

                            {/* Chat Bubble Area */}
                            <div className="py-4 space-y-3 font-sans text-xs">
                                {!dispatched ? (
                                    <div className="text-center py-8 text-slate-500 text-xs">
                                        Click "Dispatch Ticket" on the left to see live WhatsApp bot message stream.
                                    </div>
                                ) : (
                                    <>
                                        {/* Bot Message 1: Assignment */}
                                        <div className="bg-[#128C7E]/25 border border-[#128C7E]/40 p-3 rounded-2xl max-w-[90%] space-y-1.5 text-slate-200">
                                            <p className="font-bold text-emerald-300">🚨 NEW SERVICE TICKET #4912</p>
                                            <p className="text-[11px]"><strong>Customer:</strong> Rahul Singhania</p>
                                            <p className="text-[11px]"><strong>Address:</strong> Flat 402, Sector 62, Noida</p>
                                            <p className="text-[11px]"><strong>Issue:</strong> AC Error E4 (Gas Refilling)</p>
                                            <div className="pt-2 flex flex-col gap-1 text-[11px]">
                                                <span className="p-1.5 rounded bg-white/10 text-center font-bold text-white">
                                                    🗺️ Open Google Maps Directions
                                                </span>
                                            </div>
                                        </div>

                                        {/* State Progression */}
                                        {jobStep === 'reached' && (
                                            <div className="bg-blue-950/40 border border-blue-500/30 p-2.5 rounded-2xl max-w-[90%] text-blue-200 text-[11px]">
                                                <p className="font-bold">📍 Geofence Verified: Sector 62</p>
                                                <p className="text-[10px] text-slate-400">Customer notified: "Sunil has arrived on site"</p>
                                                <p className="text-emerald-400 font-bold mt-1">Please snap before/after repair photo.</p>
                                            </div>
                                        )}

                                        {jobStep === 'completed' && (
                                            <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-2xl max-w-[90%] text-emerald-200 text-[11px]">
                                                <p className="font-bold">✅ Gemini AI Vision Verified (98.4%)</p>
                                                <p className="text-[10px] text-slate-400">Pressure gauge photo validated: 65 PSI R32 Gas.</p>
                                                <p className="font-bold text-white mt-1">Digital Job Card Signed • UPI Paid ₹1,850</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* WhatsApp Input Bar */}
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
                                <span>No app updates needed • 2G/3G ready</span>
                                <span className="text-emerald-400 font-bold">100% WhatsApp</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-06 & S-08: Digital Job Card e-Signatures & Customer Live Tracking        */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                    
                    {/* S-06: Digital Job Card with Customer Signature */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Paperless FieldOps</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Digital Job Cards &amp; e-Signatures
                                </h3>
                            </div>
                            <span className="text-2xl">✍️</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                            Never lose paper service slips again. Customers review replaced spare parts and draw their digital signature directly on the technician's phone or via a secure WhatsApp link.
                        </p>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 font-black flex items-center justify-center shrink-0">
                                    📝
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">Pre-Service Checklist Verification</p>
                                    <p className="text-[10px] text-slate-500">Log physical scratches, existing power faults before touching equipment</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center shrink-0">
                                    📱
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">Touchscreen Finger e-Signature Capture</p>
                                    <p className="text-[10px] text-slate-500">Embedded into GST tax invoice PDF with timestamp and GPS coordinates</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center shrink-0">
                                    ⭐
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">Instant 5-Star CSAT Rating Link</p>
                                    <p className="text-[10px] text-slate-500">Auto-routes satisfied customers to Google Reviews to build your local brand</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* S-08: Customer Live Technician Tracking (Uber-Style) */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Premium Customer Delight</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Uber-Like Live Technician Tracking
                                </h3>
                            </div>
                            <span className="text-2xl">📍</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                            Stop customers calling repeatedly to ask "Where is the technician?". Send an automated WhatsApp notification with a live tracking map link as soon as the technician starts driving.
                        </p>

                        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-3 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-white/10 font-bold">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    Live Route Tracker
                                </span>
                                <span className="text-blue-300">ETA: 14 Minutes</span>
                            </div>

                            <div className="flex items-center gap-3 py-1">
                                <div className="w-9 h-9 rounded-full bg-white/10 text-white font-black text-xs flex items-center justify-center border border-white/20">
                                    SV
                                </div>
                                <div>
                                    <p className="font-bold text-white">Technician: Sunil Verma</p>
                                    <p className="text-[10px] text-slate-400">Hero Splendor • MH-04-AB-9812 • Verified COVID Vaccinated</p>
                                </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px]">
                                <span>Security Pin Code for Entry:</span>
                                <strong className="text-emerald-400 tracking-widest text-sm">#8491</strong>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                            <span>✓ Zero phone support calls needed</span>
                            <span className="font-bold text-blue-600">96.8% On-Time Arrival</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-09 to S-11: Estimates to Invoices, UPI QR Payments & SLA Escalations    */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    
                    {/* S-09: One-Click Estimate to Invoice Flow */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg mb-3">
                            📑
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Estimate &rarr; GST Tax Invoice
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Tech generates on-site repair quotation. Customer approves via WhatsApp OTP; converted instantly to final GST invoice with SAC 9987 codes.
                        </p>
                    </div>

                    {/* S-10: On-Site Payment Collection with Dynamic UPI QR */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                            💳
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Dynamic Table-Top UPI QR
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Tech displays dynamic UPI QR code on WhatsApp link for the exact invoice amount. Instant webhook settlement updates company khata without cash leaks.
                        </p>
                    </div>

                    {/* S-11: Job Priority & SLA Escalation */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-3">
                            ⏱️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            P1 SLA Escalation Engine
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            If a technician fails to accept an emergency ticket within 15 minutes, Nexus automatically re-assigns to the next nearest tech and alerts the supervisor.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
