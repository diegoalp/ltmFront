import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue'
  ],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 12px 30px -20px rgba(15, 23, 42, 0.55)'
      }
    }
  },
  plugins: []
} satisfies Config
