/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFD6E8',     // soft pink
          blue: '#D6E8FF',     // soft blue
          lavender: '#E8D6FF', // soft lavender
          cream: '#FFF8DC',    // cream
          mint: '#D6FFE8',     // soft mint
          peach: '#FFE8D6',    // soft peach
        },
        darkpastel: {
          pink: '#1F0A15',     // very dark pink
          blue: '#0A0F1F',     // very dark blue
          lavender: '#150A1F', // very dark lavender
          cream: '#1A1A0F',    // very dark cream
          mint: '#0A1F15',     // very dark mint
          peach: '#1F150A',    // very dark peach
        },
      },
    },
  },
  plugins: [],
};
