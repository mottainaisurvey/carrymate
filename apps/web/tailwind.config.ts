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
        ink:   '#1a1208',
        cream: '#f5f0e8',
        warm:  '#f0ebe0',
        teal:  {
          DEFAULT: '#1d7a5f',
          light:   '#2ea882',
          pale:    '#e0f2ec',
        },
        gold:  {
          DEFAULT: '#c8963e',
          light:   '#e8b86d',
        },
        rust:  {
          DEFAULT: '#c04a2a',
          pale:    '#fceee8',
        },
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
