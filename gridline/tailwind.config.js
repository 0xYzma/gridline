/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gridline: {
          dark: '#0a0a0f',
          darker: '#050508',
          light: '#1a1a2e',
          accent: '#00d4ff',
          warning: '#ff6b35',
          success: '#00ff88',
          tireSoft: '#ff4444',
          tireMedium: '#ffff44',
          tireHard: '#44ff44',
          tireIntermediate: '#44aaff',
          tireWet: '#4444ff',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

