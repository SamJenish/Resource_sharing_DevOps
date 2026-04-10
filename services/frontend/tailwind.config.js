/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060809',
          900: '#0b0e13',
          850: '#0f1218',
          800: '#131820',
          750: '#171d26',
          700: '#1b222d',
          650: '#1f2733',
          600: '#252e3b',
          500: '#2d3748',
          400: '#3d4a5c',
          300: '#536179',
          200: '#6b7a8d',
          100: '#9aa4af',
          50:  '#c4cad2',
        },
        accent: {
          cyan: '#00d4ff',
          teal: '#2dd4bf',
          amber: '#f59e0b',
          orange: '#fb923c',
          rose: '#f43f5e',
          violet: '#8b5cf6',
          green: '#22c55e',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
