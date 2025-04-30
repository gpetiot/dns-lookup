/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Professional blue
          dark: '#1D4ED8',
          light: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#0EA5E9', // Sky blue
          dark: '#0284C7',
          light: '#38BDF8',
        },
        accent: {
          DEFAULT: '#14B8A6', // Teal
          dark: '#0D9488',
          light: '#2DD4BF',
        },
        background: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
          lighter: '#F1F5F9',
        },
        text: {
          DEFAULT: '#0F172A',
          muted: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 4px 12px rgba(37, 99, 235, 0.08)',
        'glow-secondary': '0 4px 12px rgba(14, 165, 233, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 