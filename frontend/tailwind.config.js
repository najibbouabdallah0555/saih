/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      
      backgroundImage: {
      'background-image': "url('file:///C:/Users/jamel/OneDrive/Desktop/saih/frontend/src/assets/Asset%2013@300x.png')",
      'logo-image':"url('file:///C:/Users/jamel/OneDrive/Desktop/saih/frontend/src/assets/Asset%203.svg')",
    },  animation: {
      'spin-slow': 'spin 3s linear infinite',
    }
  },
  },
  darkMode: 'class',
  plugins: [],
}