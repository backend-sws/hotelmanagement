import { useEffect, useRef, ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface Props {
    children: ReactNode;
    className?: string;
    delay?: number;     // ms
    direction?: Direction;
    threshold?: number;
}

export default function AnimatedSection({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    threshold = 0.12,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const initialStyles: Record<Direction, string> = {
        up:    'opacity-0 translate-y-10',
        down:  'opacity-0 -translate-y-10',
        left:  'opacity-0 translate-x-10',
        right: 'opacity-0 -translate-x-10',
        scale: 'opacity-0 scale-95',
        fade:  'opacity-0',
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.classList.add(...initialStyles[direction].split(' '));
        el.style.transition = `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.remove(...initialStyles[direction].split(' '));
                    el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100');
                    observer.disconnect();
                }
            },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
