import { useState } from 'react';

const ROOMS = [
    { num: '101', type: 'Deluxe King', status: 'Occupied', guest: 'Dr. Alok Verma', nights: '2/3 N', color: 'bg-blue-600 text-white border-blue-700' },
    { num: '102', type: 'Deluxe King', status: 'Vacant Clean', guest: 'Ready for check-in', nights: '-', color: 'bg-emerald-600 text-white border-emerald-700' },
    { num: '103', type: 'Super Deluxe', status: 'Due Out', guest: 'Rohan Mehta', nights: 'Checkout 11 AM', color: 'bg-purple-600 text-white border-purple-700' },
    { num: '104', type: 'Super Deluxe', status: 'Dirty', guest: 'Housekeeping Req.', nights: '-', color: 'bg-amber-500 text-white border-amber-600' },
    { num: '201', type: 'Executive Suite', status: 'Reserved', guest: 'Priya Nambiar', nights: 'Arriving 4 PM', color: 'bg-indigo-600 text-white border-indigo-700' },
    { num: '202', type: 'Executive Suite', status: 'Maintenance', guest: 'AC Servicing', nights: '-', color: 'bg-rose-600 text-white border-rose-700' },
    { num: '203', type: 'Presidential Suite', status: 'Occupied', guest: 'Kapoor Family', nights: '4/5 N', color: 'bg-blue-600 text-white border-blue-700' },
    { num: '204', type: 'Presidential Suite', status: 'Vacant Clean', guest: 'Ready for check-in', nights: '-', color: 'bg-emerald-600 text-white border-emerald-700' },
];

const TABLES = [
    { id: 'T-01', cap: '2 Seater', status: 'Available', order: '-', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
    { id: 'T-02', cap: '4 Seater', status: 'Occupied', order: 'KOT #82 (₹1,840)', color: 'border-blue-300 bg-blue-50 text-blue-900' },
    { id: 'T-03', cap: '4 Seater', status: 'Billed', order: 'Bill Printed (₹2,450)', color: 'border-amber-300 bg-amber-50 text-amber-900' },
    { id: 'T-04', cap: '6 Seater', status: 'Occupied', order: 'KOT #85 (₹3,120)', color: 'border-blue-300 bg-blue-50 text-blue-900' },
    { id: 'T-05', cap: '2 Seater', status: 'Available', order: '-', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
    { id: 'T-06', cap: '8 Seater VIP', status: 'Reserved', order: 'Reserved 8:30 PM', color: 'border-purple-300 bg-purple-50 text-purple-900' },
];

export default function HospitalityAndRestaurant() {
    const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
    const [selectedTable, setSelectedTable] = useState(TABLES[1]);

    return (
        <div id="hospitality" className="pt-16 pb-20 space-y-24">
            {/* ========================================================= */}
            {/* SECTION 23: HotelPmsFeatures                              */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
                        <span>HOTEL PROPERTY MANAGEMENT SYSTEM</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        All-In-One Hotel PMS: Rooms, Folio &amp; OTA Bookings
                    </h2>
                    <p className="mt-4 text-slate-600 text-base sm:text-lg">
                        Manage room inventory, rate plans (EP, CP, MAP, AP), digital guest ID verification,
                        restaurant room-service folio posting, and automated checkout GST billing.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Room Grid Display */}
                    <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Live Front Desk Room Matrix</span>
                                <h3 className="text-lg font-bold text-slate-900">Click Any Room For Folio &amp; Guest Card</h3>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-medium">
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Occupied</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Vacant Clean</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Dirty</span>
                            </div>
                        </div>

                        {/* Room Tiles */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {ROOMS.map((room) => (
                                <button
                                    key={room.num}
                                    type="button"
                                    onClick={() => setSelectedRoom(room)}
                                    className={`p-4 rounded-2xl border text-left transition-all ${
                                        selectedRoom.num === room.num ? 'ring-2 ring-indigo-500 scale-105 shadow-md' : 'opacity-90 hover:opacity-100'
                                    } ${room.color}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-lg">{room.num}</span>
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/20 uppercase">{room.status}</span>
                                    </div>
                                    <div className="text-xs font-medium mt-1 truncate">{room.type}</div>
                                    <div className="text-[11px] mt-2 opacity-90 truncate">{room.guest}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Room Guest & Folio Card */}
                    <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl font-sans">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                            <div>
                                <span className="text-[10px] font-mono text-slate-400 uppercase">Room Details</span>
                                <div className="text-lg font-bold">Room #{selectedRoom.num} — {selectedRoom.type}</div>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30">
                                {selectedRoom.status}
                            </span>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                                <span className="text-slate-400 text-[10px] uppercase font-semibold">Primary Guest</span>
                                <div className="font-bold text-white text-sm">{selectedRoom.guest}</div>
                                <div className="text-slate-400 text-[11px]">Duration: {selectedRoom.nights} • Rate Plan: MAP (Dinner + B'fast)</div>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                                <span className="text-slate-400 text-[10px] uppercase font-semibold">Live Room Folio Charges</span>
                                <div className="flex justify-between text-slate-300 font-mono">
                                    <span>2 Nights Tariff (12% GST):</span>
                                    <span>₹9,000.00</span>
                                </div>
                                <div className="flex justify-between text-slate-300 font-mono">
                                    <span>Restaurant Room Service:</span>
                                    <span>₹1,450.00</span>
                                </div>
                                <div className="flex justify-between text-slate-300 font-mono">
                                    <span>Laundry Service:</span>
                                    <span>₹380.00</span>
                                </div>
                                <div className="pt-2 border-t border-slate-700 flex justify-between font-mono font-bold text-emerald-400">
                                    <span>Current Outstanding:</span>
                                    <span>₹10,830.00</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
                            >
                                Checkout &amp; Generate GST Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 24: RestaurantPosFeatures                         */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                            <span>RESTAURANT, CAFE &amp; BAR POS</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Visual Table Layout, Multi-Kitchen KOT &amp; Item Modifiers
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Speed up dining operations with kitchen order tickets (KOT) printed instantly in the kitchen or sent to a kitchen display system (KDS).
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Floor layout grid */}
                        <div className="lg:col-span-7">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Main Dining Floor (AC Hall)</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {TABLES.map((tbl) => (
                                    <button
                                        key={tbl.id}
                                        type="button"
                                        onClick={() => setSelectedTable(tbl)}
                                        className={`p-4 rounded-2xl border text-left transition-all ${
                                            selectedTable.id === tbl.id ? 'ring-2 ring-indigo-500 shadow-md scale-105' : ''
                                        } ${tbl.color}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-extrabold text-base">{tbl.id}</span>
                                            <span className="text-[10px] font-bold uppercase">{tbl.status}</span>
                                        </div>
                                        <div className="text-[11px] opacity-75 mt-0.5">{tbl.cap}</div>
                                        <div className="text-xs font-semibold mt-2 truncate">{tbl.order}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* KOT & Modifier Preview */}
                        <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs font-mono">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <span className="font-bold text-slate-900 text-sm">Active KOT: {selectedTable.id}</span>
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px]">
                                    KITCHEN STATION 1
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                                    <div className="flex justify-between font-bold text-slate-800">
                                        <span>Paneer Tikka Masala (1)</span>
                                        <span>₹320.00</span>
                                    </div>
                                    <div className="text-[11px] text-indigo-600 font-sans mt-0.5">
                                        👉 Modifier: Less Spicy, Extra Gravy
                                    </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                                    <div className="flex justify-between font-bold text-slate-800">
                                        <span>Butter Garlic Naan (3)</span>
                                        <span>₹210.00</span>
                                    </div>
                                    <div className="text-[11px] text-indigo-600 font-sans mt-0.5">
                                        👉 Modifier: Crispy / Well done
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-sans">
                                <span className="text-slate-500 font-medium">Split Bill By Seat?</span>
                                <div className="flex gap-2">
                                    <button type="button" className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold">
                                        Equal (50/50)
                                    </button>
                                    <button type="button" className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-bold">
                                        Print Final Bill
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
