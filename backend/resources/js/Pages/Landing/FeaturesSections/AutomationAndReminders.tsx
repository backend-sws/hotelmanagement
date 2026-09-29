import { useState } from 'react';

const REMINDER_STAGES = [
    {
        stage: 'Stage 1',
        timing: '3 Days Before Due Date',
        type: 'Friendly Courtesy Notice',
        badge: 'Gentle Reminder',
        message: 'Dear Customer, your invoice #INV-1092 of ₹14,500 is due on 21 Sep. Click here to preview PDF or pay via UPI: https://pay.nexus.in/xY82',
        status: 'Sent via WhatsApp & SMS',
        color: 'border-blue-200 bg-blue-50/40 text-blue-900',
    },
    {
        stage: 'Stage 2',
        timing: 'On Due Date (10:00 AM)',
        type: 'Payment Due Today',
        badge: 'Due Notice',
        message: 'Namaste! Invoice #INV-1092 of ₹14,500 is due today. Please tap to clear outstanding with 1-click GPay / PhonePe / Netbanking.',
        status: 'UPI Pay Link Active',
        color: 'border-indigo-200 bg-indigo-50/40 text-indigo-900',
    },
    {
        stage: 'Stage 3',
        timing: '7 Days Overdue',
        type: 'Formal Overdue Alert',
        badge: 'Follow-Up',
        message: 'Attention: Invoice #INV-1092 is 7 days past due date. To avoid disruption in credit terms or order dispatch, please settle ₹14,500 today.',
        status: 'Manager CC Alert',
        color: 'border-amber-200 bg-amber-50/40 text-amber-900',
    },
    {
        stage: 'Stage 4',
        timing: '15 Days Overdue',
        type: 'Escalation & Account Hold',
        badge: 'Account Freeze Alert',
        message: 'Final Notice: Outstanding ₹14,500 is overdue by 15 days. Further sales orders will be held on credit lock. PDF statement attached.',
        status: 'Auto Credit Lock Active',
        color: 'border-rose-200 bg-rose-50/40 text-rose-900',
    },
];

export default function AutomationAndReminders() {
    const [selectedStage, setSelectedStage] = useState(0);

    return (
        <div id="automation" className="pt-16 pb-20 space-y-24 bg-slate-50/60 border-y border-slate-200">
            {/* ========================================================= */}
            {/* SECTION 7: WhatsAppAutoDispatch                           */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                            <span>ZERO-CLICK DISPATCH</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Instant WhatsApp PDF Invoicing with Built-in UPI Pay
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                            Never print, fold, or post paper invoices again. The exact second a cashier or billing clerk saves a bill,
                            Nexus generates an encrypted PDF and dispatches it through the official Meta Cloud API with a 1-tap UPI payment button.
                        </p>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                    ✓
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Official Meta Verified WhatsApp Business API</h4>
                                    <p className="text-xs text-slate-600 mt-0.5">
                                        Dispatched from your registered business number with green tick badge compatibility. Zero risk of SIM blockage.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                    ✓
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Embedded Dynamic UPI QR & Pay Button</h4>
                                    <p className="text-xs text-slate-600 mt-0.5">
                                        Clients tap the WhatsApp button and their PhonePe, Google Pay, or Paytm opens with exact bill amount pre-filled.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                    ✓
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Real-Time Delivery & Read Receipts</h4>
                                    <p className="text-xs text-slate-600 mt-0.5">
                                        Track single-tick (sent), double-tick (delivered), and blue-tick (read) statuses right in your sales register.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Chat Interactive Mockup Frame */}
                    <div className="lg:col-span-6 flex justify-center">
                        <div className="w-full max-w-md bg-[#0b141a] rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-800 relative">
                            {/* Device camera notch */}
                            <div className="w-32 h-5 bg-slate-900 rounded-full mx-auto mb-3" />

                            {/* WhatsApp Header */}
                            <div className="flex items-center gap-3 bg-[#202c33] p-3 rounded-2xl text-white mb-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                                    NB
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm flex items-center gap-1">
                                        Nexus Billing Official
                                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-[9px] flex items-center justify-center">
                                            ✓
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-emerald-400">Verified Business Account</div>
                                </div>
                            </div>

                            {/* WhatsApp Chat Body */}
                            <div className="space-y-3 font-sans text-xs">
                                <div className="bg-[#1f2c34] text-slate-200 p-3.5 rounded-2xl rounded-tl-none border border-slate-700/50 shadow-sm max-w-[90%] space-y-2">
                                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-700 pb-1.5">
                                        <span className="font-semibold text-white">Invoice #INV-2026-0842</span>
                                        <span>₹23,600.00</span>
                                    </div>
                                    <p className="text-slate-300 text-[11px] leading-relaxed">
                                        Dear Customer, thank you for your order with Acme Enterprises. Your GST Tax Invoice is ready.
                                    </p>

                                    {/* PDF Attachment Card */}
                                    <div className="flex items-center gap-3 bg-[#111b21] p-2 rounded-xl border border-slate-800">
                                        <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                                            PDF
                                        </div>
                                        <div className="flex-1 truncate">
                                            <div className="font-semibold text-white truncate text-[11px]">Invoice_INV_0842.pdf</div>
                                            <div className="text-[9px] text-slate-400">142 KB • Digitally Signed IRN</div>
                                        </div>
                                    </div>

                                    {/* Action buttons inside WhatsApp message */}
                                    <div className="space-y-1.5 pt-1">
                                        <div className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center rounded-xl text-[11px] flex items-center justify-center gap-1.5 cursor-pointer">
                                            <span>💳 Pay ₹23,600 via UPI (GPay/PhonePe)</span>
                                        </div>
                                        <div className="w-full py-1.5 bg-[#202c33] text-slate-300 font-semibold text-center rounded-xl text-[10px] border border-slate-700">
                                            📄 View Full Statement
                                        </div>
                                    </div>

                                    <div className="text-right text-[9px] text-slate-400 flex items-center justify-end gap-1">
                                        <span>10:14 AM</span>
                                        <span className="text-blue-400 font-bold">✓✓</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 8: PaymentReminderSequence                        */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
                        <span>CASHFLOW ACCELERATOR</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Automated 4-Stage Payment Recovery Sequence
                    </h2>
                    <p className="mt-3 text-slate-600 text-base">
                        Reduce your collection cycle from 42 days to 14 days. Nexus automatically follows up across WhatsApp, SMS,
                        and Email with zero manual nagging from your staff.
                    </p>
                </div>

                {/* Stage selector bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {REMINDER_STAGES.map((s, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedStage(idx)}
                            className={`p-4 rounded-2xl border text-left transition-all ${
                                selectedStage === idx
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                                    : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                            }`}
                        >
                            <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">{s.stage}</div>
                            <div className="font-bold text-sm mt-0.5">{s.timing}</div>
                            <div
                                className={`text-[10px] mt-2 inline-block px-2 py-0.5 rounded-full font-semibold ${
                                    selectedStage === idx ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                                {s.badge}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Active Stage Detail Display */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-7 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold font-mono">
                                    {REMINDER_STAGES[selectedStage].stage}: {REMINDER_STAGES[selectedStage].timing}
                                </span>
                                <span className="text-xs font-semibold text-emerald-600">
                                    ✓ {REMINDER_STAGES[selectedStage].status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900">
                                {REMINDER_STAGES[selectedStage].type}
                            </h3>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Triggered WhatsApp Template:</span>
                                "{REMINDER_STAGES[selectedStage].message}"
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Channel</span>
                                    <span className="font-bold text-slate-800">WhatsApp + SMS + Email</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Payment Gateway</span>
                                    <span className="font-bold text-slate-800">Direct Bank UPI (Zero Fee)</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-5 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 text-center">
                            <div className="text-4xl font-extrabold text-indigo-700">91.4%</div>
                            <div className="text-sm font-bold text-slate-800 mt-1">Recovery Success Rate</div>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                Over 9 out of 10 overdue payments are cleared by Stage 2 without human intervention, saving hours of manual billing follow-up.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 9: MultiCompanyBilling                            */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-4">
                            <span>MULTI-GSTIN ARCHITECTURE</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Run 50+ Branches & Multiple GSTINs From One Single Login
                        </h2>
                        <p className="mt-3 text-slate-600 text-base sm:text-lg">
                            Operating multiple businesses, sister entities, or regional retail branches? Switch companies with 1 click
                            while keeping ledgers, inventory, and staff roles strictly isolated.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base mb-4">
                                🏢
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Separate Series & Bank Accounts</h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                Each branch maintains independent invoice numbering series (e.g. MUM/26/001, DEL/26/001), distinct bank UPI handles, and state GSTIN credentials.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base mb-4">
                                🔄
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Inter-Entity Transfer Invoicing</h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                Selling goods between company A and company B? Nexus generates the sales invoice in entity A and automatically posts the matching purchase voucher in entity B.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base mb-4">
                                📊
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Consolidated Business Health</h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                Get group-level consolidated P&L, balance sheets, and total debtor outstanding without manual Excel spreadsheets or VLOOKUPs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
