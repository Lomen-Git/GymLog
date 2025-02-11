/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        omaMaroon: '#6F263D',
        omaTummin: '#121212',
        omaTummenpi: '#262626',
        omaTumma: '#393939',
        omaKorostus: '#3DD0E3',
        omaKorostus2: '#4589FF',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },
      animation: {
        flip: 'flip 0.5s ease-in-out',
      },
    },
  },
  variants: {
    extend: {
      transformStyle: ['responsive', 'hover', 'focus'],
      backfaceVisibility: ['responsive', 'hover', 'focus'],
      rotate: ['responsive', 'hover', 'focus', 'group-hover'],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.backface-visible': {
          'backface-visibility': 'visible',
        },
      })
    },
  ],
}