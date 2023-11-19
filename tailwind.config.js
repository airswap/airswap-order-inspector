/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xxs: '320px',
      xs: '425px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      blueExtraDark: 'rgba(16, 24, 39, 1)',
      blueDark: 'rgba(16, 24, 39, 1)',
      blueAirSwap: 'rgba(44, 112, 255, 1)',
      redAlert: '#ff0101',
      lightGray: 'rgb(241, 241, 241)',
      white: 'rgb(255 255 255)',
    },
    extend: {},
  },
  plugins: [],
};
