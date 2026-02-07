/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        nyx: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a2e',
          600: '#2a2a4a',
          500: '#3a3a5c',
          400: '#6c63ff',
          300: '#8b7dff',
          200: '#b8b0ff',
          100: '#e0dcff',
        },
        accent: {
          purple: '#6c63ff',
          violet: '#8b5cf6',
          indigo: '#4f46e5',
          glow: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
