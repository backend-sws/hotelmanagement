import AnimatedSection from '@/Components/Site/AnimatedSection';

export default function DeepDivesSection() {
    return (
        <section className="py-24 relative bg-slate-50/70 border-t border-slate-200 overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-100/60 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-emerald-100/60 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 relative z-10">
                {/* S-08: InvoicingDeepDive */}
                <AnimatedSection direction="up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                                Zero-Friction Compliance
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                Create IRN e-Invoices in seconds, not hours
                            </h2>
                            <p className="text-slate-600 text-base leading-relaxed mb-8">
                                Never stress over GST notices again. Our system directly validates tax rates, HSNSAC codes, and state supply rules before submitting directly to the NIC portal.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { title: '1-Click NIC e-Invoice & e-Way Bill', desc: 'Auto-generate 64-character IRN and signed QR code directly on save.' },
                                    { title: 'Flexible Formats: A4, A5 & Thermal', desc: 'Customizable logo, bank details, terms, UPI QR code, and signatures.' },
                                    { title: 'Multi-GSTIN & Branch Management', desc: 'Run separate billing series for multiple GST numbers under one company.' },
                                    { title: 'Automated Tax Split (CGST + SGST / IGST)', desc: 'Intelligently determines intra-state vs inter-state tax liability.' }
                                ].map((bullet, i) => (
                                    <div key={i} className="flex items-start gap-3.5">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">
                                            ✓
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">{bullet.title}</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">{bullet.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Invoice Mockup Graphic — Realistic Crisp White Paper */}
                        <div className="lg:col-span-6">
                            <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xl shadow-slate-300/50 relative">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                                            NB
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">TAX INVOICE</h4>
                                            <p className="text-[10px] text-slate-500 font-mono">IRN: 8a7c1b89e4...f13a0c</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">e-Invoice Verified</span>
                                        <p className="text-[10px] text-slate-500 mt-1 font-medium">Date: 18 Sep 2026</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-bold">BILLED TO</p>
                                        <p className="font-bold text-slate-900">Shree Ganesh Enterprises</p>
                                        <p className="text-slate-600 text-[11px]">GSTIN: 27AAAAA0000A1Z5</p>
                                        <p className="text-slate-600 text-[11px]">Mumbai, Maharashtra (27)</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-[10px] font-bold">SUPPLIER</p>
                                        <p className="font-bold text-slate-900">Nexus Tech SaaS Pvt Ltd</p>
                                        <p className="text-slate-600 text-[11px]">GSTIN: 07BBBBB1111B2Z8</p>
                                        <p className="text-slate-600 text-[11px]">New Delhi (07)</p>
                                    </div>
                                </div>

                                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs mb-4">
                                    <div className="grid grid-cols-12 bg-slate-100/80 p-2.5 font-bold text-slate-700 text-[11px]">
                                        <span className="col-span-6">Item Description</span>
                                        <span className="col-span-2 text-center">HSN</span>
                                        <span className="col-span-2 text-center">Qty</span>
                                        <span className="col-span-2 text-right">Amount</span>
                                    </div>
                                    <div className="grid grid-cols-12 p-2.5 border-t border-slate-100 text-slate-700 text-[11px]">
                                        <span className="col-span-6 font-semibold text-slate-900">Premium Cloud ERP Annual License</span>
                                        <span className="col-span-2 text-center font-mono text-slate-600">997331</span>
                                        <span className="col-span-2 text-center">1</span>
                                        <span className="col-span-2 text-right font-bold text-slate-900">₹39,999.00</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-12 h-12 bg-slate-100 border border-slate-200 p-1 rounded-lg flex items-center justify-center">
                                            <div className="w-10 h-10 border border-slate-400 border-dashed flex items-center justify-center text-[8px] font-mono text-slate-700 font-bold">
                                                NIC QR
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-medium">Govt NIC QR<br />Digitally Signed</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 font-medium">IGST (18%): ₹7,199.82</p>
                                        <p className="text-lg font-black text-slate-900">Total: ₹47,198.82</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-09: WhatsAppInvoicingShowcase */}
                <AnimatedSection direction="up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Interactive Phone Graphic — Combination Contrast */}
                        <div className="lg:col-span-6 order-2 lg:order-1">
                            <div className="max-w-sm mx-auto rounded-[36px] bg-slate-900 border-4 border-slate-800 p-4 shadow-2xl shadow-emerald-950/20">
                                {/* WhatsApp Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                                            NB
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white flex items-center gap-1">
                                                Nexus Billing
                                                <span className="text-emerald-400 text-[10px]">✓</span>
                                            </p>
                                            <p className="text-[10px] text-emerald-400">Official WhatsApp Business</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">⋮</span>
                                </div>

                                {/* Chat Message Bubble */}
                                <div className="space-y-3 font-sans text-xs">
                                    <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-none shadow-sm space-y-2">
                                        <p className="font-semibold">🙏 Dear Ramesh ji,</p>
                                        <p className="text-slate-100 text-[11px] leading-relaxed">
                                            Thank you for your business! Your GST Tax Invoice <b>#INV-2026-9041</b> for <b>₹18,450</b> has been generated.
                                        </p>
                                        
                                        {/* PDF Attachment Box */}
                                        <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">📄</span>
                                                <div>
                                                    <p className="font-bold text-[11px] text-white">Invoice_9041.pdf</p>
                                                    <p className="text-[9px] text-slate-300">142 KB • Official GST Copy</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-white/20">View</span>
                                        </div>

                                        {/* Quick Pay Button */}
                                        <div className="pt-1">
                                            <div className="w-full text-center py-2 bg-emerald-400 text-slate-950 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1.5 shadow">
                                                <span>⚡ Pay ₹18,450 via UPI QR</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-1 text-[9px] text-slate-300">
                                            <span>10:42 AM</span>
                                            <span className="text-sky-300 font-bold">✓✓</span>
                                        </div>
                                    </div>

                                    {/* Auto-response reminder */}
                                    <div className="bg-[#202c33] text-slate-300 p-3 rounded-xl text-[11px]">
                                        <p className="text-emerald-400 font-semibold mb-0.5">🔔 Automated Payment Reminder</p>
                                        <p className="text-[10px]">Reminder sent 2 days before due date. Zero awkward manual phone calls.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Copy Column */}
                        <div className="lg:col-span-6 order-1 lg:order-2">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                                WhatsApp Automation
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                Send invoices directly on WhatsApp. Get paid 3x faster.
                            </h2>
                            <p className="text-slate-600 text-base leading-relaxed mb-8">
                                Nobody opens emails anymore. Deliver GST invoices and payment links directly to the app your customers use all day.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                    <span className="text-3xl font-black text-emerald-600">97%</span>
                                    <p className="text-xs text-slate-900 font-bold mt-1">WhatsApp Open Rate</p>
                                    <p className="text-[10px] text-slate-500">vs 21% industry email avg</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                    <span className="text-3xl font-black text-indigo-600">3x</span>
                                    <p className="text-xs text-slate-900 font-bold mt-1">Faster Receivables</p>
                                    <p className="text-[10px] text-slate-500">with dynamic UPI payment links</p>
                                </div>
                            </div>

                            <ul className="space-y-3 text-sm text-slate-700 font-medium">
                                <li className="flex items-center gap-2.5">
                                    <span className="text-emerald-600 font-bold">✔</span>
                                    Auto-dispatch PDF on invoice save
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <span className="text-emerald-600 font-bold">✔</span>
                                    Read receipts &amp; delivery confirmation tracking
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <span className="text-emerald-600 font-bold">✔</span>
                                    Polite automated payment reminder sequences
                                </li>
                            </ul>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-10: PosModuleSection */}
                <AnimatedSection direction="up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-4">
                                High-Speed Retail POS
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                Barcode POS designed for rush-hour speed
                            </h2>
                            <p className="text-slate-600 text-base leading-relaxed mb-6">
                                Scan barcodes, split payments, print thermal receipts, and close sales in under 5 seconds. Every counter bill instantly updates master store inventory and accounting in real time.
                            </p>

                            <div className="space-y-3 text-sm text-slate-700 font-medium">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                                    <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-black">F2</span>
                                    <span>Keyboard shortcuts for complete mouse-free operation</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                                    <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">🖨️</span>
                                    <span>Supports 2-inch &amp; 3-inch thermal receipt printers (ESC/POS)</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                                    <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">⚡</span>
                                    <span>Multi-payment split: Cash + UPI + Card + Credit Khata</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xl shadow-slate-200/50">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">POS Terminal #1</span>
                                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">ONLINE</span>
                                </div>
                                
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 flex items-center gap-3">
                                    <span className="text-lg">🔍</span>
                                    <input
                                        type="text"
                                        readOnly
                                        value="Scan barcode or type item (F1)..."
                                        className="bg-transparent border-none text-xs text-slate-500 focus:outline-none w-full font-medium"
                                    />
                                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">SCAN READY</span>
                                </div>

                                <div className="space-y-2 mb-4 text-xs">
                                    <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                                        <span className="font-medium text-slate-800">Parle-G Gold 1kg (x2)</span>
                                        <span className="font-mono font-bold text-slate-900">₹140.00</span>
                                    </div>
                                    <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                                        <span className="font-medium text-slate-800">Amul Butter 500g (x1)</span>
                                        <span className="font-mono font-bold text-slate-900">₹275.00</span>
                                    </div>
                                    <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                                        <span className="font-medium text-slate-800">Tata Salt Lite 1kg (x3)</span>
                                        <span className="font-mono font-bold text-slate-900">₹105.00</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold">Total 6 Items</p>
                                        <p className="text-2xl font-black text-slate-900">₹520.00</p>
                                    </div>
                                    <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/25">
                                        F9: Quick Pay &amp; Print
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-11: InventorySection */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
                            Intelligent Inventory
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Total inventory control across warehouses &amp; shops
                        </h2>
                        <p className="mt-4 text-slate-600 text-base">
                            Prevent stockouts, track expiring stock, and manage stock transfers between godowns without discrepancies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-400 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-xl mb-4">
                                🏢
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">Multi-Godown Stock Transfer</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Move stock between primary godown, secondary depots, and retail outlets with stock transfer challans and gate passes.
                            </p>
                        </div>
                        <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-400 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-xl mb-4">
                                ⏳
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">Batch &amp; Expiry Tracking</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Vital for pharma, food, FMCG and chemicals. Never sell expired products. Automated FIFO allocation ensures oldest stock sells first.
                            </p>
                        </div>
                        <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-400 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-xl mb-4">
                                📲
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">WhatsApp Low-Stock Alerts</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Receive proactive notifications on WhatsApp when an item drops below safety thresholds with an auto-drafted purchase order.
                            </p>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
