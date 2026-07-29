/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skybg: '#87CEFA',
        brand: {
          50: '#E8F3FF',
          100: '#CBE2FF',
          500: '#0362C0',
          600: '#024DA0',
          700: '#02387B',
          DEFAULT: '#0362C0',
        },
        royal: '#1D4ED8',
        electric: '#FFFF00',
        lime: '#C6F500',
        amberIcon: '#FFA715',
        dark: '#0A1128',
        surface: {
          light: '#FFFFFF',
          glass: 'rgba(255, 255, 255, 0.92)',
          darkGlass: 'rgba(10, 17, 40, 0.90)'
        }
      },
      fontFamily: {
        stinger: ['Outfit', 'sans-serif'],
        helios: ['Plus Jakarta Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        brush: ['Permanent Marker', 'Caveat', 'cursive'],
        verandah: ['VerandahReverie', 'cursive', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      boxShadow: {
        glow: '0 0 30px rgba(3, 98, 192, 0.4)',
        limeGlow: '0 0 25px rgba(198, 245, 0, 0.5)',
        goldGlow: '0 0 25px rgba(255, 167, 21, 0.4)',
        bento: '0 12px 40px -10px rgba(3, 98, 192, 0.12)',
        popout: '0 20px 50px -12px rgba(10, 17, 40, 0.25)',
      }
    },
  },
  plugins: [],
}
