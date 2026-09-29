import React, { useState } from 'react';

export default function InteractiveCommerceAndCatalog() {
    // S-11 State: Interactive In-Chat WhatsApp Commerce Simulator
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Aashirvaad Shudh Chakki Atta 10kg', price: 440, qty: 1, icon: '🌾' },
        { id: 2, name: 'Fortune Sunlite Refined Sunflower Oil 5L', price: 680, qty: 1, icon: '🌻' },
        { id: 3, name: 'Tata Salt Vacuum Evaporated 1kg', price: 28, qty: 2, icon: '🧂' }
    ]);
    const [simulatedStep, setSimulatedStep] = useState<1 | 2 | 3 | 4>(1);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const gstAmount = Math.round(subtotal * 0.05); // 5% GST on grocery
    const totalOrderValue = subtotal + gstAmount;

    const handleNextStep = () => {
        if (simulatedStep < 4) {
            setSimulatedStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
        } else {
            setSimulatedStep(1);
        }
    };

    return (
        <section id="in-chat-commerce" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
                        Conversational Storefront
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        In-Chat WhatsApp Catalogs &amp; 1-Tap Cart Ordering
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Turn your 500 million Indian WhatsApp users into paying customers. Allow buyers to browse product photos, choose pack variants, and pay via dynamic UPI without installing any mobile app.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-06 & S-11: In-Chat Product Catalog Engine & Interactive Web Simulator   */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
                    
                    {/* Left: Interactive WhatsApp Shopping Simulator (S-11) */}
                    <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Customer Journey</span>
                            </div>
                            <span className="text-xs font-mono text-slate-400">Step {simulatedStep} of 4</span>
                        </div>

                        {/* Step-by-Step Simulated Flow */}
                        <div className="mt-6 space-y-3 min-h-[280px]">
                            {simulatedStep === 1 && (
                                <div className="space-y-2">
                                    <div className="p-3 bg-slate-900 rounded-2xl border border-white/10 text-xs">
                                        <div className="text-slate-400 text-[10px] uppercase font-bold">Catalog Received via WhatsApp</div>
                                        <div className="text-white font-bold text-sm mt-1">🛒 Shree Ganesh Supermarket Catalog</div>
                                        <p className="text-slate-300 text-[11px] mt-1">Tap below to browse over 1,200 fresh groceries, dairy, and daily essentials.</p>
                                    </div>
                                    <div className="space-y-1.5 pt-2">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span>{item.icon}</span>
                                                    <span className="font-medium text-slate-200">{item.name}</span>
                                                </div>
                                                <span className="font-mono text-emerald-400 font-bold">₹{item.price * item.qty}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {simulatedStep === 2 && (
                                <div className="space-y-3">
                                    <div className="p-3.5 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-xs">
                                        <div className="text-emerald-400 font-bold">Customer Sent In-Chat Cart (3 Items)</div>
                                        <div className="text-slate-300 text-[11px] mt-1">Delivery Address: Flat 402, Green Glen Layout, Bengaluru</div>
                                    </div>
                                    <div className="bg-slate-900 p-3 rounded-xl border border-white/5 space-y-1 text-xs font-mono">
                                        <div className="flex justify-between text-slate-400"><span>Cart Subtotal:</span><span>₹{subtotal}</span></div>
                                        <div className="flex justify-between text-slate-400"><span>5% GST:</span><span>₹{gstAmount}</span></div>
                                        <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-white/10">
                                            <span>Order Total:</span><span className="text-emerald-400">₹{totalOrderValue}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {simulatedStep === 3 && (
                                <div className="space-y-3">
                                    <div className="p-3.5 bg-slate-900 rounded-2xl border border-white/10 text-xs space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-white">Invoice #INV-8410 Generated</span>
                                            <span className="text-emerald-400 font-bold font-mono">₹{totalOrderValue}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-300">
                                            Pay in 1-tap using your favorite UPI app:
                                        </p>
                                        <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs text-center shadow-md flex items-center justify-center gap-2">
                                            <span>⚡ Pay ₹{totalOrderValue} with Google Pay / PhonePe</span>
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-slate-400 text-center">
                                        Dynamic UPI Deep-link automatically verifies bank credit
                                    </div>
                                </div>
                            )}

                            {simulatedStep === 4 && (
                                <div className="space-y-3">
                                    <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 text-xs text-center space-y-2">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg mx-auto">
                                            ✓
                                        </div>
                                        <div className="text-sm font-black text-white">Payment Received! (UPI UTR: 491028491)</div>
                                        <p className="text-slate-300 text-[11px]">
                                            Digital GST Invoice PDF attached. Packed &amp; dispatched from Indira Nagar Hub.
                                        </p>
                                        <div className="pt-2 text-[11px] font-mono text-emerald-300 font-bold">
                                            📄 Tax_Invoice_INV8410.pdf (Auto-Sent)
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Simulator Action Trigger */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2"
                            >
                                {simulatedStep === 1 && 'Simulate: Send Cart to Store →'}
                                {simulatedStep === 2 && 'Simulate: Generate 1-Tap UPI Bill →'}
                                {simulatedStep === 3 && 'Simulate: Confirm Payment via Bank Webhook →'}
                                {simulatedStep === 4 && 'Reset Simulator Flow ↺'}
                            </button>
                        </div>
                    </div>

                    {/* Right: In-Chat Commerce Feature Set (S-06 & S-07) */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                                Zero-Friction Sales
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                Native WhatsApp Catalog &amp; 1-Tap Checkout
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Unlike clunky external web links that lose 60% of mobile buyers during browser load, Nexus keeps the customer 100% inside WhatsApp from product discovery to invoice settlement.
                            </p>

                            <div className="mt-6 space-y-3.5">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Live Inventory Sync</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Products marked out-of-stock in your Nexus ERP automatically hide from the WhatsApp catalog in real time.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Custom B2B &amp; B2C Price Lists</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Wholesale distributors can assign custom tiered rate cards so registered retailers see their confidential dealer pricing.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Automated Address &amp; Delivery Pin</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Customers can simply drop their live WhatsApp location pin for accurate delivery routing by your dispatch drivers.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-08 to S-10: Khata Lookup, Cart Recovery & Auto-Reorder Triggers         */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* S-08: Khata Ledger Lookup */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Instant Customer Khata Lookup
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Customers type "Balance" or "Khata" to receive their statement PDF with open invoices, payments credited, and a 1-tap UPI payment link.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                            <span>Zero Accounting Queries</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-09: Abandon Cart Recovery */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Automated Cart Recovery Bot
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Trigger automated polite reminders 30 minutes after abandoned carts with dynamic discounts. Recovers 24% of lost sales on WhatsApp.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
                            <span>+24% Order Recovery</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-10: Predictive Reorder Triggers */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Predictive Reorder Triggers
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            AI estimates when a customer's cooking oil, pet food, or RO filter needs replenishment, sending a timely 1-tap re-order button.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                            <span>High Customer LTV</span>
                            <span>→</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
