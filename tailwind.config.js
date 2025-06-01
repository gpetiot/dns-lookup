/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A56DB', // Darker, more contrasting blue
          dark: '#1E429F',
          light: '#3B82F6',
        },
        secondary: {
          DEFAULT: '#0369A1', // Darker sky blue for better contrast
          dark: '#075985',
          light: '#0EA5E9',
        },
        accent: {
          DEFAULT: '#0F766E', // Darker teal for better contrast
          dark: '#115E59',
          light: '#14B8A6',
        },
        background: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
          lighter: '#E2E8F0', // Increased contrast for background elements
        },
        text: {
          DEFAULT: '#0F172A', // Darker text for better readability
          muted: '#334155', // Increased contrast for muted text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 4px 12px rgba(26, 86, 219, 0.12)', // Adjusted for new primary color
        'glow-secondary': '0 4px 12px rgba(3, 105, 161, 0.12)', // Adjusted for new secondary color
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 