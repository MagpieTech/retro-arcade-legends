/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        arcade: ['"Press Start 2P"', 'cursive'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'arcade-red': '#CC3300',
        'arcade-gold': '#FFB800',
        'arcade-teal': '#00B4AA',
        'arcade-purple': '#7B2FBE',
        'arcade-green': '#00A86B',
        'bg-dark': '#0D0D0D',
        'bg-card': '#1A1A2E',
        'text-primary': '#F0F0F0',
        'text-muted': '#888888',
      },
    },
  },
  plugins: [],
};
