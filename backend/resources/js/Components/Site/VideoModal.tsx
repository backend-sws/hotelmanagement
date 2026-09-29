import { useState } from 'react';

interface Props {
    thumbnailSrc?: string;
    videoUrl: string;
    title?: string;
    duration?: string;
    speaker?: string;
    company?: string;
    className?: string;
}

export default function VideoModal({
    thumbnailSrc,
    videoUrl,
    title,
    duration = '3:20',
    speaker,
    company,
    className = '',
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Video Trigger Card */}
            <div
                onClick={() => setOpen(true)}
                className={`group relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 border border-slate-200/90 ${className}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
                aria-label={`Play video: ${title}`}
            >
                {/* Thumbnail Image */}
                {thumbnailSrc ? (
                    <img
                        src={thumbnailSrc}
                        alt={title || 'Video testimonial thumbnail'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 flex items-center justify-center">
                        <span className="text-white/40 text-xs font-mono">Video Story</span>
                    </div>
                )}

                {/* Dark Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/20 group-hover:from-slate-950/90 transition-colors duration-300" />

                {/* Center Animated Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-indigo-500/40 opacity-75"></span>
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 border-2 border-white/80 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Top Duration Badge & YouTube Tag */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/10">
                        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span>Verified Case</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                        {duration}
                    </span>
                </div>

                {/* Bottom Overlay Title & Speaker */}
                {(title || speaker) && (
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-left">
                        {speaker && (
                            <p className="text-[11px] font-bold text-emerald-300 tracking-wide uppercase">
                                {speaker} {company ? `• ${company}` : ''}
                            </p>
                        )}
                        {title && (
                            <p className="text-white text-xs sm:text-sm font-bold leading-snug line-clamp-2 mt-0.5 text-shadow">
                                {title}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Video Modal Player */}
            {open && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md animate-fadeIn"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black/90 transition-colors shadow-lg"
                            aria-label="Close modal"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <iframe
                            src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                            title={title || 'Customer Case Video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
}
