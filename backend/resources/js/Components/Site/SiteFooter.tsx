import { useState } from 'react';
import { Link } from '@inertiajs/react';

const cols = [
    {
        title: 'Product',
        links: [
            { label: 'GST Billing', href: '/features' },
            { label: 'Barcode POS', href: '/features' },
            { label: 'Inventory', href: '/features' },
            { label: 'HR & Payroll', href: '/features' },
            { label: 'WhatsApp Bot', href: '/features/whatsapp' },
            { label: 'Hotel PMS', href: '/solutions/hotel' },
            { label: 'GST Compliance', href: '/features/gst' },
            { label: 'Pricing', href: '/pricing' },
        ],
    },
    {
        title: 'Solutions',
        links: [
            { label: 'Retail & Supermarkets', href: '/solutions/retail' },
            { label: 'Wholesale', href: '/solutions/wholesale' },
            { label: 'Hotels & Restaurants', href: '/solutions/hotel' },
            { label: 'Field Services', href: '/solutions/field-services' },
            { label: 'Manufacturing', href: '/solutions/manufacturing' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Careers', href: '/careers' },
            { label: 'Partners', href: '/partners' },
            { label: 'Security', href: '/security' },
            { label: 'Contact', href: '/contact' },
            { label: 'Book a Demo', href: '/demo' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
        ],
    },
];

export default function SiteFooter() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) { setSubscribed(true); setEmail(''); }
    };

    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

                {/* Top grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">

                    {/* Brand column — spans 2 cols on lg */}
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-base font-extrabold text-slate-900">Nexus<span className="text-indigo-600">Billing</span></span>
                        </Link>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-xs">
                            India's smartest GST billing, WhatsApp bot automation, and field operations platform for SMEs.
                        </p>

                        {/* Direct Contact Phone & WhatsApp */}
                        <div className="space-y-1.5 mb-6 text-xs font-semibold">
                            <div className="flex items-center gap-2 text-slate-700">
                                <span>📞 Call:</span>
                                <a href="tel:+917479499718" className="text-indigo-600 hover:underline font-bold">+91 747 949 9718</a>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <span>💬 WhatsApp:</span>
                                <a href="https://wa.me/917479499718" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-bold">+91 747 949 9718</a>
                            </div>
                        </div>

                        {/* Newsletter */}
                        {subscribed ? (
                            <p className="text-sm text-emerald-600 font-medium">✅ Subscribed! Watch your inbox.</p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter work email"
                                    required
                                    className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                                />
                                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0 shadow-sm">
                                    Subscribe
                                </button>
                            </form>
                        )}

                        {/* Socials */}
                        <div className="flex gap-3 mt-6">
                            {[
                                { icon: 'twitter', href: '#', label: 'Twitter' },
                                { icon: 'linkedin', href: '#', label: 'LinkedIn' },
                                { icon: 'youtube', href: '#', label: 'YouTube' },
                            ].map((s) => (
                                <a key={s.icon} href={s.href} aria-label={s.label} className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        {s.icon === 'twitter' && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />}
                                        {s.icon === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
                                        {s.icon === 'youtube' && <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {cols.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">{col.title}</h4>
                            <ul className="space-y-2.5">
                                {col.links.map((l) => (
                                    <li key={l.href + l.label}>
                                        <Link href={l.href} className="text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium">{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-200 mb-6" />

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
                    <p>© {new Date().getFullYear()} NexusBilling SaaS India Pvt Ltd. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            99.9% Cloud SLA
                        </span>
                        <span>GST Ready • 100% Made in India 🇮🇳</span>
                        <span>ISO 27001 Certified</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
