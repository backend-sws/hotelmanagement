import React, { useState } from 'react';
import { 
    Warehouse, 
    Layers, 
    CalendarClock, 
    AlertTriangle, 
    QrCode, 
    Smartphone, 
    CheckCircle2, 
    Truck, 
    ClipboardCheck, 
    Receipt, 
    RotateCcw, 
    ArrowRightLeft, 
    Search, 
    Tag, 
    ShieldCheck, 
    Box, 
    Building2,
    Clock,
    DollarSign,
    Sparkles
} from 'lucide-react';

export const InventoryAndVariants: React.FC = () => {
    // S-12: Godown Transfer Simulator
    const [selectedGodownItem, setSelectedGodownItem] = useState('Basmati Rice 5kg');
    const [transferQty, setTransferQty] = useState(20);
    const [transferSuccess, setTransferSuccess] = useState(false);

    const godownStock = [
        { name: 'Basmati Rice 5kg', godown: 180, shelf: 14, min: 20 },
        { name: 'Cold Pressed Mustard Oil 1L', godown: 95, shelf: 8, min: 15 },
        { name: 'Organic Rolled Oats 1kg', godown: 120, shelf: 5, min: 12 },
        { name: 'Almond Kernels 500g', godown: 64, shelf: 9, min: 10 },
    ];

    const handleTransfer = () => {
        setTransferSuccess(true);
        setTimeout(() => setTransferSuccess(false), 3000);
    };

    // S-14: Apparel Matrix state
    const [selectedColor, setSelectedColor] = useState('Navy Blue');
    const [selectedSize, setSelectedSize] = useState('L');
    const colors = ['Navy Blue', 'Olive Green', 'Jet Black', 'Crimson Red'];
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const matrixData: Record<string, Record<string, { stock: number; sku: string; price: number }>> = {
        'Navy Blue': {
            'S': { stock: 12, sku: 'APP-NB-01-S', price: 999 },
            'M': { stock: 24, sku: 'APP-NB-01-M', price: 999 },
            'L': { stock: 18, sku: 'APP-NB-01-L', price: 999 },
            'XL': { stock: 8, sku: 'APP-NB-01-XL', price: 1099 },
            'XXL': { stock: 3, sku: 'APP-NB-01-XXL', price: 1099 },
        },
        'Olive Green': {
            'S': { stock: 6, sku: 'APP-OG-02-S', price: 999 },
            'M': { stock: 15, sku: 'APP-OG-02-M', price: 999 },
            'L': { stock: 22, sku: 'APP-OG-02-L', price: 999 },
            'XL': { stock: 11, sku: 'APP-OG-02-XL', price: 1099 },
            'XXL': { stock: 2, sku: 'APP-OG-02-XXL', price: 1099 },
        },
        'Jet Black': {
            'S': { stock: 30, sku: 'APP-JB-03-S', price: 999 },
            'M': { stock: 42, sku: 'APP-JB-03-M', price: 999 },
            'L': { stock: 35, sku: 'APP-JB-03-L', price: 999 },
            'XL': { stock: 19, sku: 'APP-JB-03-XL', price: 1099 },
            'XXL': { stock: 7, sku: 'APP-JB-03-XXL', price: 1099 },
        },
        'Crimson Red': {
            'S': { stock: 4, sku: 'APP-CR-04-S', price: 999 },
            'M': { stock: 9, sku: 'APP-CR-04-M', price: 999 },
            'L': { stock: 14, sku: 'APP-CR-04-L', price: 999 },
            'XL': { stock: 5, sku: 'APP-CR-04-XL', price: 1099 },
            'XXL': { stock: 0, sku: 'APP-CR-04-XXL', price: 1099 },
        },
    };

    // S-15: Serial/IMEI Lookup
    const [imeiQuery, setImeiQuery] = useState('864293049104821');
    const [imeiResult, setImeiResult] = useState({
        device: 'Samsung Galaxy A55 5G (Awesome Iceblue, 128GB)',
        imei1: '864293049104821',
        imei2: '864293049104822',
        serial: 'R58N40P921Z',
        supplier: 'Salasar Infotech Mumbai',
        purchaseDate: '14-Aug-2025',
        status: 'In Stock (Floor Display)',
        warrantyRemaining: '365 Days Brand Warranty',
    });

    return (
        <div className="bg-white">
            {/* S-12: Inventory & Godown Sync */}
            <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 rounded-full border border-emerald-200">
                            WAREHOUSE &amp; GODOWN SYNC
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Front Shelf vs Backroom Godown Sync
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Never lose a sale to an empty aisle. Nexus tracks floor stock separately from secondary godowns, automatically triggering replenishment slips when display shelves run low.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                                        <Warehouse className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Multi-Location Stock Isolation</h3>
                                        <p className="text-xs text-slate-500">Retail counter, Basement godown, Bulk warehouse</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Cashiers only see front-store ready stock to avoid billing unverified pallets, while inventory managers get consolidated stock valuation across all store vaults.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                                        <ArrowRightLeft className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">1-Click Shelf Indent &amp; Transfer</h3>
                                        <p className="text-xs text-slate-500">Barcode verified transfer pass with digital signoff</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Floor supervisors scan low-stock shelf barcodes on mobile, generating instant picklists for godown boys with bay and rack coordinates.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Smart Min-Max Buffer Alerts</h3>
                                        <p className="text-xs text-slate-500">Based on past 14-day velocity and seasonality</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Automatic WhatsApp &amp; push warnings when shelf levels dip below safety stock before the evening rush hour strikes.
                                </p>
                            </div>
                        </div>

                        {/* Interactive Godown Simulator */}
                        <div className="lg:col-span-7">
                            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live Inventory Split Simulator</span>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg text-emerald-400 border border-slate-700">
                                        Bay: Aisle 4-B
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {godownStock.map((item, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => setSelectedGodownItem(item.name)}
                                            className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                                                selectedGodownItem === item.name 
                                                    ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg' 
                                                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70'
                                            }`}
                                        >
                                            <div>
                                                <div className="font-bold text-white text-sm">{item.name}</div>
                                                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                                    <span>Shelf Min: {item.min} units</span>
                                                    {item.shelf < item.min && (
                                                        <span className="text-amber-400 font-medium">⚠️ Low on Shelf!</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs font-mono">
                                                <div className="text-right">
                                                    <div className="text-slate-400">Shelf Aisle</div>
                                                    <div className={`font-bold ${item.shelf < item.min ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                        {item.shelf} units
                                                    </div>
                                                </div>
                                                <div className="w-px h-7 bg-slate-700" />
                                                <div className="text-right">
                                                    <div className="text-slate-400">Back Godown</div>
                                                    <div className="font-bold text-blue-400">{item.godown} units</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
                                    <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
                                        <span>Transfer from Godown to Display Shelf: <strong className="text-white">{selectedGodownItem}</strong></span>
                                        <span className="text-emerald-400">Available: 180</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="number"
                                            value={transferQty}
                                            onChange={(e) => setTransferQty(Number(e.target.value))}
                                            className="w-24 bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm text-center font-bold focus:outline-none focus:border-emerald-500"
                                        />
                                        <button 
                                            onClick={handleTransfer}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2"
                                        >
                                            <ArrowRightLeft className="w-4 h-4" />
                                            Generate Replenishment Voucher
                                        </button>
                                    </div>

                                    {transferSuccess && (
                                        <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>Transfer pass #TRN-8941 dispatched to Godown Bay 2. Shelf updated instantly.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-13: Batch & Expiry Alerts (FEFO / FIFO Engine) */}
            <section className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100/80 rounded-full border border-rose-200">
                            SMART FEFO ENGINE
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Batch &amp; Expiry Control with Zero Dump Loss
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            First-Expiry-First-Out (FEFO) automated enforcement. Nexus blocks expired goods at checkout while alerting floor teams 45 days in advance for flash discount clearance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Radar Alert 1 */}
                        <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                                Critical (&lt; 15 Days)
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 mb-4">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Amul Taaza Milk 500ml</h3>
                            <p className="text-xs text-slate-500 font-mono mt-1">Batch: B-2025-0812 | Stock: 42 pkts</p>
                            
                            <div className="mt-4 p-3 bg-white rounded-xl border border-rose-200 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Expiry Date:</span>
                                    <span className="font-bold text-rose-700">22-Sep-2025 (4 Days)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Automated Action:</span>
                                    <span className="font-semibold text-rose-800">Auto 30% Flash Markdown</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                                System auto-prints promotional flash clearance barcode labels so inventory is liquidated before turning into dead loss.
                            </p>
                        </div>

                        {/* Radar Alert 2 */}
                        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white">
                                Warning (&lt; 45 Days)
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                                <CalendarClock className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Dettol Antiseptic 250ml</h3>
                            <p className="text-xs text-slate-500 font-mono mt-1">Batch: DT-8891 | Stock: 110 units</p>
                            
                            <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Expiry Date:</span>
                                    <span className="font-bold text-amber-700">18-Oct-2025 (30 Days)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Supplier Agreement:</span>
                                    <span className="font-semibold text-amber-800">Eligible for Vendor Return</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                                1-click generation of supplier debit note return pass before supplier 30-day return policy deadline expires.
                            </p>
                        </div>

                        {/* Radar Alert 3 */}
                        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                                Healthy FEFO Safe
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Tata Tea Gold 500g</h3>
                            <p className="text-xs text-slate-500 font-mono mt-1">Batch: TTG-9022 | Stock: 240 units</p>
                            
                            <div className="mt-4 p-3 bg-white rounded-xl border border-emerald-200 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Expiry Date:</span>
                                    <span className="font-bold text-emerald-700">15-Aug-2026 (330 Days)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">FEFO Queue:</span>
                                    <span className="font-semibold text-emerald-800">Rank #4 in Rotation</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                                Kept in secondary godown while older batches are dispatched first to floor racks to ensure optimal stock freshness.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-14: Apparel Size & Color 2D Matrix */}
            <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 rounded-full border border-indigo-200">
                            APPAREL &amp; FOOTWEAR MATRIX
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Interactive Size × Color 2D Variant Matrix
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Tired of creating 25 separate items for one T-shirt? Nexus generates individual barcodes, distinct pricing, and real-time inventory for every size-color permutation in seconds.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                    Style Master #POLO-1002
                                </span>
                                <h3 className="text-2xl font-bold text-slate-900 mt-2">Men's Premium Combed Cotton Polo</h3>
                                <p className="text-xs text-slate-500 mt-1">HSN 6105 | GST 5% | Brand: Arrow Classic</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl text-xs transition flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Print 48 Matrix Barcode Labels
                                </button>
                                <button className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl text-xs transition">
                                    Quick GRN Inward
                                </button>
                            </div>
                        </div>

                        {/* Interactive Matrix Selector */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                            <div className="lg:col-span-8">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                                    Live Matrix Inventory Grid (Click cell to inspect SKU &amp; Barcode)
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold">
                                                <th className="py-3 px-4 bg-slate-50 rounded-tl-xl">Color Shades</th>
                                                {sizes.map((s) => (
                                                    <th key={s} className="py-3 px-4 text-center bg-slate-50 font-bold text-slate-700">
                                                        {s}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {colors.map((color) => (
                                                <tr key={color} className="hover:bg-slate-50/50 transition">
                                                    <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                                                        <span 
                                                            className={`w-3.5 h-3.5 rounded-full border border-slate-300 ${
                                                                color === 'Navy Blue' ? 'bg-blue-900' :
                                                                color === 'Olive Green' ? 'bg-emerald-800' :
                                                                color === 'Jet Black' ? 'bg-black' : 'bg-red-700'
                                                            }`} 
                                                        />
                                                        {color}
                                                    </td>
                                                    {sizes.map((size) => {
                                                        const cell = matrixData[color][size];
                                                        const isSelected = selectedColor === color && selectedSize === size;
                                                        return (
                                                            <td key={size} className="py-3 px-2 text-center">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedColor(color);
                                                                        setSelectedSize(size);
                                                                    }}
                                                                    className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                                                                        isSelected
                                                                            ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                                                                            : cell.stock === 0
                                                                            ? 'bg-rose-50 text-rose-500 border border-rose-200/60'
                                                                            : cell.stock < 5
                                                                            ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                                                    }`}
                                                                >
                                                                    <span>{cell.stock} pcs</span>
                                                                    <span className="text-[10px] opacity-80">₹{cell.price}</span>
                                                                </button>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Inspected SKU Box */}
                            <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                                        <span className="text-xs font-mono text-slate-400">Variant Barcode Tag</span>
                                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded">
                                            POS Active
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-xs text-slate-400">Selected Permutation</div>
                                            <div className="text-base font-bold text-white mt-0.5">
                                                {selectedColor} &bull; Size {selectedSize}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-slate-400">SKU Code</div>
                                            <div className="text-sm font-mono font-bold text-indigo-400 mt-0.5">
                                                {matrixData[selectedColor][selectedSize].sku}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <div className="bg-slate-800/80 p-3 rounded-xl">
                                                <div className="text-[11px] text-slate-400">Store Stock</div>
                                                <div className="text-lg font-bold text-white font-mono">
                                                    {matrixData[selectedColor][selectedSize].stock} units
                                                </div>
                                            </div>
                                            <div className="bg-slate-800/80 p-3 rounded-xl">
                                                <div className="text-[11px] text-slate-400">MRP / Tag</div>
                                                <div className="text-lg font-bold text-emerald-400 font-mono">
                                                    ₹{matrixData[selectedColor][selectedSize].price}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Barcode visual preview */}
                                        <div className="pt-4 text-center bg-white text-slate-900 p-4 rounded-xl mt-2">
                                            <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">
                                                NEXUS RETAIL APPAREL
                                            </div>
                                            {/* Barcode pattern dummy lines */}
                                            <div className="h-10 flex items-center justify-center gap-0.5 my-1">
                                                {[3,1,2,4,1,3,2,1,4,2,3,1,2,4,1,2,3,4,1,2,3,1,4,2,3].map((w, i) => (
                                                    <div 
                                                        key={i} 
                                                        className="bg-black h-full" 
                                                        style={{ width: `${w * 1.5}px` }} 
                                                    />
                                                ))}
                                            </div>
                                            <div className="font-mono text-xs font-bold tracking-widest mt-1">
                                                8901048{matrixData[selectedColor][selectedSize].stock}991
                                            </div>
                                            <div className="text-[10px] font-semibold text-slate-700 mt-0.5">
                                                {selectedColor} - {selectedSize} | ₹{matrixData[selectedColor][selectedSize].price}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition">
                                    Instant Add to POS Counter Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-15: Serial & Dual IMEI Tracking */}
            <section className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 rounded-full border border-amber-200">
                            IMEI &amp; SERIAL TRACKER
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Dual IMEI &amp; Serial Number Lifecycle
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            For smartphone showrooms and consumer electronics stores. Capture primary and secondary IMEI on inward GRN, print on customer invoices, and track warranty claims effortlessly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Dual IMEI Auto-Scan</h3>
                                        <p className="text-xs text-slate-500">Scan box 2D QR to capture both IMEI-1 &amp; IMEI-2</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    No tedious 15-digit manual typing. Compatible with Samsung, Apple, Xiaomi, Vivo, and Oppo manufacturer box labels.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Brand Warranty &amp; Invoice Printing</h3>
                                        <p className="text-xs text-slate-500">Mandatory for OEM service center claims</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    IMEI numbers are hard-printed on thermal receipts and PDF invoices with activation timestamps, eliminating customer disputes at service centers.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                                        <RotateCcw className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">DOA &amp; Defective Unit Replacement</h3>
                                        <p className="text-xs text-slate-500">Dead-On-Arrival distributor claim workflow</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Tag defective handsets as DOA to instantly isolate them from salable stock and auto-generate distributor replacement claims.
                                </p>
                            </div>
                        </div>

                        {/* Interactive IMEI Simulator */}
                        <div className="lg:col-span-7">
                            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live IMEI Warranty Registry</span>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg text-amber-400 border border-slate-700">
                                        Device Status: Active
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-semibold text-slate-400 mb-2">
                                        Scan or Type 15-Digit Device IMEI / Serial Number:
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            value={imeiQuery}
                                            onChange={(e) => setImeiQuery(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-4 pr-12 py-3 text-sm font-mono font-bold focus:outline-none focus:border-amber-500"
                                        />
                                        <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
                                    </div>
                                </div>

                                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-4">
                                    <div className="flex items-start justify-between border-b border-slate-700 pb-4">
                                        <div>
                                            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Device Model Verified</div>
                                            <div className="text-base font-bold text-white mt-1">{imeiResult.device}</div>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-800">
                                            {imeiResult.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="text-slate-400">Primary IMEI-1:</span>
                                            <p className="font-mono font-bold text-slate-200 mt-0.5">{imeiResult.imei1}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Secondary IMEI-2:</span>
                                            <p className="font-mono font-bold text-slate-200 mt-0.5">{imeiResult.imei2}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Distributor GRN Inward:</span>
                                            <p className="font-semibold text-slate-200 mt-0.5">{imeiResult.supplier}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Store Inward Date:</span>
                                            <p className="font-semibold text-slate-200 mt-0.5">{imeiResult.purchaseDate}</p>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                            <span className="text-slate-300">Warranty Coverage:</span>
                                        </div>
                                        <span className="font-bold text-emerald-400">{imeiResult.warrantyRemaining}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-16 & S-17: Purchase GRN & Vendor Debit Notes */}
            <section className="py-20 bg-slate-50/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/80 rounded-full border border-cyan-200">
                            PURCHASE &amp; GRN AUDIT
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Purchase Order to Physical GRN with Landed Costing
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Stop supplier over-billing and missing cartons. Verify delivered items against physical count before booking invoices, with automated debit notes for damages.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* S-16: GRN Inward Verification */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700">
                                    <ClipboardCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Goods Receipt Note (GRN) Inward</h3>
                                    <p className="text-xs text-slate-500">PO vs Supplier Invoice vs Physical Box Verification</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm text-slate-600">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                                    <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-800">
                                        Step 1: Physical Barcode Receiving
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Warehouse unloader scans each outer box barcode. Discrepancy between PO quantity and physical arrival is flagged on screen instantly.
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                                    <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-800">
                                        Step 2: Landed Costing Calculator
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Incorporate freight charges, unloading labor, insurance, and cess directly into item cost price for 100% accurate gross profit reporting.
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                                    <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-800">
                                        Step 3: Instant Barcode Roll Printing
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Trigger batch label printing for newly received stock directly from the approved GRN with custom store selling price (SSP) stickers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* S-17: Vendor Debit Notes & Purchase Returns */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
                                    <Receipt className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Vendor Ledgers &amp; Debit Notes</h3>
                                    <p className="text-xs text-slate-500">Damage Claims, Short Supply &amp; GST ITC Reversal</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm text-slate-600">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                                    <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-purple-800">
                                        Automated GST ITC Reversal
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        When a debit note is issued for broken bottles or expired medicines, Nexus automatically reverses the claimed Input Tax Credit in GSTR-3B Table 4(B).
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                                    <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-purple-800">
                                        Supplier Payment Aging (30/60/90 Days)
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Track outstanding supplier payables, prioritize cash discounts (CD) offered for 7-day payment settlement, and prevent duplicate cheque payments.
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                                    <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-purple-800">
                                        Supplier Scorecard &amp; Fill-Rate
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Measure vendor fulfillment reliability: PO fulfillment %, average delivery delay days, and percentage of damaged cartons received.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
