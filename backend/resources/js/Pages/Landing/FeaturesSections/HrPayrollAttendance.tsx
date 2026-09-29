import { useState } from 'react';

const ATTENDANCE_MODES = [
    {
        title: 'WhatsApp Bot Punch (Field & Remote)',
        desc: 'Staff sends live GPS location + selfie directly on WhatsApp. Bot validates geofence within 100 meters and logs check-in in 2 seconds.',
        badge: 'No App Install Needed',
        icon: '📱',
    },
    {
        title: 'Store PWA Web Portal Punch',
        desc: 'Cashiers and store managers tap check-in on the POS screen or tablet. Camera takes rapid face snapshot to prevent buddy punching.',
        badge: 'Instant POS Integration',
        icon: '💻',
    },
    {
        title: 'Biometric Hardware API Webhook',
        desc: 'Connect your existing eSSL, Realtime, or ZKTeco biometric fingerprint/face devices via LAN. Logs sync directly to cloud attendance.',
        badge: 'Zero Hardware Lock-in',
        icon: '👆',
    },
    {
        title: 'Manager Geo-Override with Audit Trail',
        desc: 'Store managers can approve on-duty (OD) requests, client site visits, and manual miss-punches with mandatory supervisor remarks.',
        badge: 'Immutable Log',
        icon: '🛡️',
    },
];

export default function HrPayrollAttendance() {
    const [calcBasic, setCalcBasic] = useState<number>(30000);
    const [calcHra, setCalcHra] = useState<number>(12000);
    const [calcSpecial, setCalcSpecial] = useState<number>(8000);

    // Calculated Payroll
    const gross = calcBasic + calcHra + calcSpecial;
    const pfEmployee = Math.min(calcBasic, 15000) * 0.12;
    const esiEmployee = gross <= 21000 ? gross * 0.0075 : 0;
    const pt = 200; // Standard PT Maharashtra/Karnataka
    const totalDeductions = pfEmployee + esiEmployee + pt;
    const netSalary = gross - totalDeductions;

    return (
        <div id="hr-payroll" className="pt-16 pb-20 space-y-24">
            {/* ========================================================= */}
            {/* SECTION 15: HrStaffManagement                             */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
                        <span>COMPLETE EMPLOYEE HUB</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        From Onboarding to Asset Tagging
                    </h2>
                    <p className="mt-4 text-slate-600 text-base sm:text-lg">
                        Manage your entire workforce across stores, regional warehouses, and field teams.
                        Encrypted document vaults, company asset handovers, and branch role assignments.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mb-4">
                            📁
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Encrypted Document Vault</h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                            Store Aadhaar cards, PAN, driving licenses, bank passbooks, and signed offer letters in AWS S3 with bank-grade 256-bit encryption.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-4">
                            💻
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Company Asset Management</h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                            Tag and assign laptops, barcode scanners, SIM cards, and company two-wheelers with serial numbers and return-condition tracking.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
                            🏢
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Multi-Branch Shift Allocation</h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                            Assign morning, evening, or rotational shifts with grace periods (e.g. 15 min buffer) and auto-roster creation for 7-day retail stores.
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 16: AttendanceFeatures                            */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                            <span>4-WAY ATTENDANCE ENGINE</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Smart Geo-Fenced Punching With Zero Proxy Cheating
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Whether your team sits in an AC store or travels 50 km on field bikes, Nexus records attendance with tamper-proof coordinates and selfie proof.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ATTENDANCE_MODES.map((mode, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-3xl">{mode.icon}</span>
                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                                        {mode.badge}
                                    </span>
                                </div>
                                <h4 className="font-bold text-base text-slate-900">{mode.title}</h4>
                                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{mode.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Policy Banner */}
                    <div className="mt-8 p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">⏰ Automated Late Mark Rule:</span>
                            <span>3 Late arrivals (&gt;15 mins) = 0.5 Day Salary Deduction (Configurable)</span>
                        </div>
                        <span className="font-semibold text-indigo-700">Auto-calculated in monthly payroll</span>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 17: LeaveManagementSection                        */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                            <span>LEAVE &amp; HOLIDAYS</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            WhatsApp & Web Leave Approvals With 2-Tier Hierarchy
                        </h2>
                        <p className="text-slate-600 text-base leading-relaxed">
                            Employees apply for Paid Leave (PL), Casual Leave (CL), or Sick Leave (SL) in 5 seconds via WhatsApp.
                            Reporting managers get an instant interactive WhatsApp prompt with "Approve" and "Reject" buttons.
                        </p>

                        <div className="space-y-3 text-xs text-slate-700">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>Monthly Leave Quota Accrual (e.g. 1.5 PL per month worked)</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>Compensatory Off (Comp-off) for working on festival holidays</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>Live team calendar prevents whole store staff taking leave on Sunday</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl font-sans">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Balance Ledger</span>
                            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">FY 2026-27</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center mb-6">
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                                <div className="text-xl font-bold text-emerald-400">12.0</div>
                                <div className="text-[10px] text-slate-400 uppercase mt-0.5">Paid Leave (PL)</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                                <div className="text-xl font-bold text-blue-400">6.5</div>
                                <div className="text-[10px] text-slate-400 uppercase mt-0.5">Casual Leave (CL)</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                                <div className="text-xl font-bold text-purple-400">7.0</div>
                                <div className="text-[10px] text-slate-400 uppercase mt-0.5">Sick Leave (SL)</div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-2">
                            <div className="flex items-center justify-between text-slate-300">
                                <span>Recent Request: Amit Sharma (Store Cashier)</span>
                                <span className="text-amber-400 font-semibold">Pending Approval</span>
                            </div>
                            <p className="text-slate-400 text-[11px]">Reason: Family function in Jaipur (24 Sep to 26 Sep • 3 Days PL)</p>
                            <div className="flex gap-2 pt-1">
                                <button type="button" className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                                    Approve (WhatsApp)
                                </button>
                                <button type="button" className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-xs font-bold">
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 18: PayrollFeatures                               */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-900/40">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-4">
                            <span>1-CLICK SALARY DISBURSEMENT</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Interactive CTC & Indian Statutory Payslip Engine
                        </h2>
                        <p className="mt-3 text-slate-300 text-base">
                            Auto-calculates Provident Fund (EPF), ESIC, Professional Tax, and advances with instant WhatsApp PDF delivery to every employee.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Interactive CTC Inputs */}
                        <div className="lg:col-span-6 space-y-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
                            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                                Test Employee Salary Structure
                            </h4>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Basic Salary (₹)</label>
                                <input
                                    type="number"
                                    value={calcBasic}
                                    onChange={(e) => setCalcBasic(Number(e.target.value) || 0)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">House Rent Allowance - HRA (₹)</label>
                                <input
                                    type="number"
                                    value={calcHra}
                                    onChange={(e) => setCalcHra(Number(e.target.value) || 0)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Special / Performance Allowance (₹)</label>
                                <input
                                    type="number"
                                    value={calcSpecial}
                                    onChange={(e) => setCalcSpecial(Number(e.target.value) || 0)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-400"
                                />
                            </div>
                        </div>

                        {/* Net Salary & Payslip Breakdown Card */}
                        <div className="lg:col-span-6 bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                                <span className="font-bold text-sm text-slate-900">Monthly Net Salary Calculation</span>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                                    Statutory Compliant
                                </span>
                            </div>

                            <div className="space-y-2 text-xs font-mono">
                                <div className="flex justify-between text-slate-600">
                                    <span>Gross Monthly Earnings:</span>
                                    <span className="font-bold text-slate-900">₹{gross.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>- Employee PF (12% of Basic capped @ 15k):</span>
                                    <span>₹{pfEmployee.toLocaleString('en-IN')}</span>
                                </div>
                                {esiEmployee > 0 && (
                                    <div className="flex justify-between text-slate-500">
                                        <span>- Employee ESIC (0.75% of Gross):</span>
                                        <span>₹{esiEmployee.toFixed(0)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-500">
                                    <span>- Professional Tax (PT):</span>
                                    <span>₹{pt}</span>
                                </div>

                                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                    <div>
                                        <span className="text-slate-500 text-[11px] block">Net In-Hand Salary</span>
                                        <span className="text-xl font-extrabold text-emerald-600">
                                            ₹{netSalary.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                                    >
                                        Auto-Send PDF to WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
