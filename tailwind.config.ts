import type { Config } from 'tailwindcss'
const { nextui } = require('@nextui-org/react')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  // tailwind
  theme: {
    screens: {
      sm: { max: '640px' },
      // => @media (min-width: 640px) { ... }

      md: { max: '768px' },
      // => @media (min-width: 768px) { ... }

      lg: { max: '1024px' },
      // => @media (min-width: 1024px) { ... }

      xl: { max: '1280px' },
      // => @media (min-width: 1280px) { ... }

      '2xl': { max: '1536px' },
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      backgroundImage: {},
    },
    fontFamily: {
      pretendard: ['Pretendard-Regular'],
    },
  },
  darkMode: 'class',

  // next js plugin
  plugins: [
    require('@nextui-org/react'),
    nextui({
      themes: {
        light: {
          colors: {
            background: '#FAFAFA', // or DEFAULT
            foreground: '#11181C', // or 50 to 900 DEFAULT
            primary: {
              //... 50 to 900
              foreground: '#FFFFFF',
              DEFAULT: '#006FEE',
            },
            // ... rest of the colors
          },
        },
        dark: {
          colors: {
            background: '#171717', // or DEFAULT
            foreground: '#ECEDEE', // or 50 to 900 DEFAULT
            primary: {
              //... 50 to 900
              foreground: '#FFFFFF',
              DEFAULT: '#006FEE',
            },
          },
          // ... rest of the colors
        },
      },
    }),
  ],
}
export default config
