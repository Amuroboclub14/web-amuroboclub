/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'mainlight': '#f2f6fe',
        'mainblue': '#0b1f57',
        'lightblue': '#f2f6fe',
        'darkblue': '#dbe3f8'
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        roboto: ['var(--font-roboto)'],
        raleway: ['var(--font-raleway)'],
        mont: ['var(--font-mont)'],
      },

    },
  },
  plugins: [],
}