/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: '#050607',
        panel: '#0d1117',
        panelhi: '#121821',
        signal: '#00e0ff',
        steel: '#7c8a99',
        steeldim: '#4a5560',
        pass: '#3ddc97',
        warn: '#ffb454',
        alert: '#ff4d4d',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};