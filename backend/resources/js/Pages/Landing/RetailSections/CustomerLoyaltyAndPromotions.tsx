import React, { useState } from 'react';
import { 
    Award, 
    Sparkles, 
    BookOpen, 
    Percent, 
    Gift, 
    Vault, 
    ReceiptText, 
    CheckCircle2, 
    AlertCircle, 
    MessageSquare, 
    Share2, 
    DollarSign, 
    CreditCard, 
    Clock, 
    ChevronRight,
    ArrowUpRight,
    Camera,
    ShieldAlert
} from 'lucide-react';

export const CustomerLoyaltyAndPromotions: React.FC = () => {
    // S-18: Loyalty Points Calculator
    const [billAmount, setBillAmount] = useState(3500);
    const [customerPoints, setCustomerPoints] = useState(480);
    const [redeemPoints, setRedeemPoints] = useState(250);

    const earnedPoints = Math.floor(billAmount / 100);
    const discountFromPoints = Math.min(redeemPoints, customerPoints);
    const finalPayable = Math.max(0, billAmount - discountFromPoints);

    // S-19: Customer Khata Ledger
    const [khataCustomer, setKhataCustomer] = useState({
        name: 'Dr. Ramesh Sharma',
        mobile: '+91 98201 44821',
        creditLimit: 15000,
        outstanding: 6850,
        lastPayment: '₹3,000 on 10-Sep-2025',
    });
    const [reminderSent, setReminderSent] = useState(false);

    // S-22: Shift Cash Drawer Reconciliation state
    const [openingFloat, setOpeningFloat] = useState(2000);
    const [cashSales, setCashSales] = useState(34250);
    const [cashExpenses, setCashExpenses] = useState(650);
    const [actualCountedCash, setActualCountedCash] = useState(35600);

    const expectedCash = openingFloat + cashSales - cashExpenses;
    const cashVariance = actualCountedCash - expectedCash;

    const handleSendReminder = () => {
        setReminderSent(true);
        setTimeout(() => setReminderSent(false), 3500);
    };

    return (
        <div className="bg-white">
            {/* S-18: Loyalty Program & Tiered Rewards */}
            <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 rounded-full border border-amber-200">
                            REWARD POINTS ENGINE
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Built-in Customer Loyalty &amp; VIP Tier System
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Keep shoppers coming back to your store instead of quick-commerce apps. Reward frequent visits with automated points, birthday bonuses, and VIP cashback redemption.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Mobile Number-Based Loyalty</h3>
                                        <p className="text-xs text-slate-500">Zero plastic card hassle</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Cashier asks for customer 10-digit mobile during checkout. Loyalty profile, tier badge, and available points appear instantly on the POS counter screen.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">3-Tier Milestone Progression</h3>
                                        <p className="text-xs text-slate-500">Silver &rarr; Gold &rarr; Platinum tiers</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Auto-promote loyal patrons based on annual spend. Platinum members earn 2x points on weekends and receive exclusive preview invitations for festive sales.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">WhatsApp Balance Summary</h3>
                                        <p className="text-xs text-slate-500">Sent automatically along with digital bill</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Every WhatsApp receipt displays "You earned 35 pts today! Total balance: 480 pts (Value ₹480)".
                                </p>
                            </div>
                        </div>

                        {/* Interactive Loyalty Calculator */}
                        <div className="lg:col-span-7">
                            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">POS Counter Loyalty Simulator</span>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/20 rounded-lg text-amber-300 border border-amber-500/30">
                                        Member: Platinum Tier
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-300 mb-2">
                                            <span>Current Counter Basket Value:</span>
                                            <span className="font-bold text-white font-mono text-sm">₹{billAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="500" 
                                            max="10000" 
                                            step="250"
                                            value={billAmount}
                                            onChange={(e) => setBillAmount(Number(e.target.value))}
                                            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                            <div className="text-xs text-slate-400">Available Points Balance</div>
                                            <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{customerPoints} Pts</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">Worth ₹{customerPoints} store credit</div>
                                        </div>

                                        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                            <div className="text-xs text-slate-400">Points Earned This Order</div>
                                            <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">+{earnedPoints} Pts</div>
                                            <div className="text-[11px] text-emerald-400/80 mt-0.5">1 pt per ₹100 spent</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
                                        <div className="flex justify-between text-xs text-slate-300 mb-2">
                                            <span>Redeem Points Against This Bill:</span>
                                            <span className="font-bold text-amber-400 font-mono">{discountFromPoints} Pts (Save ₹{discountFromPoints})</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max={customerPoints} 
                                            step="50"
                                            value={redeemPoints}
                                            onChange={(e) => setRedeemPoints(Number(e.target.value))}
                                            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                                        />
                                    </div>

                                    {/* Billing Summary Box */}
                                    <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2 text-xs">
                                        <div className="flex justify-between text-slate-400">
                                            <span>Original Bill Subtotal:</span>
                                            <span className="text-slate-200 font-mono">₹{billAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-emerald-400 font-semibold">
                                            <span>Loyalty Points Discount:</span>
                                            <span className="font-mono">- ₹{discountFromPoints}</span>
                                        </div>
                                        <div className="border-t border-slate-700 pt-2 flex justify-between items-center text-sm font-bold">
                                            <span className="text-white">Net Cashier Tender:</span>
                                            <span className="text-xl font-mono text-emerald-400">₹{finalPayable.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-19: Digital Store Khata & Credit Ledger */}
            <section className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 rounded-full border border-emerald-200">
                            DIGITAL STORE KHATA
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Replace Paper Bahi-Khata with Digital Credit Control
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Provide trusted neighborhood patrons with credit while safeguarding your cash flow. Set hard credit limits, track 30-day payment aging, and send 1-click WhatsApp UPI payment links.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Interactive Khata Preview */}
                        <div className="lg:col-span-7">
                            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                    <div>
                                        <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Customer Khata Profile</span>
                                        <h3 className="text-lg font-bold text-white mt-1">{khataCustomer.name}</h3>
                                        <p className="text-xs text-slate-400">{khataCustomer.mobile}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-800">
                                        Regular Patron
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                        <div className="text-xs text-slate-400">Total Credit Limit</div>
                                        <div className="text-lg font-bold text-white font-mono mt-1">₹{khataCustomer.creditLimit.toLocaleString('en-IN')}</div>
                                    </div>
                                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                        <div className="text-xs text-slate-400">Current Outstanding</div>
                                        <div className="text-lg font-bold text-rose-400 font-mono mt-1">₹{khataCustomer.outstanding.toLocaleString('en-IN')}</div>
                                    </div>
                                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                        <div className="text-xs text-slate-400">Available Headroom</div>
                                        <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                                            ₹{(khataCustomer.creditLimit - khataCustomer.outstanding).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 mb-6 text-xs space-y-2">
                                    <div className="flex justify-between text-slate-300">
                                        <span>Last Repayment Recorded:</span>
                                        <span className="font-semibold text-emerald-400">{khataCustomer.lastPayment}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Payment Terms:</span>
                                        <span className="font-semibold text-slate-200">15-Day Rolling Settlement</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Overdue Status:</span>
                                        <span className="font-semibold text-amber-400">7 Days Past Due</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button 
                                        onClick={handleSendReminder}
                                        className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Send WhatsApp UPI Payment Link (₹{khataCustomer.outstanding})
                                    </button>
                                    <button className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition">
                                        Receive Cash / Cheque
                                    </button>
                                </div>

                                {reminderSent && (
                                    <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>WhatsApp reminder dispatched with embedded UPI QR link (GPay, PhonePe, Paytm).</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                                        <ShieldAlert className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Hard Credit Limit Locks</h3>
                                        <p className="text-xs text-slate-500">Prevent cashier favoritism</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    If a customer's outstanding exceeds their preset credit limit (e.g. ₹15,000), the POS counter automatically locks khata billing until the manager enters an override PIN.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Instant Dynamic UPI QR Link</h3>
                                        <p className="text-xs text-slate-500">Zero-fee payments straight to current account</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Customers click the WhatsApp link to open PhonePe or Google Pay with your exact outstanding balance pre-filled. Payment syncs back automatically.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Automated Aging Statement</h3>
                                        <p className="text-xs text-slate-500">0-15 days, 16-30 days, 30+ days overdue</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Export monthly khata ledger PDFs for any customer with running balances and individual transaction item details.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-20 & S-21: Promotions, Combos & Gift Vouchers */}
            <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 rounded-full border border-purple-200">
                            SMART PROMOTION ENGINE
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Run BOGO, Combos &amp; Festive Coupon Campaigns
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Cashiers don't need calculators. The Nexus promo engine evaluates cart contents in real time and automatically applies complex retail discounts at lightning speed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Promo 1 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
                                <Percent className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">BOGO &amp; Multi-Buy</h3>
                            <p className="text-xs text-purple-600 font-semibold mt-1">Buy 2 Get 1 Free / Buy 3 for ₹999</p>
                            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                Automatically marks the lowest-priced qualifying item as ₹0.00 without cashier intervention.
                            </p>
                        </div>

                        {/* Promo 2 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">Cross-Category Combos</h3>
                            <p className="text-xs text-blue-600 font-semibold mt-1">Toothpaste + Brush combo at ₹149</p>
                            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                Pair high-margin accessories with staple items. Discount applies only when both SKUs are scanned in cart.
                            </p>
                        </div>

                        {/* Promo 3 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">Happy Hour Dynamic Pricing</h3>
                            <p className="text-xs text-amber-600 font-semibold mt-1">2:00 PM - 5:00 PM Slow Hours</p>
                            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                Boost afternoon footfall with scheduled timed discounts that activate and deactivate like clockwork.
                            </p>
                        </div>

                        {/* Promo 4 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 mb-4">
                                <Gift className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">Gift Vouchers &amp; Coupons</h3>
                            <p className="text-xs text-rose-600 font-semibold mt-1">DIWALI500 Single-Use Codes</p>
                            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                Alphanumeric voucher codes with minimum bill thresholds and automated multi-use prevention.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-22 & S-23: Cash Drawer Reconciliation & Petty Cash */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100/80 rounded-full border border-rose-200">
                            CASH RECONCILIATION
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Shift Cash Drawer Reconciliation &amp; Petty Expenses
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Prevent cashier leakage. Reconcile opening float, cash sales, paid-out expenses, and physical cash counting at the end of every cashier shift.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Interactive Reconciliation Simulator */}
                        <div className="lg:col-span-7">
                            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Vault className="w-5 h-5 text-rose-400" />
                                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                                            Shift Handover: Counter #02 (Cashier: Priya K.)
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
                                        Shift: 09:00 AM - 05:00 PM
                                    </span>
                                </div>

                                <div className="space-y-4 text-xs font-mono">
                                    <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-xl">
                                        <span className="text-slate-400">Opening Cash Float:</span>
                                        <span className="text-white font-bold">₹{openingFloat.toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-xl">
                                        <span className="text-slate-400">(+) Total Cash Inflow (Billed):</span>
                                        <span className="text-emerald-400 font-bold">+ ₹{cashSales.toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-xl">
                                        <span className="text-slate-400">(-) Approved Petty Cash Out:</span>
                                        <span className="text-rose-400 font-bold">- ₹{cashExpenses.toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-800 p-3 rounded-xl border border-slate-700 font-bold">
                                        <span className="text-slate-200">(=) Expected Cash in Till:</span>
                                        <span className="text-white text-sm">₹{expectedCash.toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="pt-2">
                                        <label className="block text-xs font-sans font-semibold text-slate-300 mb-2">
                                            Physical Cash Counted at Drawer Handover (Denominations: ₹500, ₹200, ₹100, ₹50):
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="number"
                                                value={actualCountedCash}
                                                onChange={(e) => setActualCountedCash(Number(e.target.value))}
                                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm font-bold font-mono focus:outline-none focus:border-rose-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Variance Alert */}
                                    <div className={`p-4 rounded-xl border flex items-center justify-between ${
                                        cashVariance === 0
                                            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                                            : cashVariance < 0
                                            ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                                            : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            {cashVariance === 0 ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                            )}
                                            <div>
                                                <div className="font-bold text-xs font-sans">
                                                    {cashVariance === 0
                                                        ? 'Perfect Cash Reconciliation'
                                                        : cashVariance < 0
                                                        ? `Cash Shortage Flagged (- ₹${Math.abs(cashVariance)})`
                                                        : `Cash Excess Detected (+ ₹${cashVariance})`}
                                                </div>
                                                <div className="text-[11px] opacity-80 font-sans mt-0.5">
                                                    {cashVariance === 0 
                                                        ? 'Ready for safe deposit transfer.' 
                                                        : 'Supervisor OTP required to close shift.'}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-mono font-bold text-sm">
                                            {cashVariance >= 0 ? `+ ₹${cashVariance}` : `- ₹${Math.abs(cashVariance)}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* S-23: Petty Cash Info */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
                                        <ReceiptText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Camera Receipt Voucher Upload</h3>
                                        <p className="text-xs text-slate-500">Tea, delivery fuel, housekeeping supplies</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Cashiers take a phone photo of the paper receipt before taking ₹200 for store milk or broom purchase. Vouchers are tagged to the day's P&amp;L automatically.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Manager Shift Sign-Off</h3>
                                        <p className="text-xs text-slate-500">Dual verification protocol</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Drawer handovers lock cashier credentials. Next shift cashier opens with new floating balance, creating an unbroken chain of financial accountability.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Card &amp; UPI Machine Settlement (EDC)</h3>
                                        <p className="text-xs text-slate-500">Pine Labs, Paytm Soundbox, Mosambee</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Match physical POS card swipe batch totals against EDC machine settlement slips with 1-click batch verification.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
