import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function FieldOpsSocialProofAndClosing() {
    // S-34 State: Interactive TA/DA & Fuel Savings ROI Calculator
    const [techCount, setTechCount] = useState(25);
    const [avgKmPerDay, setAvgKmPerDay] = useState(55);
    const [fuelRate, setFuelRate] = useState(4.00); // ₹4/km

    const workingDays = 26;
    const monthlyClaimedBefore = techCount * avgKmPerDay * fuelRate * workingDays;
    // Nexus GPS radar and geofenced punch-in typically eliminates 22% inflated odometer claims
    const estimatedFraudKilometersSaved = Math.round(monthlyClaimedBefore * 0.22);
    const timeSavedInDisputeHours = techCount * 3.5; // ~3.5 hours saved per tech per month in admin disputes

    // S-35 State: Live WhatsApp Field Bot Simulator
    const [simulatedChat, setSimulatedChat] = useState<Array<{ sender: 'bot' | 'tech'; text: string; time: string; button?: string }>>([
        { sender: 'bot', text: '🔔 NEW P1 EMERGENCY JOB: Carrier 5.0 Ton Chiller Tripping. Location: Cyber Hub Tower C, DLF Phase 2. Distance: 3.4 km.', time: '10:02 AM', button: 'Accept & Open GPS' }
    ]);
    const [botStep, setBotStep] = useState(1);

    const handleBotAction = () => {
        if (botStep === 1) {
            setSimulatedChat(prev => [
                ...prev,
                { sender: 'tech', text: '✅ Accepted Job #4912. En route to Cyber Hub Tower C.', time: '10:03 AM' },
                { sender: 'bot', text: '📍 Live GPS Tracking link shared with customer. ETA: 14 mins. Customer Contact: Mr. Kapoor (+91 98110 XXXXX).', time: '10:03 AM', button: 'Arrived On-Site' }
            ]);
            setBotStep(2);
        } else if (botStep === 2) {
            setSimulatedChat(prev => [
                ...prev,
                { sender: 'tech', text: '📍 Arrived on-site. Within 35m of GPS fence.', time: '10:19 AM' },
                { sender: 'bot', text: '✅ Geofence match confirmed. Timer started. Please snap outdoor PCB diagnostic photo.', time: '10:19 AM', button: 'Upload Photo Proof' }
            ]);
            setBotStep(3);
        } else if (botStep === 3) {
            setSimulatedChat(prev => [
                ...prev,
                { sender: 'tech', text: '📷 Photo sent: Outdoor PCB power stage capacitor.', time: '10:35 AM' },
                { sender: 'bot', text: '🔍 Gemini 1.5 Flash Vision: "Blown 450V 680uF capacitor verified. Deducted 1x CAP-45UF from Van Stock #DL-1V-8942. Customer invoice updated: ₹1,250 + GST."', time: '10:35 AM', button: 'Generate OTP & Close' }
            ]);
            setBotStep(4);
        } else {
            setSimulatedChat([
                { sender: 'bot', text: '🔔 NEW P1 EMERGENCY JOB: Carrier 5.0 Ton Chiller Tripping. Location: Cyber Hub Tower C, DLF Phase 2. Distance: 3.4 km.', time: '10:02 AM', button: 'Accept & Open GPS' }
            ]);
            setBotStep(1);
        }
    };

    // S-36 State: FAQ Category Filter & Search
    const [faqCategory, setFaqCategory] = useState<'all' | 'dispatch' | 'gps' | 'spares' | 'amc'>('all');
    const [faqSearch, setFaqSearch] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const faqs = [
        {
            category: 'dispatch',
            q: 'Do field technicians need to download any heavy mobile app?',
            a: 'No! Technicians receive job notifications, share live GPS locations, upload photos, and close tickets entirely through official Meta WhatsApp Cloud API bots. There are zero app store downloads and zero phone storage issues.'
        },
        {
            category: 'dispatch',
            q: 'Can supervisors assign jobs manually or is it 100% automated?',
            a: 'Both! You can enable Automated Proximity Dispatch (system finds the closest idle technician with the required skill set) or use the live Drag-and-Drop Gantt Kanban board to manually assign VIP corporate tickets.'
        },
        {
            category: 'gps',
            q: 'How does the automated TA/DA kilometer tracking work?',
            a: 'Nexus tracks actual road kilometers traveled during active service shifts via background GPS coordinates. It matches road paths against Google Maps route distance to eliminate inflated odometer claims and auto-credits TA/DA directly to staff payroll.'
        },
        {
            category: 'gps',
            q: 'Does the geofenced punch-in require active internet connection?',
            a: 'Yes, Nexus operates on 100% Real-Time Cloud Sync. Geofence validation (within 50 meters of the customer service address) checks live against our cloud servers to prevent location spoofing or fake attendance.'
        },
        {
            category: 'spares',
            q: 'How does Gemini 1.5 Flash Vision AI verify repair work?',
            a: 'Technicians take photos directly through WhatsApp. Our Google Gemini 1.5 Flash Vision AI model inspects pressure gauge dials, burnt PCB components, and before/after brazing. It also checks EXIF metadata and hash signatures to prevent reusing old gallery photos.'
        },
        {
            category: 'spares',
            q: 'How is mobile van stock synchronized with the central godown?',
            a: 'Each technician van or bike bag is registered as a mobile sub-warehouse in Nexus. When a part is fitted and verified via customer OTP, it instantly debits from the technician\'s van inventory and updates central ERP stock in real-time.'
        },
        {
            category: 'amc',
            q: 'How does automated WhatsApp AMC renewal work?',
            a: 'Nexus monitors contract expiration dates and triggers automated WhatsApp reminders at 30, 15, 7, and 1-day intervals with pre-filled dynamic UPI payment links. Customers pay in 1 tap, automatically generating an updated digital AMC contract and GST tax invoice.'
        },
        {
            category: 'amc',
            q: 'Does Nexus support dual-tax invoices with SAC 9987 and HSN spare parts?',
            a: 'Yes. Invoices automatically bifurcate labor charges under SAC 9987 (18% GST) and physical hardware spare parts under respective HSN codes (e.g., HSN 8415 at 18% or 28%), ensuring complete GSTR-1 statutory compliance.'
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
        const matchesSearch = faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || faq.a.toLowerCase().includes(faqSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="social-proof-closing" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ========================================================================= */}
                {/* S-33: 3 Enterprise Customer Case Studies                                  */}
                {/* ========================================================================= */}
                <div className="mb-20">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/60">
                            Proven Field Results
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            Trusted by India's Top Field Service Fleets
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            See how leading HVAC franchises, commercial RO chains, and solar AMC providers scaled operations while cutting travel waste.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Case Study 1: Voltas Franchisee */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                        HVAC &amp; Commercial Cooling
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">45 Technicians</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    "Saved ₹1.8 Lakhs/Month on Inflated Travel Claims in Just 60 Days."
                                </h3>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    "Before Nexus, our technicians claimed 70-80 km daily with zero odometer proof. With automated GPS route tracking and geofenced punch-in, fake claims dropped to zero, and first-time-fix jumped from 61% to 89%."
                                </p>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                                    AK
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Anil Khandelwal</div>
                                    <div className="text-[11px] text-slate-500">Managing Partner, CoolAir Systems (Delhi NCR)</div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 2: PureWater RO Chain */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                                        Water Treatment &amp; RO
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">32 Technicians</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    "Our AMC Renewal Rate Reached 91% With Zero Manual Calling."
                                </h3>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    "Automated WhatsApp dunning with 1-tap UPI links transformed our cash flow. Customers renew right from WhatsApp without our telecallers chasing them. Our spare parts leakage is also down to 0.4%."
                                </p>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-black flex items-center justify-center text-sm">
                                    SM
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Sangeetha Murthy</div>
                                    <div className="text-[11px] text-slate-500">Operations Director, PureWater Technologies (Bengaluru)</div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 3: SolarTech Jaipur */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                        Solar EPC &amp; AMC
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">28 Field Engineers</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    "Gemini AI Photo Audits Cut Warranty Claim Rejections to Zero."
                                </h3>
                                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                    "Our engineers service multi-megawatt rooftop arrays across Rajasthan. Gemini Vision AI checks string inverter error codes and panel serial barcodes before tickets close. OEM warranty processing is now 100% dispute-free."
                                </p>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-black flex items-center justify-center text-sm">
                                    RC
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Raghavendra Choudhary</div>
                                    <div className="text-[11px] text-slate-500">Founder &amp; CTO, SolarTech Energies (Jaipur)</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-34 & S-35: Interactive ROI Calculator & Live WhatsApp Bot Simulator     */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-center">
                    
                    {/* S-34: Interactive TA/DA ROI Calculator */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Fleet Efficiency Calculator</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Calculate Your Monthly Travel &amp; Fuel Savings
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                -22% Odometer Fraud
                            </span>
                        </div>

                        {/* Sliders */}
                        <div className="mt-6 space-y-5">
                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Field Technicians / Engineers</span>
                                    <span className="text-emerald-600 font-mono text-sm">{techCount} Techs</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={techCount}
                                    onChange={(e) => setTechCount(parseInt(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                    <span>5 techs</span>
                                    <span>50 techs</span>
                                    <span>100 techs</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Average Claimed Distance per Tech / Day</span>
                                    <span className="text-emerald-600 font-mono text-sm">{avgKmPerDay} km / day</span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="120"
                                    value={avgKmPerDay}
                                    onChange={(e) => setAvgKmPerDay(parseInt(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                    <span>20 km</span>
                                    <span>70 km</span>
                                    <span>120 km</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Fuel &amp; Travel Reimbursement Rate</span>
                                    <span className="text-emerald-600 font-mono text-sm">₹{fuelRate.toFixed(2)} / km</span>
                                </div>
                                <input
                                    type="range"
                                    min="2.50"
                                    max="7.00"
                                    step="0.25"
                                    value={fuelRate}
                                    onChange={(e) => setFuelRate(parseFloat(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                    <span>₹2.50 (2-Wheeler)</span>
                                    <span>₹4.50 (Shared Van)</span>
                                    <span>₹7.00 (Heavy Cargo)</span>
                                </div>
                            </div>
                        </div>

                        {/* Output Savings Display */}
                        <div className="mt-8 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-[11px] text-slate-400">Current Monthly Fuel Bill</div>
                                    <div className="text-lg font-bold text-slate-200 mt-0.5">₹{monthlyClaimedBefore.toLocaleString()}</div>
                                </div>
                                <div className="border-x border-white/10">
                                    <div className="text-[11px] text-emerald-400 font-bold">Estimated Monthly Savings</div>
                                    <div className="text-2xl font-black text-emerald-300 mt-0.5">
                                        ₹{estimatedFraudKilometersSaved.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-emerald-400/80">Direct bottom-line profit</div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-slate-400">Admin Dispute Time Saved</div>
                                    <div className="text-lg font-bold text-blue-400 mt-0.5">{Math.round(timeSavedInDisputeHours)} Hrs / Mo</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* S-35: Live WhatsApp Bot Tester Simulator */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Interactive Bot Test</span>
                                </div>
                                <span className="text-xs text-slate-400 font-mono">Step {botStep} of 4</span>
                            </div>

                            <h3 className="text-lg font-black text-white mt-3">
                                Test the FieldOps WhatsApp Flow
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Experience exactly what your technician sees on WhatsApp without installing any test app.
                            </p>

                            {/* Chat Window */}
                            <div className="mt-5 space-y-3 max-h-72 overflow-y-auto pr-1">
                                {simulatedChat.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${msg.sender === 'tech' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                                                msg.sender === 'tech'
                                                    ? 'bg-emerald-600 text-white rounded-br-none'
                                                    : 'bg-slate-800 text-slate-200 border border-white/10 rounded-bl-none'
                                            }`}
                                        >
                                            <p>{msg.text}</p>
                                            <div className="text-[10px] text-right mt-1 opacity-70">{msg.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Clickable Bot Trigger Button */}
                        <div className="mt-5 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handleBotAction}
                                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                {botStep === 1 && 'Simulate: Accept Job on WhatsApp'}
                                {botStep === 2 && 'Simulate: Punch In via Geofenced GPS'}
                                {botStep === 3 && 'Simulate: Trigger Gemini AI Photo Audit'}
                                {botStep === 4 && 'Reset Simulator Flow'}
                            </button>
                            <div className="text-center text-[10px] text-slate-400 mt-2">
                                Click to trigger next step in the live technician journey
                            </div>
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-36: FieldOps FAQ with Search & Category Filter                          */}
                {/* ========================================================================= */}
                <div className="mb-20">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
                            Got Questions?
                        </span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
                            Frequently Asked Questions About FieldOps
                        </h2>
                        <p className="text-slate-600 text-sm mt-2">
                            Everything you need to know about WhatsApp dispatch, GPS accuracy, inventory debit, and AMC renewal.
                        </p>
                    </div>

                    {/* Search & Category Filter Controls */}
                    <div className="max-w-2xl mx-auto mb-8 space-y-3">
                        <input
                            type="text"
                            value={faqSearch}
                            onChange={(e) => setFaqSearch(e.target.value)}
                            placeholder="Search questions (e.g. GPS, WhatsApp, offline, AMC, invoice)..."
                            className="w-full px-4 py-2.5 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-xs"
                        />

                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {[
                                { id: 'all', label: 'All Topics' },
                                { id: 'dispatch', label: 'WhatsApp Dispatch' },
                                { id: 'gps', label: 'GPS & TA/DA' },
                                { id: 'spares', label: 'Inventory & Vision AI' },
                                { id: 'amc', label: 'AMC Contracts & Tax' }
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
                                No questions found matching your search. Please reach out to our solutions team directly.
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
                                            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 transition"
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
                {/* S-37: Enterprise Security & Trust Badges Strip                            */}
                {/* ========================================================================= */}
                <div className="mb-20 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Enterprise Reliability</span>
                        <h3 className="text-xl font-black text-white mt-1">
                            Bank-Grade Security for Critical Field Operations
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                            Your technician GPS data, customer addresses, and financial invoicing are protected with top-tier cloud compliance.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-emerald-400">Meta Partner</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">Official Cloud API</div>
                            <div className="text-[10px] text-slate-400">High-throughput 1,000 TPS</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-blue-400">256-Bit AES</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">End-to-End Encryption</div>
                            <div className="text-[10px] text-slate-400">Rest &amp; Transit Security</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-purple-400">99.99% Cloud</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">Real-Time Sync SLA</div>
                            <div className="text-[10px] text-slate-400">Zero Local Data Loss</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-lg font-black text-amber-400">ISO 27001</div>
                            <div className="text-xs text-slate-300 font-medium mt-1">SOC 2 Type II Certified</div>
                            <div className="text-[10px] text-slate-400">Audited Security Controls</div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-38: Closing Trial CTA & Free Consultation Banner                        */}
                {/* ========================================================================= */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 sm:p-14 text-white shadow-2xl">
                    <div className="relative z-10 max-w-3xl">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
                            48-Hour Rapid Rollout
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-4 text-white">
                            Ready to Eliminate Travel Fraud &amp; Modernize Your Field Fleet?
                        </h2>
                        <p className="text-slate-200 text-sm sm:text-base mt-4 leading-relaxed">
                            Join 450+ service enterprises across India running on Nexus. Zero mobile app installations required—your technicians start receiving WhatsApp jobs on Day 1.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Link
                                href="/register"
                                className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm text-center shadow-lg transition transform hover:-translate-y-0.5"
                            >
                                Start 14-Day Free Trial
                            </Link>
                            <Link
                                href="/demo"
                                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm text-center border border-white/20 backdrop-blur-xs transition"
                            >
                                Schedule Live FieldOps Demo
                            </Link>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>No Credit Card Required</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Official WhatsApp Cloud API Ready</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>100% Real-Time Cloud Sync</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
                    <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                </div>

            </div>
        </section>
    );
}
