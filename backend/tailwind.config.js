import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', ...defaultTheme.fontFamily.sans],
                mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                brand: {
                    indigo:  '#6366F1',
                    violet:  '#8B5CF6',
                    emerald: '#10B981',
                    amber:   '#F59E0B',
                },
            },
            animation: {
                'fadeInUp':    'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
                'fadeIn':      'fadeIn 0.5s ease forwards',
                'scaleIn':     'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
                'float':       'float 6s ease-in-out infinite',
                'marquee':     'marquee 30s linear infinite',
                'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
                'spin-slow':   'spin 20s linear infinite',
                'countUp':     'countUp 2s ease-out forwards',
                'slideDown':   'slideDown 0.3s ease forwards',
                'slideUp':     'slideUp 0.3s ease forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%':   { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%':   { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%':      { transform: 'translateY(-12px)' },
                },
                marquee: {
                    '0%':   { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                slideDown: {
                    '0%':   { opacity: '0', transform: 'translateY(-8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%':   { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            backgroundImage: {
                'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
                'gradient-mesh':     'radial-gradient(at 40% 20%, #6366F1 0, transparent 50%), radial-gradient(at 80% 80%, #8B5CF6 0, transparent 50%)',
                'noise':             "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            },
            screens: {
                'xs': '475px',
            },
            maxWidth: {
                '8xl': '88rem',
                '9xl': '96rem',
            },
        },
    },

    plugins: [forms],
};
