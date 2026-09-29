import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function WhatsAppSocialProofAndClosing() {
    // S-31 State: Interactive WhatsApp vs SMS/Calling ROI Calculator
    const [monthlyOutboundReach, setMonthlyOutboundReach] = useState(10000); // 10,000 customers reached per month
    const [avgOrderTicket, setAvgOrderTicket] = useState(1200); // ₹1,200 average order value

    // SMS Conversion is typically 0.8% with 20% open rate
    // WhatsApp Interactive Catalog Conversion is typically 4.6% with 98% open rate
    const smsOrders = Math.round(monthlyOutboundReach * 0.008);
    const smsRevenue = smsOrders * avgOrderTicket;

    const whatsappOrders = Math.round(monthlyOutboundReach * 0.046);
    const whatsappRevenue = whatsappOrders * avgOrderTicket;
    const additionalMonthlyRevenue = whatsappRevenue - smsRevenue;

    // S-32 State: Live Chatbot Tester Simulator
    const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; options?: string[] }>>([
        {
            sender: 'bot',
            text: 'Namaste! Welcome to Royal Fresh Mart. How can we help you today?',
            time: '11:00 AM',
            options: ['Browse Today’s Fresh Deals', 'Check Outstanding Khata', 'Track My Delivery']
        }
    ]);

    const handleChatbotOption = (option: string) => {
        if (option === 'Browse Today’s Fresh Deals') {
            setChatHistory(prev => [
                ...prev,
                { sender: 'user', text: option, time: '11:01 AM' },
                {
                    sender: 'bot',
                    text: '🥭 Summer Special: Ratnagiri Alphonso Mangoes at 15% OFF today! Fresh Shimla Apples & Cold-Pressed Groundnut Oil also in stock.',
                    time: '11:01 AM',
                    options: ['Open In-Chat Catalog', 'Main Menu']
                }
            ]);
        } else if (option === 'Check Outstanding Khata') {
            setChatHistory(prev => [
                ...prev,
                { sender: 'user', text: option, time: '11:01 AM' },
                {
                    sender: 'bot',
                    text: '📊 Your account (#CUST-8491) has 1 open invoice of ₹1,450 due on 22-Feb. Tap below to clear instantly via GPay/PhonePe.',
                    time: '11:01 AM',
                    options: ['Pay ₹1,450 via UPI', 'Download PDF Statement', 'Main Menu']
                }
            ]);
        } else if (option === 'Track My Delivery') {
            setChatHistory(prev => [
                ...prev,
                { sender: 'user', text: option, time: '11:01 AM' },
                {
                    sender: 'bot',
                    text: '🛵 Your order #ORD-9120 is out for delivery! Driver: Ramesh (+91 98450 XXXXX). ETA: 12 mins. Live tracking link: nexus.in/track/9120',
                    time: '11:01 AM',
                    options: ['Call Driver', 'Main Menu']
                }
            ]);
        } else {
            setChatHistory([
                {
                    sender: 'bot',
                    text: 'Namaste! Welcome to Royal Fresh Mart. How can we help you today?',
                    time: '11:00 AM',
                    options: ['Browse Today’s Fresh Deals', 'Check Outstanding Khata', 'Track My Delivery']
                }
            ]);
        }
    };

    // S-33 State: WhatsApp FAQ Section with Search & Category Filter
    const [faqCategory, setFaqCategory] = useState<'all' | 'api' | 'green_tick' | 'dunning' | 'security'>('all');
    const [faqSearch, setFaqSearch] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const faqs = [
        {
            category: 'api',
            q: 'Can I use my existing WhatsApp Business phone number with Nexus?',
            a: 'Yes! Meta now allows phone number co-existence. You can connect your existing company phone number to the official Meta Cloud API through Nexus while continuing to use it on your staff phones.'
        },
        {
            category: 'api',
            q: 'What are Meta\'s official conversation window rules?',
            a: 'Meta uses a 24-hour rolling session window. When a customer sends you a message, a 24-hour "Service" window opens where you can reply freely without template restrictions. For business-initiated outreach, pre-approved templates (Utility or Marketing) are required.'
        },
        {
            category: 'green_tick',
            q: 'How long does it take to get the Official Green Tick badge?',
            a: 'Once your Meta Business Manager is verified with your business registration documents (GST, Certificate of Incorporation), the Official Business Account (OBA) Green Tick review typically takes 3 to 7 business days.'
        },
        {
            category: 'dunning',
            q: 'How does 1-tap dynamic UPI payment work inside WhatsApp?',
            a: 'Nexus builds dynamic UPI intent links (e.g. upi://pay?pa=merchant@icici&am=1250&tn=INV-8410). When the customer clicks the button in WhatsApp, their smartphone natively opens Google Pay, PhonePe, or Paytm with the exact amount pre-filled.'
        },
        {
            category: 'dunning',
            q: 'What happens immediately after a customer makes a payment?',
            a: 'Our bank webhook catches the settlement in 1.2 seconds, automatically closes the unpaid invoice in your Nexus ERP, updates customer ledger balance, and sends a digital receipt PDF directly back to the customer on WhatsApp.'
        },
        {
            category: 'security',
            q: 'Will my phone number get banned for sending marketing broadcasts?',
            a: 'No, because Nexus operates strictly on the official Meta Cloud API, not illegal scraping tools or emulator scripts. We enforce automated opt-out keywords ("STOP") and frequency capping to ensure your phone number health rating remains Green.'
        },
        {
            category: 'security',
            q: 'Can multiple support agents chat with customers from the same number?',
            a: 'Yes! Nexus includes a Multi-Agent Team Inbox. Over 20+ executives can log into the web dashboard simultaneously, receive customer chats, assign tickets, and view full customer order history.'
        },
        {
            category: 'api',
            q: 'Are WhatsApp Cloud API messages delivered in real time?',
            a: 'Yes. Nexus is built on 100% Real-Time Cloud Sync with direct Meta Graph API webhooks, ensuring sub-second message delivery and live inventory updates.'
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
        const matchesSearch = faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || faq.a.toLowerCase().includes(faqSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="case-studies" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ========================================================================= */}
                {/* S-30: 3 Verified MSME Customer Case Studies                               */}
                {/* ========================================================================= */}
                <div className="mb-20">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
                            Proven Conversion Impact
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            How Indian Enterprises Scale on WhatsApp
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            From local supermarket chains to logistics fleets and wholesale saree hubs, see real business metrics unlocked by Nexus WhatsApp automation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Case Study 1: Royal Supermarket */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        Retail Grocery
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">14k Monthly Orders</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    "14,000 Monthly WhatsApp Orders &amp; 71% Faster Customer Payments."
                                </h3>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    "Customers love ordering groceries right in WhatsApp. They browse our photo catalog, select items, and pay via PhonePe in 10 seconds. Our weekly re-order rate doubled and delivery boys never get lost."
                                </p>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                                    MK
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Mohammed Khalid</div>
                                    <div className="text-[11px] text-slate-500">Owner, Royal Fresh Mart (Hyderabad)</div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 2: Apex Logistics */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                                        Logistics Fleet
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">85 Cargo Drivers</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    "Managed 85 Truck Drivers 100% via WhatsApp with Zero App Downloads."
                                </h3>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    "Drivers couldn't understand complex logistics apps. With Nexus, dispatch coordinates, loading slips, diesel advances, and delivery POD photos are handled entirely through WhatsApp interactive buttons."
                                </p>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                                    VS
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Vikramaditya Shekhawat</div>
                                    <div className="text-[11px] text-slate-500">COO, Apex Fleet Solutions (Jaipur)</div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 3: Surat Textile Hub */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                                        B2B Wholesale Textile
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">4,200 Dealers</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    "₹1.2 Crore Festive Turnover in 72 Hours via Catalog Broadcast."
                                </h3>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    "We sent our Diwali silk saree collection catalog to 4,200 verified B2B retailers. 98% opened within 15 minutes, and 340 bulk wholesale orders were confirmed with token advances within 3 days."
                                </p>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-sm">
                                    PJ
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Prakash Jariwala</div>
                                    <div className="text-[11px] text-slate-500">Managing Partner, Surat Silk Mills (Surat)</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-31 & S-32: Interactive ROI Calculator & Live Chatbot Tester Simulator   */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-center">
                    
                    {/* Left: WhatsApp vs SMS ROI Calculator (S-31) */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Revenue Multiplier</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    WhatsApp vs SMS / Calling ROI Comparison
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                +5.7x Better Conversion
                            </span>
                        </div>

                        {/* Sliders */}
                        <div className="mt-6 space-y-5">
                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Monthly Customer Reach</span>
                                    <span className="text-emerald-600 font-mono text-sm">{monthlyOutboundReach.toLocaleString()} Customers</span>
                                </div>
                                <input
                                    type="range"
                                    min="2000"
                                    max="50000"
                                    step="1000"
                                    value={monthlyOutboundReach}
                                    onChange={(e) => setMonthlyOutboundReach(parseInt(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Average Order Value (AOV)</span>
                                    <span className="text-emerald-600 font-mono text-sm">₹{avgOrderTicket.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="300"
                                    max="5000"
                                    step="100"
                                    value={avgOrderTicket}
                                    onChange={(e) => setAvgOrderTicket(parseInt(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Comparative Grid Output */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                                <div className="text-xs text-slate-500 font-medium">Traditional SMS / Calls (0.8% Conv)</div>
                                <div className="text-xl font-black text-slate-700 mt-1">₹{smsRevenue.toLocaleString()} / Mo</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{smsOrders} Orders Generated</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center">
                                <div className="text-xs text-emerald-800 font-bold">WhatsApp Native Catalog (4.6% Conv)</div>
                                <div className="text-2xl font-black text-emerald-700 mt-1">₹{whatsappRevenue.toLocaleString()} / Mo</div>
                                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">{whatsappOrders} Orders (+₹{additionalMonthlyRevenue.toLocaleString()} Gain)</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Interactive Chatbot Flow Tester (S-32) */}
                    <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Bot Tester</span>
                                </div>
                                <span className="text-xs text-slate-400 font-mono">Interactive Demo</span>
                            </div>

                            <h4 className="text-lg font-black text-white mt-3">
                                Test the Intelligent Bot Assistant
                            </h4>
                            <p className="text-xs text-slate-400 mt-1">
                                Click any quick reply button below to see how the bot handles orders, khata balance, and delivery tracking in real time.
                            </p>

                            {/* Chat Thread */}
                            <div className="mt-5 space-y-3 max-h-64 overflow-y-auto pr-1">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                                            msg.sender === 'user'
                                                ? 'bg-emerald-600 text-white rounded-br-none'
                                                : 'bg-slate-900 text-slate-200 border border-white/10 rounded-bl-none'
                                        }`}>
                                            <p>{msg.text}</p>
                                            <div className="text-[9px] text-right mt-1 opacity-70">{msg.time}</div>
                                        </div>

                                        {/* Render clickable buttons if bot provides options */}
                                        {msg.options && (
                                            <div className="mt-2 space-y-1 w-full max-w-[88%]">
                                                {msg.options.map((opt, oIdx) => (
                                                    <button
                                                        key={oIdx}
                                                        type="button"
                                                        onClick={() => handleChatbotOption(opt)}
                                                        className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-[11px] text-center border border-white/10 transition"
                                                    >
                                                        {opt} →
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 text-center text-[10px] text-slate-400">
                            Powered by Nexus Conversation Engine • Sub-400ms NLP Response
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-33: WhatsApp FAQ Section with Search & Category Filter                  */}
                {/* ========================================================================= */}
                <div className="mb-20">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
                            Clear Answers
                        </span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
                            Frequently Asked Questions About WhatsApp Cloud API
                        </h2>
                        <p className="text-slate-600 text-sm mt-2">
                            Everything you need to know about numbers, green ticks, Meta pricing, and spam compliance.
                        </p>
                    </div>

                    {/* Search & Category Filter Controls */}
                    <div className="max-w-2xl mx-auto mb-8 space-y-3">
                        <input
                            type="text"
                            value={faqSearch}
                            onChange={(e) => setFaqSearch(e.target.value)}
                            placeholder="Search questions (e.g. Phone number, Green tick, UPI, Pricing, Spam)..."
                            className="w-full px-4 py-2.5 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-xs"
                        />

                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {[
                                { id: 'all', label: 'All Topics' },
                                { id: 'api', label: 'API & Numbers' },
                                { id: 'green_tick', label: 'Green Tick' },
                                { id: 'dunning', label: 'UPI & Invoicing' },
                                { id: 'security', label: 'Anti-Spam & Team' }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFaqCategory(cat.id as typeof faqCategory)}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                                        faqCategory === cat.id
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Accordion List */}
                    <div className="max-w-3xl mx-auto space-y-3">
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-xs">
                                No questions found matching your search. Please reach out to our WhatsApp specialists directly.
                            </div>
                        ) : (
                            filteredFaqs.map((faq, idx) => {
                                const isOpen = openFaqIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-emerald-600 transition"
                                        >
                                            <span>{faq.q}</span>
                                            <span className={`w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 shrink-0 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-34: Enterprise Security & Meta Trust Badges                             */}
                {/* ========================================================================= */}
                <div className="mb-20 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Enterprise Compliance</span>
                        <h3 className="text-xl font-black text-white mt-1">
                            Direct Meta Partnership with Bank-Grade Security
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                            Your customer contact lists, transaction ledger history, and dynamic UPI QR payments are protected with top-tier certifications.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-emerald-400">Meta Partner</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">Official Cloud API</div>
                            <div className="text-[10px] text-slate-400">1,000 TPS Direct Node</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-blue-400">256-Bit SSL</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">End-to-End Encrypted</div>
                            <div className="text-[10px] text-slate-400">Rest &amp; In-Transit Security</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-purple-400">SOC-2 Type II</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">ISO 27001 Certified</div>
                            <div className="text-[10px] text-slate-400">Audited Cloud Infrastructure</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-amber-400">99.99% Uptime</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">100% Real-Time Cloud</div>
                            <div className="text-[10px] text-slate-400">Sub-Second Delivery SLA</div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-35: Closing WhatsApp Trial CTA Banner                                    */}
                {/* ========================================================================= */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 p-8 sm:p-14 text-white shadow-2xl">
                    <div className="relative z-10 max-w-3xl">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-950 bg-emerald-300 px-3.5 py-1 rounded-full border border-emerald-400">
                            48-Hour Meta Onboarding
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 text-white">
                            Ready to Turn WhatsApp into Your Primary Sales &amp; Collections Machine?
                        </h2>
                        <p className="text-emerald-100 text-sm sm:text-base mt-4 leading-relaxed">
                            Join 4,800+ forward-thinking Indian businesses running on Nexus. Connect your Meta Business account, upload your product catalog, and launch automated 1-tap UPI billing in less than 48 hours.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Link
                                href="/register"
                                className="px-8 py-3.5 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-black text-sm text-center shadow-lg transition transform hover:-translate-y-0.5"
                            >
                                Start 14-Day Free Trial
                            </Link>
                            <Link
                                href="/demo"
                                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm text-center border border-white/20 backdrop-blur-xs transition"
                            >
                                Schedule WhatsApp Specialist Demo
                            </Link>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-emerald-100">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Free Green Tick Application Assistance</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>100% Real-Time Cloud Sync</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background Glows */}
                    <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
                    <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
                </div>

            </div>
        </section>
    );
}
