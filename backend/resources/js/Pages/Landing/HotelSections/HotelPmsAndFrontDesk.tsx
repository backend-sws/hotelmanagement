import React, { useState } from 'react';

export default function HotelPmsAndFrontDesk() {
    // S-05 State: Interactive Room Matrix
    const [selectedRoomType, setSelectedRoomType] = useState<'all' | 'deluxe' | 'suite' | 'standard'>('all');

    const rooms = [
        { no: '101', type: 'deluxe', guest: 'Dr. Sameer Mehta', nights: 2, status: 'occupied', tariff: 4500 },
        { no: '102', type: 'deluxe', guest: null, nights: 0, status: 'vacant', tariff: 4500 },
        { no: '103', type: 'deluxe', guest: 'Priya Sharma (Cleaning)', nights: 1, status: 'cleaning', tariff: 4500 },
        { no: '104', type: 'suite', guest: 'Singhania Family', nights: 4, status: 'occupied', tariff: 8500 },
        { no: '105', type: 'suite', guest: null, nights: 0, status: 'vacant', tariff: 8500 },
        { no: '106', type: 'standard', guest: 'Rajesh Verma (AC Repair)', nights: 0, status: 'maintenance', tariff: 2800 },
        { no: '107', type: 'standard', guest: 'Amitabh Sen', nights: 3, status: 'occupied', tariff: 2800 },
        { no: '108', type: 'standard', guest: null, nights: 0, status: 'vacant', tariff: 2800 }
    ];

    const filteredRooms = selectedRoomType === 'all' 
        ? rooms 
        : rooms.filter(r => r.type === selectedRoomType);

    return (
        <section id="room-pms" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60">
                        Front Desk &amp; Reservation Engine
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Visual Room Matrix, 30s Check-In &amp; Unified Guest Folios
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Effortlessly manage room occupancy, police Form-C guest registrations, consolidated room service billing, housekeeping checklists, and automated midnight night audits.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-05: Visual Room Grid & Calendar Matrix                                   */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-14">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Live Inventory</span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                                Interactive Color-Coded Room Availability Matrix
                            </h3>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setSelectedRoomType('all')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    selectedRoomType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                All Rooms (8)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRoomType('deluxe')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    selectedRoomType === 'deluxe' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Deluxe (3)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRoomType('suite')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    selectedRoomType === 'suite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Suites (2)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRoomType('standard')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    selectedRoomType === 'standard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Standard (3)
                            </button>
                        </div>
                    </div>

                    {/* Room Grid Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
                        {filteredRooms.map((room) => {
                            let statusStyle = 'bg-emerald-50 border-emerald-200 text-emerald-800';
                            let statusBadge = 'bg-emerald-600 text-white';
                            let statusLabel = 'Vacant Ready';

                            if (room.status === 'occupied') {
                                statusStyle = 'bg-blue-50 border-blue-200 text-blue-900';
                                statusBadge = 'bg-blue-600 text-white';
                                statusLabel = 'Occupied';
                            } else if (room.status === 'cleaning') {
                                statusStyle = 'bg-amber-50 border-amber-200 text-amber-900';
                                statusBadge = 'bg-amber-600 text-white';
                                statusLabel = 'Housekeeping';
                            } else if (room.status === 'maintenance') {
                                statusStyle = 'bg-slate-100 border-slate-300 text-slate-600';
                                statusBadge = 'bg-slate-600 text-white';
                                statusLabel = 'Out of Order';
                            }

                            return (
                                <div key={room.no} className={`p-4 rounded-2xl border transition-all ${statusStyle}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-base font-black">Room #{room.no}</span>
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${statusBadge}`}>
                                            {statusLabel}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold truncate">
                                        {room.guest || 'Available for Walk-In'}
                                    </p>
                                    <p className="text-[10.5px] opacity-75 mt-0.5">
                                        ₹{room.tariff.toLocaleString('en-IN')}/night • {room.type.toUpperCase()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Matrix Status Legend */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Vacant Ready</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Occupied</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cleaning</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Out of Order</span>
                        </div>
                        <span className="text-amber-700 font-bold">1-Click Fast Check-In Available</span>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-06 & S-07: 30s Check-In & Consolidated Guest Folio Billing             */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                    
                    {/* S-06: 30-Second Check-In & Police Form C Export */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Fast Front Desk</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    30-Second Check-In &amp; Govt ID Scan
                                </h3>
                            </div>
                            <span className="text-2xl">🪪</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                            Snap a photo of guest's Aadhaar, Passport, or Driving License via webcam or mobile. Nexus auto-extracts name, address &amp; DOB to generate police Form-C reports.
                        </p>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 font-black flex items-center justify-center shrink-0">
                                    📸
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">Webcam / Phone Camera ID Capture</p>
                                    <p className="text-[10px] text-slate-500">Secure AES-256 encrypted storage compliant with Indian guest privacy laws</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-black flex items-center justify-center shrink-0">
                                    🏛️
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">1-Click Police Form-C &amp; Guest Register</p>
                                    <p className="text-[10px] text-slate-500">Export daily foreign &amp; domestic guest registers formatted for local authorities</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-black flex items-center justify-center shrink-0">
                                    📲
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">WhatsApp Welcome Keycard &amp; Wi-Fi Password</p>
                                    <p className="text-[10px] text-slate-500">Auto-sends hotel rules, Wi-Fi credentials, and digital room service menu</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* S-07: Unified Guest Folio Billing */}
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                            <div>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Single Invoice</span>
                                <h3 className="text-xl font-black text-white mt-0.5">
                                    Unified All-in-One Guest Folio
                                </h3>
                            </div>
                            <span className="text-2xl">🧾</span>
                        </div>
                        <p className="text-slate-300 text-xs mt-1 mb-5">
                            Never hand guests multiple paper receipts upon checkout. All charges are auto-consolidated onto one clean GST tax invoice.
                        </p>

                        {/* Folio Preview Table */}
                        <div className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex justify-between">
                                <div>
                                    <p className="font-bold text-white">Room Stay (2 Nights • Deluxe 101)</p>
                                    <p className="text-[10px] text-slate-400">HSN 996311 • 12% GST</p>
                                </div>
                                <span className="font-black text-white">₹9,000</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex justify-between">
                                <div>
                                    <p className="font-bold text-white">In-Room Dining (KOT #389 &amp; #412)</p>
                                    <p className="text-[10px] text-slate-400">HSN 996331 • 5% GST</p>
                                </div>
                                <span className="font-black text-white">₹2,450</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex justify-between">
                                <div>
                                    <p className="font-bold text-white">Express Laundry &amp; Dry Clean</p>
                                    <p className="text-[10px] text-slate-400">HSN 9997 • 18% GST</p>
                                </div>
                                <span className="font-black text-white">₹650</span>
                            </div>
                        </div>

                        {/* Total & Checkout Button */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-slate-400">Total Folio Net Amount:</p>
                                <p className="text-xl font-black text-emerald-400">₹13,380</p>
                            </div>
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs">
                                1-Click WhatsApp Folio
                            </span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-08 to S-11: Advance Bookings, Housekeeping, Night Audit & Banquets      */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-08: Advance Booking & Dynamic Tariff Engine */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3">
                            📅
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Advance Booking &amp; Deposits
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Collect advance UPI deposits to secure room reservations. Enforce dynamic seasonal peak rates and automated cancellation refund rules.
                        </p>
                    </div>

                    {/* S-09: Housekeeping Staff Mobile Checklist */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                            🧹
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Housekeeping Mobile App
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Cleaning staff mark rooms as Clean / Inspected from their phones. Front desk grid updates instantly without walkie-talkie shouting.
                        </p>
                    </div>

                    {/* S-10: Automated Midnight Night Audit */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg mb-3">
                            🌙
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Auto Midnight Night Audit
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Automatically post daily room tariffs and GST taxes at 12:00 AM. Closes the day's financial registers and generates manager P&amp;L reports.
                        </p>
                    </div>

                    {/* S-11: Banquet & Conference Hall Booking */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-3">
                            🎉
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Banquet &amp; Event Booking
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Manage wedding halls and corporate seminars with per-plate catering menus, stage advance payments, and hall rental GST invoicing.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
