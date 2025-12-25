import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Toxic neon green - the salvage signal
        acid: {
          50: '#eefff4',
          100: '#d7ffe6',
          200: '#b2ffcf',
          300: '#76ffab',
          400: '#33ff7f',
          500: '#00ff5a',
          600: '#00d94a',
          700: '#00a83c',
          800: '#008432',
          900: '#006d2b',
          950: '#003d17',
        },
        // Oxidized copper/rust - decay and age
        oxide: {
          50: '#fff8ed',
          100: '#ffeed4',
          200: '#ffd9a8',
          300: '#ffbd71',
          400: '#ff9538',
          500: '#ff7711',
          600: '#f05c06',
          700: '#c74307',
          800: '#9e350e',
          900: '#7f2e0f',
          950: '#451405',
        },
        // Raw concrete/steel - industrial base
        slab: {
          50: '#f4f4f6',
          100: '#e4e4e9',
          200: '#cbccd5',
          300: '#a7a9b8',
          400: '#7b7d93',
          500: '#606278',
          600: '#525366',
          700: '#464755',
          800: '#3d3e49',
          900: '#27282f',
          950: '#131316',
        },
        // Warning/hazard yellow
        hazard: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite',
        'scan': 'scan 8s linear infinite',
        'glitch': 'glitch 0.3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        'grid-harsh': 'linear-gradient(rgba(0,255,90,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,90,0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
export default config
