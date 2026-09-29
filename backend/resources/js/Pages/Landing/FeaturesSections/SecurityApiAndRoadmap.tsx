import { useState } from 'react';
import { Link } from '@inertiajs/react';

interface RoadmapItem {
    id: string;
    title: string;
    desc: string;
    quarter: string;
    votes: number;
    badge: string;
}

const INITIAL_ROADMAP: RoadmapItem[] = [
    {
        id: 'voice-billing',
        title: '🎙️ AI Voice Invoicing in Hindi, Tamil & Marathi',
        desc: 'Speak naturally to your microphone: "Do kilo sugar aur ek packet tea bill banao" and get an instant structured bill in seconds.',
        quarter: 'Q4 2026',
        votes: 482,
        badge: 'In Active Development',
    },
    {
        id: 'tally-bridge',
        title: '🔄 Tally Prime 2-Way Real-Time Cloud Bridge',
        desc: 'Bi-directional live synchronization with on-premise Tally 9 & Tally Prime without manual XML export/import routines.',
        quarter: 'Q4 2026',
        votes: 524,
        badge: 'Private Beta',
    },
    {
        id: 'whatsapp-store',
        title: '🛒 WhatsApp E-Commerce Catalog & Checkout',
        desc: 'Turn your WhatsApp business number into a full e-commerce shop with product catalog browsing, cart addition, and native payment.',
        quarter: 'Q1 2027',
        votes: 391,
        badge: 'Community Requested',
    },
    {
        id: 'route-optimizer',
        title: '🗺️ Field Engineer Multi-Stop Route Optimization',
        desc: 'AI computes the shortest travel route for technicians handling 8+ service visits per day, cutting fuel expense by 28%.',
        quarter: 'Q1 2027',
        votes: 312,
        badge: 'Planned',
    },
];

const PERMISSIONS = [
    { name: 'View Purchase Price & Supplier Margins', desc: 'Restricts billing clerks from viewing landed costs and wholesale margins', active: false },
    { name: 'Allow Discount Override Above 10%', desc: 'Requires manager OTP before cashiers can apply custom discounts', active: true },
    { name: 'Delete or Void Completed Invoice', desc: 'Strictly locked; logs immutable audit reason if authorized by owner', active: false },
    { name: 'Export Customer Contact Database', desc: 'Prevents rogue sales reps from downloading customer phone numbers to Excel', active: false },
    { name: 'Store IP Whitelist & Login Hours', desc: 'Restricts access outside retail store opening hours (9 AM - 10 PM)', active: true },
];

export default function SecurityApiAndRoadmap() {
    const [roadmap, setRoadmap] = useState<RoadmapItem[]>(INITIAL_ROADMAP);
    const [votedIds, setVotedIds] = useState<string[]>([]);
    const [activeEndpoint, setActiveEndpoint] = useState<'invoice' | 'webhook'>('invoice');

    const handleVote = (id: string) => {
        if (votedIds.includes(id)) {
            setRoadmap((prev) =>
                prev.map((item) => (item.id === id ? { ...item, votes: item.votes - 1 } : item))
            );
            setVotedIds((prev) => prev.filter((vId) => vId !== id));
        } else {
            setRoadmap((prev) =>
                prev.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
            );
            setVotedIds((prev) => [...prev, id]);
        }
    };

    return (
        <div id="security-api" className="pt-16 pb-20 space-y-24">
            {/* ========================================================= */}
            {/* SECTION 30: ApiAccess                                     */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                                <span>ENTERPRISE DEVELOPER API &amp; WEBHOOKS</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Connect Custom CRMs, Shopify &amp; ERPs via REST API
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Nexus provides an enterprise OpenAPI 3.0 REST suite and asynchronous Webhooks.
                                Trigger external automations whenever an invoice is marked paid, an engineer punches attendance, or inventory drops below reorder point.
                            </p>

                            <div className="flex gap-3 text-xs font-mono">
                                <button
                                    type="button"
                                    onClick={() => setActiveEndpoint('invoice')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                        activeEndpoint === 'invoice'
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    POST /v1/invoices/create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveEndpoint('webhook')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                        activeEndpoint === 'webhook'
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    WEBHOOK: invoice.paid
                                </button>
                            </div>
                        </div>

                        {/* Interactive Code Terminal Box */}
                        <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-5 border border-slate-800 font-mono text-xs overflow-x-auto">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-slate-400">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-[11px] ml-1 text-slate-500">api-sandbox.nexus.in</span>
                                </div>
                                <span className="text-[10px] text-emerald-400 font-bold">HTTP 200 OK</span>
                            </div>

                            {activeEndpoint === 'invoice' ? (
                                <pre className="text-slate-300 leading-relaxed text-[11px]">
{`// Create B2B Invoice with Auto-IRN
POST /v1/invoices HTTP/1.1
Authorization: Bearer nxs_live_9921_sec_token
Content-Type: application/json

{
  "customer_gstin": "27AADCA1234F1Z1",
  "dispatch_whatsapp": true,
  "generate_irn": true,
  "items": [
    { "sku": "ERP-LIC-01", "qty": 1, "rate": 18000, "hsn": "998313" }
  ]
}

// Response: 200 OK
{
  "invoice_number": "INV-2026-0842",
  "irn": "4a8f9c1b3e8d2e0f12345678...",
  "qr_svg_url": "https://cdn.nexus.in/qr/842.svg",
  "whatsapp_status": "DELIVERED"
}`}
                                </pre>
                            ) : (
                                <pre className="text-slate-300 leading-relaxed text-[11px]">
{`// Real-time Event Webhook Payload
POST https://your-server.com/webhooks/nexus HTTP/1.1
X-Nexus-Signature: sha256=e3b0c44298fc1c149...

{
  "event": "invoice.paid",
  "timestamp": "2026-09-18T14:35:12Z",
  "data": {
    "invoice_number": "INV-2026-0842",
    "amount_received": 21240.00,
    "payment_method": "UPI_PHONEPE",
    "transaction_ref": "UPI/234910283011",
    "customer": "Apex Diagnostics & Lab"
  }
}`}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 31: RbacSection                                   */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4">
                            <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            50+ Granular Permissions. Zero Internal Theft or Leakage.
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Keep sensitive margins, customer phone directories, and purchase vendor prices locked away from billing clerks and junior staff.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {PERMISSIONS.map((perm, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                            >
                                <div>
                                    <div className="font-bold text-sm text-slate-900">{perm.name}</div>
                                    <div className="text-xs text-slate-600 mt-0.5">{perm.desc}</div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span
                                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                                            perm.active
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-slate-200 text-slate-700'
                                        }`}
                                    >
                                        {perm.active ? 'RESTRICTED (LOCKED)' : 'MANAGERS ONLY'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 32: DataExport (CA Tax Audit Pack)                */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-indigo-50/50 border border-indigo-100">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                                <span>DATA SOVEREIGNTY &amp; TAX PACK</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                1-Click "CA Tax Audit Pack" &amp; Full Raw Database Dump
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                You own 100% of your data. Never get held hostage by legacy software vendors.
                                Download a clean single zip archive containing all your GSTR-1, GSTR-3B JSON files, Sales registers, Purchase registers,
                                and Bank Reconciliations ready to hand directly to your Chartered Accountant.
                            </p>
                        </div>
                        <div className="lg:col-span-4 text-center lg:text-right">
                            <button
                                type="button"
                                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-indigo-200 transition-all"
                            >
                                📦 Download Sample CA Pack (.ZIP)
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 33: FeatureRoadmap (Interactive Voting)           */}
            {/* ========================================================= */}
            <section id="roadmap" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-4">
                        <span>PUBLIC PRODUCT ROADMAP</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Built With You. Vote On What Ships Next.
                    </h2>
                    <p className="mt-3 text-slate-600 text-base">
                        Our engineering team prioritizes features based on direct user upvotes. Click the vote button on any upcoming module.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roadmap.map((item) => {
                        const hasVoted = votedIds.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                                            {item.quarter}
                                        </span>
                                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
                                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-mono font-semibold text-slate-500">
                                        {item.votes} Community Votes
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleVote(item.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                            hasVoted
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                                        }`}
                                    >
                                        <span>{hasVoted ? '✓ Upvoted' : '▲ Upvote Feature'}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 34: FeaturesCTA                                   */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-[2.5rem] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-indigo-800/40">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                            <span>ZERO RISK GUARANTEE</span>
                        </div>

                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                            Every Single Feature Included. One Transparent Price.
                        </h2>

                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                            No hidden paywalls for e-invoicing. No per-bill charges for thermal POS. No extra fees for WhatsApp bot integration.
                            Get complete enterprise capability starting at ₹999/month.
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/pricing"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-900 font-extrabold text-base hover:bg-slate-100 transition-all shadow-xl"
                            >
                                Start 14-Day Free Trial →
                            </Link>
                            <Link
                                href="/demo"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600/30 text-white border border-white/20 font-bold text-base hover:bg-indigo-600/50 transition-all"
                            >
                                Book Live 1-on-1 Product Demo
                            </Link>
                        </div>

                        <p className="text-xs text-slate-400 pt-2">
                            ✓ Instant Setup in 3 Minutes • Zero Credit Card Required • Free Data Migration From Vyapar &amp; Tally
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
