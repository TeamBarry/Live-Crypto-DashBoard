/** @type {import('tailwindcss').Config} */
export default {
  // Yeh batata hai ke Tailwind kon kon si files scan karega
  // Jahan bhi yeh classes milengi, wahan CSS generate hogi
  content: [
    "./index.html",           // HTML file
    "./src/**/*.{js,ts,jsx,tsx}",  // src folder ki sari files
  ],
  theme: {
    extend: {
      // Yahan custom colors, fonts, spacing add kar sakte ho
      // Abhi default Tailwind kaafi hai
    },
  },
  plugins: [],
}