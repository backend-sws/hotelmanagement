import React, { useState } from 'react';

export default function PaymentDunningAndRecovery() {
    // S-17 State: Interactive DSO (Days Sales Outstanding) & Cashflow Recovery Calculator
    const [monthlyCreditTurnover, setMonthlyCreditTurnover] = useState(3500000); // ₹35 Lakhs monthly credit sales
    const [currentDsoDays, setCurrentDsoDays] = useState(45); // 45 days typical Indian credit cycle
    const [workingCapitalInterestRate, setWorkingCapitalInterestRate] = useState(12.0); // 12% CC/OD interest rate

    // Automated WhatsApp UPI dunning typically cuts DSO down to 18 days
    const optimizedDsoDays = 18;
    const daysSaved = currentDsoDays - optimizedDsoDays;
    const dailySales = monthlyCreditTurnover / 30;
    const workingCapitalReleased = Math.round(dailySales * daysSaved);
    const annualInterestSaved = Math.round(workingCapitalReleased * (workingCapitalInterestRate / 100));

    // S-12 State: Active Dunning Stage Preview
    const [activeDunningStage, setActiveDunningStage] = useState<'pre_due' | 'due_date' | 'overdue_7' | 'overdue_15'>('pre_due');

    const dunningTemplates = {
        pre_due: {
            title: 'T-3 Days: Polite Courtesy Reminder',
            tone: 'Courteous & Helpful',
            badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
            message: 'Hello Rajesh Enterprises, your invoice #INV-4910 for ₹34,200 is due in 3 days (21-Feb). Early payment discount of 2% (Save ₹684) is valid until tomorrow! Tap below to clear with UPI.',
            buttonText: 'Pay ₹33,516 with 2% Early Discount'
        },
        due_date: {
            title: 'Due Date: Instant 1-Tap UPI Alert',
            tone: 'Direct & Actionable',
            badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            message: 'Dear Customer, invoice #INV-4910 for ₹34,200 is due today. Please tap the button below to settle instantly via GPay, PhonePe, or Paytm with zero transaction fees.',
            buttonText: 'Pay ₹34,200 via 1-Tap UPI'
        },
        overdue_7: {
            title: 'T+7 Days: Grace Period Follow-Up',
            tone: 'Firm & Professional',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            message: 'Notice: Invoice #INV-4910 is overdue by 7 days. To prevent automatic credit hold on upcoming wholesale dispatches, please settle your outstanding balance today.',
            buttonText: 'Clear Pending ₹34,200'
        },
        overdue_15: {
            title: 'T+15 Days: Formal Ledger Escalation',
            tone: 'Legal & Interest Warning',
            badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
            message: 'Urgent: Invoice #INV-4910 has exceeded our 15-day credit terms. As per company policy, 18% p.a. penal interest will be applied starting tomorrow. Kindly arrange payment immediately.',
            buttonText: 'Emergency UPI Settlement'
        }
    };

    return (
        <section id="payment-dunning" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/60">
                        Cash Flow Acceleration
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Automated WhatsApp Payment Dunning &amp; 1-Tap UPI Links
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Stop burning staff hours on awkward debt collection calls. Nexus triggers automated polite reminders with pre-filled GPay/PhonePe links, cutting your DSO by over 50%.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-12 & S-13: Smart Dunning Escalation Schedule & Dynamic UPI Deep-Links   */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
                    
                    {/* Left: Smart Dunning Stage Simulator (S-12) */}
                    <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Multi-Tier Escalation</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Smart Payment Dunning Radar
                                </h3>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                Zero Calling Required
                            </span>
                        </div>

                        {/* Stage Selector Tabs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
                            {(['pre_due', 'due_date', 'overdue_7', 'overdue_15'] as const).map((stage) => (
                                <button
                                    key={stage}
                                    type="button"
                                    onClick={() => setActiveDunningStage(stage)}
                                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition text-center border ${
                                        activeDunningStage === stage
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    {stage === 'pre_due' && 'T-3 Days'}
                                    {stage === 'due_date' && 'Due Date'}
                                    {stage === 'overdue_7' && 'T+7 Days'}
                                    {stage === 'overdue_15' && 'T+15 Days'}
                                </button>
                            ))}
                        </div>

                        {/* Active Simulated WhatsApp Dunning Message */}
                        <div className="mt-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-bold text-slate-900">
                                    {dunningTemplates[activeDunningStage].title}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${dunningTemplates[activeDunningStage].badgeColor}`}>
                                    {dunningTemplates[activeDunningStage].tone}
                                </span>
                            </div>

                            <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs leading-relaxed space-y-2">
                                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 border-b border-white/10">
                                    <span>To: Rajesh Enterprises (+91 98200 XXXXX)</span>
                                    <span className="text-emerald-400 font-mono">Status: Delivered ✓✓</span>
                                </div>
                                <p className="text-slate-200 text-[11px]">
                                    {dunningTemplates[activeDunningStage].message}
                                </p>
                            </div>

                            {/* Dynamic 1-Tap UPI Intent Button */}
                            <div className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl text-center shadow-xs cursor-pointer flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {dunningTemplates[activeDunningStage].buttonText}
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span>Auto-pauses reminders the instant bank webhook confirms payment</span>
                            <span className="font-bold text-indigo-600">Zero Harassment</span>
                        </div>
                    </div>

                    {/* Right: Technical Features (S-13 & S-14) */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300">
                                Instant Bank Clearance
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                Dynamic UPI Intent &amp; Real-Time Reconciliation
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Never ask clients to screenshot payment UTRs again. Nexus builds native UPI deep-links that link bank settlement directly to your ERP invoices.
                            </p>

                            <div className="mt-6 space-y-3.5 text-xs">
                                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                                        ⚡
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Zero App-Switching Hassle</div>
                                        <div className="text-slate-500 mt-0.5">Customer taps the button; phone natively launches GPay/PhonePe with the exact paise amount pre-filled.</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                                        ⏱️
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">1.2-Second Bank Webhook Reconciliation</div>
                                        <div className="text-slate-500 mt-0.5">Bank sends a secure webhook to Nexus, marking the invoice paid, updating customer khata, and sending a digital receipt.</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                                        💰
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Early Bird Cash Discount Automation</div>
                                        <div className="text-slate-500 mt-0.5">Auto-calculate 1% or 2% prompt settlement discounts if paid within 24 hours, boosting working capital.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-17: Interactive DSO Reduction & Working Capital ROI Calculator          */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Working Capital Calculator</span>
                            <h3 className="text-2xl font-black text-white mt-1">
                                Calculate Your Days Sales Outstanding (DSO) Savings
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                See how many lakhs of trapped working capital Nexus releases from overdue market receivables.
                            </p>
                        </div>
                        <div className="bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 text-xs font-mono text-emerald-300">
                            Cashflow Boost
                        </div>
                    </div>

                    {/* Sliders Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Monthly Credit Sales</span>
                                <span className="text-emerald-400 font-mono">₹{(monthlyCreditTurnover / 100000).toFixed(1)} Lakhs</span>
                            </div>
                            <input
                                type="range"
                                min="500000"
                                max="15000000"
                                step="500000"
                                value={monthlyCreditTurnover}
                                onChange={(e) => setMonthlyCreditTurnover(parseInt(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>₹5L</span>
                                <span>₹75L</span>
                                <span>₹1.5 Cr</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Current Collection Cycle (DSO)</span>
                                <span className="text-amber-400 font-mono">{currentDsoDays} Days</span>
                            </div>
                            <input
                                type="range"
                                min="25"
                                max="90"
                                value={currentDsoDays}
                                onChange={(e) => setCurrentDsoDays(parseInt(e.target.value))}
                                className="w-full accent-amber-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>25 Days</span>
                                <span>55 Days</span>
                                <span>90 Days</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Bank OD/CC Interest Rate</span>
                                <span className="text-blue-400 font-mono">{workingCapitalInterestRate}% p.a.</span>
                            </div>
                            <input
                                type="range"
                                min="8.0"
                                max="16.0"
                                step="0.5"
                                value={workingCapitalInterestRate}
                                onChange={(e) => setWorkingCapitalInterestRate(parseFloat(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>8%</span>
                                <span>12%</span>
                                <span>16%</span>
                            </div>
                        </div>
                    </div>

                    {/* Calculated Output Display */}
                    <div className="mt-8 bg-slate-950/70 rounded-2xl p-6 border border-white/5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-x-0 sm:divide-x divide-white/10">
                            <div>
                                <div className="text-xs text-slate-400 font-medium">DSO Reduction</div>
                                <div className="text-2xl font-black text-amber-400 mt-1">{currentDsoDays}d → 18d (-{daysSaved} Days)</div>
                                <div className="text-[10px] text-slate-400">Faster cash turnaround</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium">Working Capital Released</div>
                                <div className="text-2xl font-black text-emerald-400 mt-1">₹{workingCapitalReleased.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-400">Immediate liquidity in bank</div>
                            </div>
                            <div className="pl-2">
                                <div className="text-xs text-blue-300 font-bold">Annual OD Interest Saved</div>
                                <div className="text-3xl font-black text-blue-400 mt-0.5">
                                    ₹{annualInterestSaved.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-blue-300/80">Direct bottom-line profit</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
