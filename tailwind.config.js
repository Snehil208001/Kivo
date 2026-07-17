/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        // Brand green (fixed by brief) — primary action + identity.
        primary: {
          DEFAULT: '#00A86B',
          dark: '#008a58',
          deep: '#05402F', // rich forest for dark sections / headings
          light: '#E8FAF1',
        },
        // Warm urgency / sale accent — used sparingly for pop + conversion.
        pop: {
          DEFAULT: '#FF5A2C',
          dark: '#E8461A',
          light: '#FFEDE5',
        },
        amber: {
          DEFAULT: '#FFB020', // stars / highlights
        },
        accent: {
          DEFAULT: '#111827',
        },
        mint: '#EAF9F1',
        surface: '#F9FAFB',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        card: '0 1px 3px rgba(17, 24, 39, 0.06), 0 1px 2px rgba(17, 24, 39, 0.04)',
        lift: '0 18px 40px -12px rgba(5, 64, 47, 0.22)',
        pop: '0 12px 28px -8px rgba(255, 90, 44, 0.45)',
        glow: '0 14px 40px -10px rgba(0, 168, 107, 0.4)',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.25s ease-out',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        marquee: 'marquee 28s linear infinite',
        'marquee-fast': 'marquee 18s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
      },
    },
  },
  plugins: [],
};
