import React, { useState } from 'react';

export default function BroadcastMarketingAndMetaPricing() {
    // S-24 State: Interactive Meta Conversation Cost Estimator
    const [utilityCount, setUtilityCount] = useState(4500); // 4,500 order/payment utility messages
    const [marketingCount, setMarketingCount] = useState(8000); // 8,000 promo broadcast messages
    const [serviceCount, setServiceCount] = useState(1200); // 1,200 support resolution conversations

    // Official Meta India Conversation Rates
    const utilityRate = 0.35; // ₹0.35/utility conversation
    const marketingRate = 0.85; // ₹0.85/marketing conversation
    const serviceRate = 0.30; // ₹0.30/service conversation

    const totalUtilityCost = Math.round(utilityCount * utilityRate);
    const totalMarketingCost = Math.round(marketingCount * marketingRate);
    const totalServiceCost = Math.round(serviceCount * serviceRate);
    const totalMetaSpend = totalUtilityCost + totalMarketingCost + totalServiceCost;

    return (
        <section id="meta-pricing" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200/60">
                        Broadcast Economics
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Transparent Meta Pricing &amp; High-ROI Broadcasts
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Zero hidden markups. Nexus bills Meta's official conversation rates directly to your wallet. Broadcast festive deals with 98% open rates while protecting your sender score with our Anti-Spam Shield.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-24: Official Meta Conversation Pricing Rate Card & Estimator             */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
                    
                    {/* Left: Rate Card Table */}
                    <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Official Meta Cloud API</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Official Conversation Categories
                                </h3>
                            </div>
                            <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-700">
                                India Tier 2026
                            </span>
                        </div>

                        <div className="mt-5 space-y-3">
                            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm text-slate-900">Utility Conversations</div>
                                    <div className="text-[11px] text-slate-500">Order confirmation, e-invoice PDF, live dispatch tracking</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-black text-slate-900 font-mono">₹0.35</span>
                                    <span className="text-[10px] text-slate-400 block">per 24hr window</span>
                                </div>
                            </div>

                            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm text-slate-900">Marketing Broadcasts</div>
                                    <div className="text-[11px] text-slate-500">Diwali offers, seasonal catalogs, abandoned cart re-engagement</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-black text-rose-600 font-mono">₹0.85</span>
                                    <span className="text-[10px] text-slate-400 block">per 24hr window</span>
                                </div>
                            </div>

                            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm text-slate-900">Service / Support Chats</div>
                                    <div className="text-[11px] text-slate-500">User-initiated customer inquiries &amp; helpdesk resolutions</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-black text-blue-600 font-mono">₹0.30</span>
                                    <span className="text-[10px] text-slate-400 block">per 24hr window</span>
                                </div>
                            </div>

                            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm text-slate-900">Authentication OTPs</div>
                                    <div className="text-[11px] text-slate-500">Account login codes &amp; 2-factor authentication</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-black text-emerald-600 font-mono">₹0.12</span>
                                    <span className="text-[10px] text-slate-400 block">per code delivered</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span>Zero hidden middleman gateway surcharges</span>
                            <span className="font-bold text-emerald-700">100% Direct Meta Invoicing</span>
                        </div>
                    </div>

                    {/* Right: Interactive Monthly Estimator */}
                    <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Wallet Budget Calculator</span>
                                <h3 className="text-xl font-black text-white mt-0.5">
                                    Monthly WhatsApp Budget Estimator
                                </h3>
                            </div>
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                                Live Cost Rollup
                            </span>
                        </div>

                        {/* Sliders */}
                        <div className="mt-5 space-y-4">
                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                    <span>Utility Messages (Orders, Invoices)</span>
                                    <span className="text-emerald-400 font-mono">{utilityCount.toLocaleString()} Chats (₹{totalUtilityCost.toLocaleString()})</span>
                                </div>
                                <input
                                    type="range"
                                    min="1000"
                                    max="30000"
                                    step="500"
                                    value={utilityCount}
                                    onChange={(e) => setUtilityCount(parseInt(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                    <span>Marketing Broadcasts (Festivals, Deals)</span>
                                    <span className="text-rose-400 font-mono">{marketingCount.toLocaleString()} Chats (₹{totalMarketingCost.toLocaleString()})</span>
                                </div>
                                <input
                                    type="range"
                                    min="1000"
                                    max="50000"
                                    step="1000"
                                    value={marketingCount}
                                    onChange={(e) => setMarketingCount(parseInt(e.target.value))}
                                    className="w-full accent-rose-500 cursor-pointer"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                    <span>Service Support Conversations</span>
                                    <span className="text-blue-400 font-mono">{serviceCount.toLocaleString()} Chats (₹{totalServiceCost.toLocaleString()})</span>
                                </div>
                                <input
                                    type="range"
                                    min="200"
                                    max="10000"
                                    step="200"
                                    value={serviceCount}
                                    onChange={(e) => setServiceCount(parseInt(e.target.value))}
                                    className="w-full accent-blue-500 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Total Monthly Spend Box */}
                        <div className="mt-6 bg-slate-950/80 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-slate-400">Total Monthly Meta API Spend</div>
                                <div className="text-2xl font-black text-emerald-400 mt-0.5">
                                    ₹{totalMetaSpend.toLocaleString()}
                                </div>
                            </div>
                            <div className="text-right text-xs text-slate-400">
                                Estimated Revenue Generated:<br />
                                <strong className="text-white font-mono text-base">₹{(totalMetaSpend * 6.8).toLocaleString()} (6.8x ROI)</strong>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-25 to S-29: Broadcast Campaigns, Anti-Spam Shield & Multi-Agent Inbox   */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-25: High-ROI Festival Broadcasts */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            High-ROI Festival Broadcasts
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Segment customers by past buying volume. Send rich festive media cards with interactive buy buttons. Achieves 98% open rates compared to 3% on email.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-rose-600">
                            <span>Diwali &amp; New Year Ready</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-26: Anti-Spam Shield & Phone Tier Protection */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Anti-Spam Shield &amp; Tier Growth
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Auto-respects STOP/UNSUBSCRIBE keywords. Protects your sender quality rating so your daily limit scales smoothly from 1k to 10k to Unlimited messages.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-emerald-600">
                            <span>Zero Number Blocking</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-27: 50+ Pre-Approved Templates */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            50+ Pre-Approved Templates
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Pre-configured templates for retail billing, wholesale khata reminders, AMC renewals, and dispatch alerts. No waiting 48 hours for Meta template approvals.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-blue-600">
                            <span>Deploy in 1-Click</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-28: Multi-Agent Shared Team Inbox */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Multi-Agent Shared Team Inbox
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Multiple support agents can chat with customers simultaneously from one WhatsApp number. Assign conversations, add internal notes, and track resolution times.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-purple-600">
                            <span>Collaborative Support</span>
                            <span>→</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
