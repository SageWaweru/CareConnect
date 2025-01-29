/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Include your React component files
  ],
  theme: {
    extend: { 
      colors: {
        sage: '#B0BC98',
        beige:'#d9dfcd',
        coral: '#D77870',//E09891
        emeraldDark: '#2D6A4F',
    },
    
  },
  },
  plugins: [],
};


