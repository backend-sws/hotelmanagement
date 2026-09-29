import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    selectedDate: string;
    selectedTime: string;
    selectedFormat: string;
}

export default function IndustryTailoredDemoForm({
    selectedDate,
    selectedTime,
    selectedFormat
}: Props) {
    // S-07 State: Industry track selector
    const [activeTrack, setActiveTrack] = useState('retail');

    // S-08 State: Hardware checkboxes
    const [hardware, setHardware] = useState<string[]>(['printer', 'scanner']);

    // Branch count & current software
    const [outletsCount, setOutletsCount] = useState('1');
    const [currentSoftware, setCurrentSoftware] = useState('Tally');

    const tracks = [
        { id: 'retail', title: 'Retail Supermarket', icon: '🛒', desc: 'Fast barcode counter, thermal bills & weighing scale' },
        { id: 'wholesale', title: 'Wholesale & FMCG', icon: '📦', desc: 'FEFO batch expiry, multi-warehouse & khata credit' },
        { id: 'manufacturing', title: 'Manufacturing ERP', icon: '🏭', desc: 'Multi-stage BOM, scrap tracking & job work challans' },
        { id: 'hotel', title: 'Hotel & Restaurant', icon: '🏨', desc: 'Table QR ordering, KOT routing & split billing' },
        { id: 'field', title: 'Field Services', icon: '🔧', desc: 'WhatsApp technician dispatch & Gemini AI photo audits' }
    ];

    const hardwareOptions = [
        { id: 'printer', label: 'Thermal Receipt Printer (2-inch/3-inch)' },
        { id: 'scanner', label: 'Barcode Scanner (USB / Wireless)' },
        { id: 'scale', label: 'Electronic Weighing Scale' },
        { id: 'touch_pos', label: 'Touch POS Terminal / Tablet' }
    ];

    const toggleHardware = (id: string) => {
        setHardware(prev =>
            prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
        );
    };

    // Inertia useForm connected to /lead
    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        contact_person: '',
        business_name: '',
        phone: '',
        email: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Concatenate extra metadata into notes field
        const hardwareStr = hardware.join(', ');
        const compositeNotes = `[DEMO REQUEST] [Track: ${activeTrack}] [Date: ${selectedDate} at ${selectedTime}] [Format: ${selectedFormat}] [Outlets: ${outletsCount}] [Current ERP: ${currentSoftware}] [Hardware: ${hardwareStr}] ${data.notes || ''}`.trim();

        data.notes = compositeNotes;

        post('/lead', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <section id="booking-form" className="py-16 bg-white border-b border-slate-200/80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 3: Tailor Your Demo</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                        Select Your Trade Track &amp; Confirm Booking
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1">
                        We don’t do generic software slideshows. Your demo is loaded with sample products and tax scenarios from your exact industry.
                    </p>
                </div>

                {/* S-07: Industry Track Selector Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-10">
                    {tracks.map((track) => (
                        <button
                            type="button"
                            key={track.id}
                            onClick={() => setActiveTrack(track.id)}
                            className={`p-3.5 rounded-2xl border text-center transition-all ${
                                activeTrack === track.id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <span className="text-2xl mb-1 block">{track.icon}</span>
                            <div className="font-bold text-xs">{track.title}</div>
                        </button>
                    ))}
                </div>

                {/* Booking Form Container */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
                    {recentlySuccessful ? (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto">
                                🎉
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Demo Walkthrough Confirmed!</h3>
                            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                                We have reserved your slot for <span className="font-bold text-blue-600">{selectedTime}</span>. A Google Meet invite and WhatsApp confirmation have been sent to your contact details.
                            </p>
                            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 max-w-sm mx-auto">
                                <strong>Assigned Track:</strong> {tracks.find(t => t.id === activeTrack)?.title}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Contact Details */}
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
                                        placeholder="e.g. Ramesh Patel"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.contact_person && (
                                        <p className="text-[11px] text-rose-500 mt-1">{errors.contact_person}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Business / Store Legal Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                        placeholder="e.g. Patel Supermarket &amp; Provisions"
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
                                        WhatsApp Mobile Number <span className="text-rose-500">*</span>
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
                                        Work Email (For Calendar Invite)
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="ramesh@patelstore.in"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.email && (
                                        <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Scale & Current ERP */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Number of Store Outlets / Branches
                                    </label>
                                    <select
                                        value={outletsCount}
                                        onChange={(e) => setOutletsCount(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                                    >
                                        <option value="1">1 Single Store / Counter</option>
                                        <option value="2-5">2 to 5 Outlets</option>
                                        <option value="6-15">6 to 15 Outlets (Multi-Branch)</option>
                                        <option value="15+">15+ Outlets (Enterprise Chain)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Current Accounting Tool
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
                                        <option value="Excel">Manual Excel / Registers</option>
                                        <option value="Other">Other Software</option>
                                    </select>
                                </div>
                            </div>

                            {/* ========================================================================= */}
                            {/* S-08: POS Hardware Compatibility Checklist                                */}
                            {/* ========================================================================= */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Which hardware do you want us to demonstrate compatibility with?
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {hardwareOptions.map((hw) => (
                                        <label
                                            key={hw.id}
                                            className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-100"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={hardware.includes(hw.id)}
                                                onChange={() => toggleHardware(hw.id)}
                                                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                                            />
                                            <span>{hw.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* S-09: Custom Questions / Notes */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Any specific workflow you want to see? (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="e.g., We need to see how inter-branch stock transfers work or how WhatsApp payment links are collected..."
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                >
                                    {processing ? 'Reserving Your Demo...' : 'Confirm My 20-Minute Personalized Demo →'}
                                </button>
                            </div>

                            {/* S-10: Confirmation Pledge */}
                            <div className="text-center pt-1 text-[11px] text-slate-500">
                                ⚡ <strong>Instant Confirmation:</strong> Google Meet calendar invite + WhatsApp reminder sent in &lt;60 seconds. Zero sales pressure.
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </section>
    );
}
