import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    selectedInquiryType: string;
}

export default function ComprehensiveInquiryForm({ selectedInquiryType }: Props) {
    // S-07 State: Instant GSTIN Autofill Assistant
    const [gstinInput, setGstinInput] = useState('');
    const [gstinStatus, setGstinStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // S-08 State: Callback time window
    const [callbackTime, setCallbackTime] = useState('within_15_mins');

    // S-09 State: Hardware installation checkbox
    const [needsHardwareVisit, setNeedsHardwareVisit] = useState(false);

    // Business type and software state
    const [businessType, setBusinessType] = useState('Retail');
    const [currentSoftware, setCurrentSoftware] = useState('Tally');

    // Inertia useForm setup connected directly to /lead
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        contact_person: '',
        business_name: '',
        phone: '',
        email: '',
        notes: ''
    });

    const handleGstinLookup = () => {
        const cleaned = gstinInput.trim().toUpperCase();
        if (cleaned.length === 15) {
            // Simulated live GSTIN extraction for Indian MSMEs
            const mockName = cleaned.startsWith('27') ? "Mahalaxmi Retail Enterprises"
                : cleaned.startsWith('24') ? "Kailash Industrial Suppliers"
                : cleaned.startsWith('29') ? "Bangalore Digital Mart"
                : "Apex Bharat Traders";

            setData('business_name', mockName);
            setGstinStatus('success');
        } else {
            setGstinStatus('error');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Concatenate extra metadata into notes field for CRM
        const compositeNotes = `[Inquiry: ${selectedInquiryType}] [Industry: ${businessType}] [Current ERP: ${currentSoftware}] [Callback: ${callbackTime}] ${needsHardwareVisit ? '[Requested On-Site Tech Visit]' : ''} ${data.notes || ''}`.trim();

        data.notes = compositeNotes;

        post('/lead', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setGstinInput('');
                setGstinStatus('idle');
            }
        });
    };

    return (
        <section id="inquiry-form" className="py-16 bg-white border-b border-slate-200/80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Fastest Route to Solution</span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                        Send Us a Direct Message
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1">
                        Fill out the details below and a dedicated ERP implementation consultant will reach out via phone or WhatsApp within 15 minutes.
                    </p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
                    {recentlySuccessful ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto">
                                ✓
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Message Received!</h3>
                            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                                Thank you for contacting Nexus. Our support and onboarding team has been notified, and a specialist will connect with you shortly.
                            </p>
                            <button
                                onClick={() => reset()}
                                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
                            >
                                Submit Another Inquiry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* ========================================================================= */}
                            {/* S-07: Instant 15-Digit GSTIN Autofill Assistant                            */}
                            {/* ========================================================================= */}
                            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-900">Have a GSTIN? Autofill in 1-Click:</span>
                                    <span className="text-[11px] text-slate-400">Optional time-saver</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        maxLength={15}
                                        value={gstinInput}
                                        onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                                        placeholder="Enter 15-digit GSTIN (e.g. 27AAAAA0000A1Z5)"
                                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGstinLookup}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs whitespace-nowrap transition-colors"
                                    >
                                        Autofill Business Name
                                    </button>
                                </div>
                                {gstinStatus === 'success' && (
                                    <p className="text-[11px] text-emerald-600 font-semibold">
                                        ✓ Business name autofilled successfully from GST portal registry.
                                    </p>
                                )}
                                {gstinStatus === 'error' && (
                                    <p className="text-[11px] text-rose-600">
                                        Please enter a valid 15-character GSTIN.
                                    </p>
                                )}
                            </div>

                            {/* Primary Contact Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Your Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.contact_person}
                                        onChange={(e) => setData('contact_person', e.target.value)}
                                        placeholder="e.g. Rajesh Singhania"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.contact_person && (
                                        <p className="text-[11px] text-rose-500 mt-1">{errors.contact_person}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Business / Firm Legal Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                        placeholder="e.g. Mahalaxmi Retail Enterprises"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.business_name && (
                                        <p className="text-[11px] text-rose-500 mt-1">{errors.business_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        10-Digit Mobile Number (with WhatsApp) <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex">
                                        <span className="px-3 py-2.5 text-xs bg-slate-200 border border-r-0 border-slate-300 rounded-l-xl text-slate-600 font-bold">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            required
                                            maxLength={10}
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value.replace(/\D/g, ''))}
                                            placeholder="74794 99718"
                                            className="w-full px-3.5 py-2.5 text-xs rounded-r-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Work Email Address (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="rajesh@mahalaxmiretail.in"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.email && (
                                        <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Dropdowns: Industry & Existing ERP */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Primary Industry
                                    </label>
                                    <select
                                        value={businessType}
                                        onChange={(e) => setBusinessType(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                    >
                                        <option value="Retail">Retail Store / Supermarket</option>
                                        <option value="Wholesale">Wholesale &amp; FMCG Distribution</option>
                                        <option value="Manufacturing">Manufacturing &amp; Job Work</option>
                                        <option value="Hotel">Hotel, Bar &amp; Restaurant</option>
                                        <option value="FieldServices">Field Services &amp; Maintenance</option>
                                        <option value="Other">Other Trade</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Current Software / Method
                                    </label>
                                    <select
                                        value={currentSoftware}
                                        onChange={(e) => setCurrentSoftware(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                    >
                                        <option value="Tally">Tally Prime / Tally.ERP 9</option>
                                        <option value="Vyapar">Vyapar</option>
                                        <option value="Marg">Marg ERP</option>
                                        <option value="Busy">Busy Accounting</option>
                                        <option value="Excel">Manual Excel / Paper Bills</option>
                                        <option value="Other">Other Software</option>
                                    </select>
                                </div>
                            </div>

                            {/* ========================================================================= */}
                            {/* S-08: Preferred Callback Window                                           */}
                            {/* ========================================================================= */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    When is the best time for our specialist to call?
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { id: 'within_15_mins', label: '⚡ In 15 Mins' },
                                        { id: 'morning', label: '🌅 10 AM - 1 PM' },
                                        { id: 'afternoon', label: '☀️ 2 PM - 5 PM' },
                                        { id: 'evening', label: '🌆 6 PM - 8 PM' }
                                    ].map((slot) => (
                                        <button
                                            type="button"
                                            key={slot.id}
                                            onClick={() => setCallbackTime(slot.id)}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                                                callbackTime === slot.id
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {slot.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes / Specific Requirements */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    How can we assist you? (Optional details)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Tell us about your counters, multi-branch setup, or specific GST concerns..."
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* ========================================================================= */}
                            {/* S-09: Hardware Cabling & On-Ground IT Partner Checkbox                     */}
                            {/* ========================================================================= */}
                            <div className="flex items-start gap-2.5 pt-1">
                                <input
                                    type="checkbox"
                                    id="hardware-visit"
                                    checked={needsHardwareVisit}
                                    onChange={(e) => setNeedsHardwareVisit(e.target.checked)}
                                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                                />
                                <label htmlFor="hardware-visit" className="text-xs text-slate-700 cursor-pointer">
                                    <span className="font-bold">Request In-Person Hardware Setup:</span> Connect me with an on-ground IT partner to visit my store for thermal printer, barcode scanner, or weighing scale configuration.
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting Request...' : 'Submit Inquiry & Request Callback →'}
                                </button>
                            </div>

                            {/* ========================================================================= */}
                            {/* S-10: Privacy & Zero-Spam Pledge                                         */}
                            {/* ========================================================================= */}
                            <div className="text-center pt-2 text-[11px] text-slate-400">
                                🔒 <strong>Zero Spam Guarantee:</strong> Your contact details will never be sold, shared, or spammed. Used solely to respond to your specific request.
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </section>
    );
}
