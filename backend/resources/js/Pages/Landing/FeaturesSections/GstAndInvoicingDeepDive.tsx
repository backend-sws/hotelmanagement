import { useState } from 'react';

interface TemplateOption {
    id: string;
    name: string;
    type: string;
    idealFor: string;
    features: string[];
    accent: string;
}

const TEMPLATES: TemplateOption[] = [
    {
        id: 'standard-gst',
        name: 'Standard Corporate GST (A4)',
        type: 'A4 Full Page',
        idealFor: 'B2B, Distributors, Wholesale & Manufacturers',
        features: ['Govt IRN & Signed QR Code', 'HSN/SAC summary table', 'Bank NEFT/RTGS details with dynamic UPI QR', 'Authorized signatory block with stamp slot'],
        accent: 'border-indigo-500 bg-indigo-50/20',
    },
    {
        id: 'minimal-modern',
        name: 'Modern Minimalist (A4)',
        type: 'A4 Full Page',
        idealFor: 'IT agencies, Consultants, Modern Brands',
        features: ['Sleek sans-serif typography', 'Clean single-table line items', 'Prominent payment terms badge', 'Direct WhatsApp payment hyperlink'],
        accent: 'border-blue-500 bg-blue-50/20',
    },
    {
        id: 'thermal-80',
        name: 'Superfast POS Thermal (3-inch / 80mm)',
        type: 'Thermal Roll',
        idealFor: 'Supermarkets, Apparel, Restaurants & QSR',
        features: ['Auto-cutter compatible ESC/POS format', 'Savings breakdown ("You saved ₹140 today!")', 'Store loyalty reward points balance', 'UPI QR for counter payment'],
        accent: 'border-emerald-500 bg-emerald-50/20',
    },
    {
        id: 'thermal-58',
        name: 'Compact Thermal (2-inch / 58mm)',
        type: 'Thermal Roll',
        idealFor: 'Mobile vans, Bus tickets, Small Kiosks',
        features: ['Ultra-dense itemized summary', 'Works with portable Bluetooth battery printers', 'Quick UPI scan QR', 'No wasteful paper margin'],
        accent: 'border-amber-500 bg-amber-50/20',
    },
    {
        id: 'export-curr',
        name: 'Multi-Currency Export Invoice',
        type: 'A4 Full Page',
        idealFor: 'Exporters, IT Services & Foreign Trade',
        features: ['USD / EUR / GBP / AED conversion', 'Port of loading & Discharge code', 'Letter of Undertaking (LUT) number', 'SWIFT code & Intermediary bank info'],
        accent: 'border-purple-500 bg-purple-50/20',
    },
    {
        id: 'delivery-challan',
        name: 'Delivery Challan & Gate Pass',
        type: 'A4 / Half Page',
        idealFor: 'Job work, Warehouses & Intra-branch transit',
        features: ['Non-tax supply declaration', 'Transporter name & LR number', 'Driver signature & Security check stamp', 'Job work conversion tracking'],
        accent: 'border-slate-500 bg-slate-50/20',
    },
];

export default function GstAndInvoicingDeepDive() {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('standard-gst');
    const [calcTaxable, setCalcTaxable] = useState<number>(10000);
    const [calcRate, setCalcRate] = useState<number>(18);
    const [isInterState, setIsInterState] = useState<boolean>(false);

    // Calculated amounts
    const taxTotal = (calcTaxable * calcRate) / 100;
    const cgst = isInterState ? 0 : taxTotal / 2;
    const sgst = isInterState ? 0 : taxTotal / 2;
    const igst = isInterState ? taxTotal : 0;
    const grandTotal = calcTaxable + taxTotal;

    const currentTpl = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

    return (
        <div id="gst-billing" className="pt-16 pb-20 space-y-24">
            {/* ========================================================= */}
            {/* SECTION 3: GstBillingDeepDive                            */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
                        <span>GST COMPLIANCE ENGINE</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Deep GST Invoicing Without The CA Headache
                    </h2>
                    <p className="mt-4 text-slate-600 text-base sm:text-lg">
                        Handles B2B, B2C, SEZ supplies with/without payment of tax, Deemed Exports, and Reverse Charge (RCM)
                        with automated HSN auto-fill and validation.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left: 4 Core GST Capabilities */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                                    01
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Intra-State vs Inter-State Auto Detection
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                                        NexusBilling checks the customer's Place of Supply (POS) state code against your company's GSTIN.
                                        It automatically splits tax into CGST + SGST for local transactions or applies IGST for inter-state sales.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">CGST (9%) + SGST (9%)</span>
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">IGST (18%) Single Tax</span>
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md">UTGST for Union Territories</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shrink-0">
                                    02
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        15,000+ HSN & SAC Code Smart Directory
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                                        Never search Google for HSN codes again. Start typing any item name ("Cotton Shirt", "CCTV Camera", "Consulting Fee")
                                        and get instant recommendations with exact official GST slabs (0%, 5%, 12%, 18%, 28%).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl shrink-0">
                                    03
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Reverse Charge Mechanism (RCM) & Composition Scheme
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                                        Purchasing from unregistered vendors or transport agencies (GTA)? Nexus flags RCM automatically, creates
                                        self-invoices, and posts liabilities to your GSTR-3B Table 3.1(d) in one click.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0">
                                    04
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        SEZ Supplies, Exports & Zero-Rated Invoicing
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                                        Issue export invoices with Letter of Undertaking (LUT) references or with payment of IGST. Auto-converts foreign currencies
                                        with RBI benchmark exchange rates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Interactive GST Calculator Card */}
                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Live Tax Simulator</span>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-600/30 text-indigo-300 rounded-lg border border-indigo-500/30">
                                    GSTR-1 Ready
                                </span>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Taxable Base Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={calcTaxable}
                                        onChange={(e) => setCalcTaxable(Number(e.target.value) || 0)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">GST Slab Rate</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[0, 5, 12, 18, 28].map((rate) => (
                                            <button
                                                key={rate}
                                                type="button"
                                                onClick={() => setCalcRate(rate)}
                                                className={`py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                                                    calcRate === rate
                                                        ? 'bg-indigo-600 text-white shadow-md'
                                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                                }`}
                                            >
                                                {rate}%
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Place of Supply (POS)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsInterState(false)}
                                            className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                                                !isInterState
                                                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                                                    : 'bg-slate-800 border-slate-700 text-slate-400'
                                            }`}
                                        >
                                            Intra-State (Same State)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsInterState(true)}
                                            className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                                                isInterState
                                                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                                                    : 'bg-slate-800 border-slate-700 text-slate-400'
                                            }`}
                                        >
                                            Inter-State (Outside State)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tax Breakdown Result Box */}
                            <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5 font-mono text-xs">
                                <div className="flex justify-between text-slate-400">
                                    <span>Taxable Value:</span>
                                    <span>₹{calcTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                {!isInterState ? (
                                    <>
                                        <div className="flex justify-between text-slate-300">
                                            <span>CGST ({(calcRate / 2).toFixed(1)}%):</span>
                                            <span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-300">
                                            <span>SGST ({(calcRate / 2).toFixed(1)}%):</span>
                                            <span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between text-indigo-300">
                                        <span>IGST ({calcRate}%):</span>
                                        <span>₹{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-slate-700/80 flex justify-between text-sm font-bold text-emerald-400">
                                    <span>Grand Total:</span>
                                    <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 4: EInvoiceSection                                */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-800/40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                                <span>GOVT IRP / NIC PORTAL INTEGRATION</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                1-Click E-Invoicing With Digitally Signed IRN & QR
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Nexus connects directly to the official GST Invoice Registration Portal (IRP/NIC) using high-speed encrypted APIs.
                                The moment an invoice is created, its 64-character hash (IRN) and digitally signed QR code are stamped automatically onto the invoice.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700">
                                    <div className="text-emerald-400 font-bold text-lg">0.8 Seconds</div>
                                    <div className="text-xs text-slate-400 mt-1">Average IRN roundtrip API generation time</div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700">
                                    <div className="text-blue-400 font-bold text-lg">100% Valid</div>
                                    <div className="text-xs text-slate-400 mt-1">Govt signed QR code verified by tax officers</div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700">
                                    <div className="text-purple-400 font-bold text-lg">Auto-Cancel</div>
                                    <div className="text-xs text-slate-400 mt-1">Cancel within 24 hours with govt reason codes</div>
                                </div>
                            </div>
                        </div>

                        {/* Visual IRN Token Card */}
                        <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">IRP Response Payload</span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                                    STATUS: ACTIVE (200 OK)
                                </span>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Invoice Ref Number (IRN)</span>
                                    <p className="font-mono font-medium text-slate-800 break-all bg-slate-100 p-2 rounded-lg mt-0.5 border border-slate-200 text-[11px]">
                                        4a8f9c1b3e8d2e0f1234567890abcdef1234567890abcdef1234567890abcdef
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 font-mono">
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ack No</span>
                                        <span className="font-bold text-slate-800">122410884920</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ack Date</span>
                                        <span className="font-bold text-slate-800">2026-09-18 10:14:22</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                                    <div className="text-[11px] text-slate-600">
                                        <span className="font-bold text-emerald-600">✓ Signed QR Code</span> embedded on PDF
                                    </div>
                                    <div className="w-12 h-12 bg-slate-900 rounded-lg p-1 flex items-center justify-center">
                                        {/* Mock QR SVG */}
                                        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm2 3h3v2h-3v-2zm3 2h3v3h-3v-3zm-5 1h2v2h-2v-2zm2 0h1v2h-1v-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 5: EWayBillSection                                */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                            <span>E-WAY BILL AUTOMATION</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Auto E-Way Bill Generation Directly From Invoices
                        </h2>
                        <p className="mt-3 text-slate-600 text-base sm:text-lg">
                            When invoice value exceeds ₹50,000 (or state-specific threshold), Nexus prompts to generate an e-Way Bill in one click,
                            without re-entering items, weights, or GST details.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-4">
                                A
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Part-A: Consignor & Consignee</h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                Auto-populated from your invoice. Includes GSTIN, dispatch address, pin codes, HSN summaries, and calculated taxable value.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-4">
                                B
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Part-B: Vehicle & Transporter</h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                Enter Transporter ID (TRANSIN) or Vehicle Number (e.g. MH-12-AB-1234). Update vehicle numbers in transit if breakdown occurs.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-4">
                                C
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Multi-Vehicle & Consolidated</h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                Splitting a large consignment into multiple trucks? Generate consolidated e-Way bills or multi-vehicle consignment notes effortlessly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 6: InvoiceTemplateGallery                         */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
                        <span>INVOICE DESIGN STUDIO</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        8 Professional Invoice Templates Built For High Trust
                    </h2>
                    <p className="mt-3 text-slate-600 text-base">
                        Customize your brand logo, color accents, terms and conditions, bank payment details, and UPI QR codes.
                    </p>
                </div>

                {/* Interactive Template Selector */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Template list buttons */}
                    <div className="lg:col-span-5 space-y-3">
                        {TEMPLATES.map((tpl) => (
                            <button
                                key={tpl.id}
                                type="button"
                                onClick={() => setSelectedTemplate(tpl.id)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                    selectedTemplate === tpl.id
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                        : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm">{tpl.name}</span>
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                                            selectedTemplate === tpl.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        {tpl.type}
                                    </span>
                                </div>
                                <p
                                    className={`mt-1 text-xs ${
                                        selectedTemplate === tpl.id ? 'text-indigo-100' : 'text-slate-500'
                                    }`}
                                >
                                    Ideal for: {tpl.idealFor}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Live Preview Card */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-xl">
                        <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Template Preview</span>
                                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{currentTpl.name}</h3>
                            </div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                                Ready to Print & PDF
                            </span>
                        </div>

                        {/* Mockup Invoice Container */}
                        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs font-mono">
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                                <div>
                                    <div className="font-bold text-sm text-slate-900">ACME ENTERPRISES PVT LTD</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">GSTIN: 27AAAAA0000A1Z5</div>
                                    <div className="text-[11px] text-slate-500">Andheri East, Mumbai, Maharashtra 400069</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-indigo-600">TAX INVOICE</div>
                                    <div className="text-[11px] text-slate-700 font-semibold">INV-2026-0842</div>
                                    <div className="text-[10px] text-slate-500">Date: 18 Sep 2026</div>
                                </div>
                            </div>

                            {/* Bill To */}
                            <div className="grid grid-cols-2 gap-4 text-[11px]">
                                <div>
                                    <span className="font-bold text-slate-700 uppercase text-[10px]">Billed To:</span>
                                    <div className="font-semibold text-slate-900">Global Tech Solutions LLP</div>
                                    <div className="text-slate-500">GSTIN: 24BBBBB1111B1Z2 (Gujarat - 24)</div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-slate-700 uppercase text-[10px]">Place of Supply:</span>
                                    <div className="font-semibold text-slate-900">Gujarat (24)</div>
                                    <div className="text-indigo-600 font-semibold">Supply Type: Inter-State (IGST)</div>
                                </div>
                            </div>

                            {/* Items Table Mock */}
                            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                                <div className="grid grid-cols-12 bg-slate-100 p-2 font-bold text-[10px] text-slate-700 border-b border-slate-200">
                                    <div className="col-span-6">Item Description</div>
                                    <div className="col-span-2 text-center">HSN</div>
                                    <div className="col-span-2 text-right">Qty</div>
                                    <div className="col-span-2 text-right">Amount (₹)</div>
                                </div>
                                <div className="grid grid-cols-12 p-2 text-[11px] text-slate-800 border-b border-slate-100">
                                    <div className="col-span-6 font-medium">Enterprise Cloud Billing License</div>
                                    <div className="col-span-2 text-center text-slate-500">998313</div>
                                    <div className="col-span-2 text-right">1 Yr</div>
                                    <div className="col-span-2 text-right font-semibold">18,000.00</div>
                                </div>
                                <div className="grid grid-cols-12 p-2 text-[11px] text-slate-800">
                                    <div className="col-span-6 font-medium">WhatsApp Notification Cloud Bundle</div>
                                    <div className="col-span-2 text-center text-slate-500">998414</div>
                                    <div className="col-span-2 text-right">10K</div>
                                    <div className="col-span-2 text-right font-semibold">2,000.00</div>
                                </div>
                            </div>

                            {/* Total and Bank Info */}
                            <div className="flex justify-between items-end pt-2">
                                <div className="text-[10px] text-slate-500 space-y-0.5">
                                    <div className="font-semibold text-slate-700">Bank: HDFC Bank Ltd | A/C: 50200012345678</div>
                                    <div>IFSC: HDFC0000123 | UPI: acme@hdfcbank</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-slate-500 text-[10px]">IGST (18%): ₹3,600.00</div>
                                    <div className="text-sm font-bold text-slate-900">Total: ₹23,600.00</div>
                                </div>
                            </div>
                        </div>

                        {/* Key template features */}
                        <div className="mt-6 pt-4 border-t border-slate-200">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Highlights</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {currentTpl.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                                        <span className="text-emerald-500 font-bold">✓</span>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
