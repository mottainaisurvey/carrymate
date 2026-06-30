import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#0d1117',
        surface: '#161b22',
        surface2:'#1c2330',
        border:  '#2a3444',
        border2: '#374355',
        text:    '#e6e2da',
        muted:   '#7a8699',
        teal:    { DEFAULT: '#1d9e75', dark: '#145c44', pale: 'rgba(29,158,117,0.12)' },
        gold:    '#c8963e',
        rust:    '#c04a2a',
      },
      fontFamily: {
        mono: ['DM Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
export default config
