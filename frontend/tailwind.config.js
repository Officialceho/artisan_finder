/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F6F1E4',
          soft: '#FBF8F1',
          deep: '#EDE4CF',
        },
        ink: {
          DEFAULT: '#241E1A',
          soft: '#4A3F36',
          faint: '#8A7A68',
        },
        rust: {
          50: '#FBEDE6',
          100: '#F3D2C0',
          300: '#DE9B78',
          500: '#B5502D',
          600: '#9A4224',
          700: '#7C351D',
        },
        teal: {
          50: '#E8F0EF',
          200: '#A9C7C3',
          500: '#2F5D5A',
          600: '#254A47',
          700: '#1B3735',
        },
        gold: {
          400: '#D9AE5A',
          500: '#C99A3D',
          600: '#A87E2E',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        linen: "radial-gradient(circle at 1px 1px, rgba(36,30,26,0.05) 1px, transparent 0)",
      },
      backgroundSize: {
        linen: '18px 18px',
      },
      boxShadow: {
        stitched: '0 1px 0 rgba(36,30,26,0.06), 0 12px 24px -12px rgba(36,30,26,0.25)',
      },
      borderRadius: {
        card: '1.25rem',
      },
    },
  },
  plugins: [],
};
