/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF6B00', dark: '#E55A00', light: '#FF8C33', 50: '#FFF4EC', 100: '#FFE8D5' },
        saffron: '#FF9933',
        gold: '#D4A017',
        cream: '#FEFAF5',
        spiritual: '#5C3D1E',
        'text-dark': '#1A0A00',
        'text-mid': '#5C3D1E',
        'text-light': '#8B6344',
        'bg-cream': '#FEFAF5',
        'bg-dark': '#0D0500',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
        accent: ['"Cinzel"', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse': 'spin-reverse 20s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-orange': 'pulse-orange 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        'spin-reverse': { from: { transform: 'rotate(360deg)' }, to: { transform: 'rotate(0deg)' } },
        'float': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'pulse-orange': { '0%,100%': { boxShadow: '0 0 0 0 rgba(255,107,0,0.4)' }, '50%': { boxShadow: '0 0 0 20px rgba(255,107,0,0)' } },
        'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'saffron-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF9933 50%, #FFD700 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0D0500 0%, #1A0A00 50%, #2D1000 100%)',
        'shimmer': 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },
      boxShadow: {
        'orange': '0 25px 50px rgba(255,107,0,0.15)',
        'orange-lg': '0 35px 70px rgba(255,107,0,0.25)',
      }
    },
  },
  plugins: [],
};
