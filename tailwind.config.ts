import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        poppins: ['var(--font-poppins)'],
      },
      colors: {
        primary: {
          DEFAULT: '#28483F',
          light: '#345B4F',
          dark: '#1C352E',
        },
        accent: '#E1B709',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg) scale(1)' },
          '50%': { transform: 'rotate(3deg) scale(1.1)' },
        },
        loader: {
          '0%, 100%': { transform: 'rotate(-10deg) scale(1)' },
          '25%': { transform: 'rotate(10deg) scale(1.1)' },
          '50%': { transform: 'rotate(-5deg) scale(0.9)' },
          '75%': { transform: 'rotate(5deg) scale(1.05)' },
        }
      },
      animation: {
        wiggle: 'wiggle 2s ease-in-out infinite',
        loader: 'loader 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
