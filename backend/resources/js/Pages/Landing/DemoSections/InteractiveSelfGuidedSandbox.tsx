import React, { useState } from 'react';

interface CartItem {
    id: string;
    name: string;
    qty: number;
    price: number;
    gstRate: number;
    hsn: string;
}

export default function InteractiveSelfGuidedSandbox() {
    const sampleProducts = [
        { id: '1', name: 'Alphonso Mango Box (3kg)', price: 1200, gstRate: 5, hsn: '0804' },
        { id: '2', name: 'Voltas Inverter AC Compressor', price: 8500, gstRate: 28, hsn: '8415' },
        { id: '3', name: 'Raymond Cotton Shirting 58-inch', price: 650, gstRate: 5, hsn: '5208' }
    ];

    const [cart, setCart] = useState<CartItem[]>([
        { id: '1', name: 'Alphonso Mango Box (3kg)', qty: 2, price: 1200, gstRate: 5, hsn: '0804' }
    ]);

    const [generatingIrn, setGeneratingIrn] = useState(false);
    const [generatedIrn, setGeneratedIrn] = useState<string | null>(null);
    const [showBillPreview, setShowBillPreview] = useState(false);

    const addToCart = (prod: typeof sampleProducts[0]) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === prod.id);
            if (existing) {
                return prev.map(item => item.id === prod.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...prod, qty: 1 }];
        });
        setGeneratedIrn(null);
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const totalGst = cart.reduce((acc, item) => acc + (item.price * item.qty * (item.gstRate / 100)), 0);
    const grandTotal = Math.round(subtotal + totalGst);

    const handleTriggerIrn = () => {
        setGeneratingIrn(true);
        setTimeout(() => {
            setGeneratingIrn(false);
            setGeneratedIrn("4a8c6f7823b190e4f5a6b7c8d9e0123456789abcdef0123456789abcdef01234");
            setShowBillPreview(true);
        }, 350);
    };

    return (
        <section id="self-guided-sandbox" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* S-11: Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-300">
                        Zero Waiting Time
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Test Drive the Nexus POS &amp; E-Invoicing Engine Live
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Add items to the live register below, calculate multi-rate GST, generate an authenticated NIC IRP 64-character IRN, and preview the instant WhatsApp payment bill.
                    </p>
                </div>

                {/* Sandbox Workstation Frame */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left: Product Picker & Counter Cart */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <h3 className="font-black text-slate-900 text-sm">Active POS Register (Counter 01)</h3>
                            </div>
                            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                100% Cloud Synced
                            </span>
                        </div>

                        {/* Quick Item Addition Chips */}
                        <div>
                            <span className="text-xs font-bold text-slate-500 mb-2 block">Quick Scan Barcode Item:</span>
                            <div className="flex flex-wrap gap-2">
                                {sampleProducts.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => addToCart(p)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1.5"
                                    >
                                        <span>+</span>
                                        <span>{p.name}</span>
                                        <span className="text-slate-400 font-mono text-[10px]">₹{p.price}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cart Table */}
                        <div className="overflow-x-auto bg-slate-50 rounded-2xl p-4 border border-slate-200">
                            <table className="w-full text-xs text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500">
                                        <th className="pb-2">Item Description</th>
                                        <th className="pb-2">HSN</th>
                                        <th className="pb-2">Qty</th>
                                        <th className="pb-2">Tax Rate</th>
                                        <th className="pb-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cart.map(item => (
                                        <tr key={item.id}>
                                            <td className="py-2.5 font-bold text-slate-900">{item.name}</td>
                                            <td className="py-2.5 font-mono text-slate-500">{item.hsn}</td>
                                            <td className="py-2.5 font-mono font-bold text-blue-600">{item.qty}</td>
                                            <td className="py-2.5">{item.gstRate}%</td>
                                            <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                                                ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Calculation Summary & S-13 IRN Trigger */}
                        <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div>
                                <div className="text-slate-500">Subtotal: <span className="font-mono font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span></div>
                                <div className="text-slate-500">CGST + SGST: <span className="font-mono font-bold text-slate-800">₹{totalGst.toLocaleString('en-IN')}</span></div>
                                <div className="text-sm font-black text-slate-900 mt-0.5">
                                    Grand Total: <span className="font-mono text-emerald-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleTriggerIrn}
                                disabled={generatingIrn || cart.length === 0}
                                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
                            >
                                {generatingIrn ? 'Generating IRN...' : '⚡ Generate IRN & Bill'}
                            </button>
                        </div>

                        {/* Generated IRN Notification */}
                        {generatedIrn && (
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-emerald-900">✓ NIC IRP Authentication Success (&lt;180ms)</span>
                                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">ACK: 142618992019</span>
                                </div>
                                <div className="font-mono text-[10px] text-slate-600 break-all pt-1">
                                    <strong>IRN:</strong> {generatedIrn}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Thermal Bill & WhatsApp Simulation Preview */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Thermal Bill Preview */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-md font-mono text-[11px] text-slate-800 space-y-2 max-w-xs mx-auto">
                            <div className="text-center pb-2 border-b border-dashed border-slate-300">
                                <div className="font-black text-xs">PATEL SUPERMARKET &amp; FMCG</div>
                                <div className="text-[10px] text-slate-500">GSTIN: 27AAAAA0000A1Z5</div>
                                <div className="text-[10px] text-slate-500">Tel: +91 747 949 9718</div>
                            </div>

                            <div className="flex justify-between text-[10px] text-slate-500">
                                <span>BILL NO: #INV-26-8891</span>
                                <span>18-09-2026</span>
                            </div>

                            <div className="py-2 border-y border-dashed border-slate-300 space-y-1">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between">
                                        <span className="truncate max-w-[140px]">{item.name} x{item.qty}</span>
                                        <span>₹{(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between font-bold text-xs pt-1">
                                <span>NET PAYABLE:</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>

                            {/* Signed QR Code Placeholder */}
                            <div className="pt-2 text-center border-t border-dashed border-slate-300">
                                <div className="w-20 h-20 bg-slate-950 text-white rounded-lg mx-auto flex items-center justify-center text-xs font-sans font-bold">
                                    IRN QR
                                </div>
                                <div className="text-[9px] text-slate-400 mt-1">Government Signed QR Code</div>
                            </div>
                        </div>

                        {/* S-14: Instant WhatsApp Delivery Badge */}
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                            <span className="text-2xl">📲</span>
                            <div>
                                <div className="font-bold">WhatsApp Invoice Triggered</div>
                                <p className="text-[11px] text-emerald-700">Digital PDF receipt + 1-tap UPI link delivered in 1.2s</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
