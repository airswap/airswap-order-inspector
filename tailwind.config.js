/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      blueExtraDark: 'rgba(16, 24, 39, 1)',
      blueDark: 'rgba(16, 24, 39, 1)',
      blueAirSwap: 'rgba(44, 112, 255, 1)',
      redAlert: '#ff0101',
      lightGray: 'rgb(241, 241, 241)',
      white: 'rgb(255 255 255)',
    },
    extend: {
      backgroundColor: {
        blueExtraDark: 'rgba(16, 24, 39, 1)',
      },
    },
  },
  plugins: [],
};
