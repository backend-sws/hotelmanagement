import React, { useState } from 'react';

export default function EngineeringCultureAndTechStack() {
    // S-15 State: Interactive Architecture Layer Selector
    const [selectedLayer, setSelectedLayer] = useState<'edge' | 'services' | 'data' | 'statutory'>('services');

    return (
        <section id="engineering-stack" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-300">
                        Engineering Excellence
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Architected for Sub-Second Indian Commerce
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Designed from the ground up for high concurrency, zero data loss, and uninterrupted multi-branch synchronization across distributed cloud infrastructure.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-11 & S-12: Engineering Performance & Zero Data Loss Guarantee           */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                ⚡
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">High-Concurrency Cloud Core</h3>
                                <p className="text-xs text-slate-500">P99 response times under 50ms under peak Diwali loads</p>
                            </div>
                        </div>

                        <ul className="space-y-3 text-xs text-slate-600 mt-6">
                            <li className="flex items-start gap-2.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span><strong>Multi-Region Resilience:</strong> Active-standby clusters operating across AWS Mumbai (ap-south-1) and Hyderabad (ap-south-2) with automated 30-second failover.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span><strong>In-Memory Redis Caching:</strong> Product catalogs, HSN tax slabs, and pricing rules are cached in RAM for instantaneous barcode scanner lookup.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span><strong>Idempotent API Pipeline:</strong> Duplicate network retries never generate double bills or duplicate stock deductions.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                🛡️
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Zero Data Loss Guarantee</h3>
                                <p className="text-xs text-slate-500">MCA Rule 11 audit trails &amp; continuous WAL archiving</p>
                            </div>
                        </div>

                        <ul className="space-y-3 text-xs text-slate-600 mt-6">
                            <li className="flex items-start gap-2.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span><strong>Continuous WAL Replication:</strong> Every transaction write-ahead log is streamed to isolated immutable storage nodes in real time.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span><strong>15-Minute Point-In-Time Snapshots:</strong> Capable of rolling back any accidental store database corruption to any exact minute in the past 90 days.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span><strong>Immutable Financial Ledgers:</strong> Transaction rows cannot be silently updated or overwritten; adjustments are recorded via statutory credit/debit vouchers.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-13 & S-14: AI Tech Pillars & Enterprise Statutory Security              */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                                🤖
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">AI &amp; Automation Pillars</h3>
                                <p className="text-xs text-slate-500">Practical, real-world intelligence embedded directly into billing</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600 mt-6">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="font-bold text-slate-900 mb-0.5">Gemini Vision AI Invoice OCR</div>
                                Snap a photo of any handwritten or printed vendor purchase bill to auto-extract line items, quantities, and GST numbers in 3 seconds.
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="font-bold text-slate-900 mb-0.5">WhatsApp Cloud API Webhook Queues</div>
                                High-scale message queues handling up to 1,000 transactions per second for instantaneous customer payment receipts and catalog checkouts.
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="font-bold text-slate-900 mb-0.5">Festive Seasonality Stock Forecasting</div>
                                Machine learning algorithms analyze historical sales patterns to recommend reorder quantities ahead of Diwali, Eid, and wedding seasons.
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                                🔒
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Enterprise Security Certifications</h3>
                                <p className="text-xs text-slate-500">Compliant with highest global and Indian regulatory benchmarks</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                <div className="text-base font-black text-slate-900">ISO 27001</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">Information Security Management</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                <div className="text-base font-black text-slate-900">SOC 2 Type II</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">Operational Trust &amp; Privacy</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                <div className="text-base font-black text-slate-900">CERT-In Aligned</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">Indian Cyber Safety Compliance</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                <div className="text-base font-black text-slate-900">GSP Authorized</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">Direct Government IRP Highway</div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                            All data is protected with 256-bit AES encryption at rest and TLS 1.3 in transit. Tenant data isolation ensures no merchant ever accesses another merchant’s ledger records.
                        </p>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-15: Interactive System Architecture Diagram                             */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
                        <div>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Live System Topology</span>
                            <h3 className="text-2xl font-black text-white mt-0.5">
                                End-to-End Real-Time Cloud Data Flow
                            </h3>
                            <p className="text-slate-400 text-xs mt-1">
                                Click any layer to explore how transactions flow from storefront barcode scanners to central cloud databases and government tax portals.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedLayer('edge')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    selectedLayer === 'edge' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                1. Edge Devices
                            </button>
                            <button
                                onClick={() => setSelectedLayer('services')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    selectedLayer === 'services' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                2. Cloud Engine
                            </button>
                            <button
                                onClick={() => setSelectedLayer('data')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    selectedLayer === 'data' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                3. Resilient Data
                            </button>
                            <button
                                onClick={() => setSelectedLayer('statutory')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    selectedLayer === 'statutory' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                4. Statutory Bridges
                            </button>
                        </div>
                    </div>

                    {/* Architecture Layer Body */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                        {selectedLayer === 'edge' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-blue-400 font-bold mb-1">POS Billing Terminals</div>
                                    Thermal receipt printers, barcode scanners, weighing scales, and multi-counter cash drawers communicating over high-speed local WebSockets.
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-blue-400 font-bold mb-1">Mobile Merchant Apps</div>
                                    Native Android &amp; iOS merchant consoles for store managers to monitor live cashier cash drawers, stock counts, and daily collection metrics.
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-blue-400 font-bold mb-1">WhatsApp Cloud Clients</div>
                                    Direct customer interface for in-chat catalog browsing, 1-tap dynamic UPI intent payments, and PDF invoice delivery without mobile apps.
                                </div>
                            </div>
                        )}

                        {selectedLayer === 'services' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-emerald-400 font-bold mb-1">Real-Time Sync Engine</div>
                                    Sub-second event bus broadcasting inventory deductions and cash ledger postings to all connected branches instantaneously.
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-emerald-400 font-bold mb-1">Statutory Tax Resolver</div>
                                    Automated Place of Supply engine determining CGST + SGST vs IGST bifurcations and multi-tier composition tax exemptions.
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-emerald-400 font-bold mb-1">Batch &amp; Expiry Optimizer</div>
                                    FIFO / FEFO stock allocation preventing dispensing of expired pharmaceutical drugs and FMCG consumables.
                                </div>
                            </div>
                        )}

                        {selectedLayer === 'data' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-purple-400 font-bold mb-1">Relational SQL Cluster</div>
                                    PostgreSQL instances with strict ACID transactional guarantees, zero phantom reads, and automated read-replica load balancing.
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-purple-400 font-bold mb-1">Redis In-Memory Fabric</div>
                                    Ultra-fast sub-millisecond caching layer storing live SKU stock counts, barcode lookups, and session authorizations.
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-purple-400 font-bold mb-1">Encrypted S3 Document Vault</div>
                                    Immutable cloud storage housing signed IRN JSON records, E-Way Bill transit passes, and digital receipt PDFs with 99.999999999% durability.
                                </div>
                            </div>
                        )}

                        {selectedLayer === 'statutory' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-amber-400 font-bold mb-1">Government NIC IRP Portal</div>
                                    Direct encrypted API generating authentic 64-character IRN hashes and QR codes in under 200ms without logging into government websites.
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-amber-400 font-bold mb-1">National E-Way Bill System</div>
                                    Pin-to-pin distance calculation and instant Part-A / Part-B generation for inter-state highway transit consignments.
                                </div>
                                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="text-amber-400 font-bold mb-1">Two-Way Tally Prime Bridge</div>
                                    XML/ODBC accounting bridge posting sales vouchers, purchase registers, and tax ledgers directly into CA workstations.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}
