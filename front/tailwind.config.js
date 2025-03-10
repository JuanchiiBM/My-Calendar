import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
        light: {
          colors: {
            background: {
                DEFAULT: '#efefef',
                100: '#ffffff'
            }
          }
        },
        dark: {
          colors: {
            background: {
                DEFAULT: '#000000',
                100: '#111111'
            }
          }
        }
    }
  })],
}
