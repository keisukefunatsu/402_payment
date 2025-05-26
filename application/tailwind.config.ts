import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        payment: {
          primary: '#6366f1',
          'primary-light': '#818cf8',
          'primary-dark': '#4f46e5',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#f87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'payment-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'transaction-success': 'bounce 1s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config