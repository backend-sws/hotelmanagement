import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function DemoBanner() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const isDismissed = sessionStorage.getItem('demo_banner_dismissed') === '1';
        if (isDismissed) return;

        const onScroll = () => {
            const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPct > 40) setVisible(true);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const dismiss = () => {
        setDismissed(true);
        sessionStorage.setItem('demo_banner_dismissed', '1');
    };

    if (dismissed || !visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-slideUp">
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center justify-between gap-3 px-5 py-3.5 border border-emerald-400/30">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl hidden sm:block">👋</span>
                    <p className="text-sm sm:text-base text-white font-medium truncate">
                        Want to see it live? Book a <strong>free 30-min demo</strong> — no obligation.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                        href="/demo"
                        className="text-sm font-bold text-emerald-900 bg-white hover:bg-emerald-50 px-4 py-2 rounded-xl transition-colors"
                    >
                        Book Demo →
                    </Link>
                    <button
                        onClick={dismiss}
                        className="text-white/70 hover:text-white transition-colors p-1"
                        aria-label="Dismiss"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
