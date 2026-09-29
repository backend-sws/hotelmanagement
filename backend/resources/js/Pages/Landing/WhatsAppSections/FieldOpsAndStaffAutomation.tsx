import React, { useState } from 'react';

export default function FieldOpsAndStaffAutomation() {
    // S-21 State: Interactive WhatsApp HR Bot Simulator
    const [activeHrAction, setActiveHrAction] = useState<'punch_in' | 'apply_leave' | 'salary_slip'>('punch_in');

    const hrActions = {
        punch_in: {
            title: 'Morning GPS Punch-In',
            botReply: '📍 Location Verified: Sector 62 Depot (Within 35m). Morning Shift Clocked-In at 09:02 AM. Have a productive day, Rahul!',
            metaData: 'Status: Present • GPS Lat: 28.6280, Long: 77.3649'
        },
        apply_leave: {
            title: 'Casual Leave Request',
            botReply: '📝 Leave Application #LV-819 logged for 24-Feb (Casual Leave - Family Function). Forwarded to Manager Anil Khandelwal for approval.',
            metaData: 'Leave Balance: 6 Days Remaining CL'
        },
        salary_slip: {
            title: 'Download Salary Slip PDF',
            botReply: '📄 Your January 2026 Payslip is ready! Net Pay: ₹28,450 (Including ₹3,850 Travel Allowance + Performance Bonus). PDF attached below.',
            metaData: 'Payslip_Jan2026_Rahul.pdf (Verified)'
        }
    };

    return (
        <section id="fieldops-automation" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-100 px-3.5 py-1 rounded-full border border-teal-300">
                        Zero-App Workforce
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        FieldOps, Technician Dispatch &amp; WhatsApp HR Automation
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Eliminate heavy enterprise apps that technicians refuse to download. Manage job dispatch, live GPS geofencing, Gemini AI repair verification, and HR attendance directly via WhatsApp.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-18 to S-20: Zero-App Dispatch, Gemini AI Photo Audit & Geofenced Punch  */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
                    
                    {/* Left: 3 Core Dispatch Pillars */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                                    01
                                </span>
                                <h3 className="text-base font-bold text-slate-900">
                                    Zero-App Technician Dispatch
                                </h3>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed pl-11">
                                Technicians receive job tickets, client addresses, and Google Maps links right in WhatsApp. They can tap buttons to Accept, En-Route, Arrive, or Call Client. Zero app install resistance.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-sm">
                                    02
                                </span>
                                <h3 className="text-base font-bold text-slate-900">
                                    Google Gemini 1.5 Flash Vision AI Audits
                                </h3>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed pl-11">
                                Field engineers snap before/after repair photos directly inside WhatsApp. Gemini AI inspects pressure gauges, circuit boards, and fiber splices, rejecting fake gallery uploads in &lt;800ms.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                                    03
                                </span>
                                <h3 className="text-base font-bold text-slate-900">
                                    50m Geofenced Punch-In &amp; Fraud Shield
                                </h3>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed pl-11">
                                Technicians share live location inside WhatsApp. The cloud server verifies their GPS coordinates against customer site lat/long within 50 meters before allowing the job to be marked started.
                            </p>
                        </div>
                    </div>

                    {/* Right: Interactive HR Bot Simulator (S-21) */}
                    <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div>
                                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Internal Staff Bot</span>
                                <h4 className="text-lg font-black text-white mt-0.5">
                                    WhatsApp HR &amp; Attendance Simulator
                                </h4>
                            </div>
                            <span className="text-xs font-mono bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 text-slate-300">
                                Bot: @nexus_hr
                            </span>
                        </div>

                        {/* Action Tabs */}
                        <div className="grid grid-cols-3 gap-2 mt-5">
                            {(['punch_in', 'apply_leave', 'salary_slip'] as const).map((action) => (
                                <button
                                    key={action}
                                    type="button"
                                    onClick={() => setActiveHrAction(action)}
                                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition text-center border ${
                                        activeHrAction === action
                                            ? 'bg-teal-500 text-slate-950 border-teal-400 font-black shadow-xs'
                                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                                    }`}
                                >
                                    {action === 'punch_in' && '📍 GPS Punch'}
                                    {action === 'apply_leave' && '📝 Apply Leave'}
                                    {action === 'salary_slip' && '📄 Salary Slip'}
                                </button>
                            ))}
                        </div>

                        {/* Simulated Bot Response */}
                        <div className="mt-6 bg-slate-900/90 rounded-2xl p-5 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/5">
                                <span>Technician: Rahul Sharma (#EMP-841)</span>
                                <span className="text-teal-400">Response: 0.4s</span>
                            </div>

                            <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 text-xs text-slate-200 leading-relaxed">
                                {hrActions[activeHrAction].botReply}
                            </div>

                            <div className="text-[11px] font-mono text-emerald-400">
                                ✓ {hrActions[activeHrAction].metaData}
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                            <span>Zero biometric machine maintenance costs</span>
                            <span className="text-teal-400 font-semibold">100% Cloud Payroll Sync</span>
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-22 & S-23: Mobile Van Inventory Debit & Customer Uber-Style Tracking    */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* S-22: Van Stock Auto-Debit */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                Inventory Accuracy
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                Real-Time Van Stock Auto-Debit
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                When a technician closes a ticket via customer OTP on WhatsApp, all used capacitors, copper rolls, or filters are instantly debited from that technician's mobile van warehouse in Nexus ERP.
                            </p>

                            <div className="mt-6 space-y-2.5 text-xs">
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Job Completion OTP Entered</span>
                                    <span className="font-bold text-emerald-600">OTP 4910 Verified</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Van Inventory #DL-1V-8942 Debited</span>
                                    <span className="font-bold text-emerald-600">-1x Dual Capacitor 45uF</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Central Godown Stock Alert</span>
                                    <span className="font-bold text-emerald-600">Reorder Restock Indent</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Prevents unbilled technician spare part loss</span>
                            <span className="font-bold text-emerald-700">&lt;0.2% Variance</span>
                        </div>
                    </div>

                    {/* S-23: Customer Live Uber-Style Tracking */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                Customer Experience
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                Uber-Style Live Map Tracking Links
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Customers receive a WhatsApp notification with a live tracking link when the technician leaves the hub. Shows technician name, photo, vehicle number, and real-time arrival countdown.
                            </p>

                            <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-2">
                                <div className="flex items-center justify-between font-bold text-slate-900">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                                        Technician On The Way
                                    </span>
                                    <span className="text-blue-700 font-mono">ETA: 14 Mins</span>
                                </div>
                                <p className="text-slate-600 text-[11px]">
                                    Rahul Sharma is driving towards your location (DLF Cyber Hub). Vehicle: Honda Activa (DL-4S-8921).
                                </p>
                                <div className="pt-2 flex items-center justify-between text-[11px] text-blue-800 font-semibold border-t border-blue-200/60">
                                    <span>Call Technician: +91 98110 XXXXX</span>
                                    <span className="underline cursor-pointer">Open Live Map →</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Cuts "Where is my technician?" call volume</span>
                            <span className="font-bold text-blue-700">-64% Call Load</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
