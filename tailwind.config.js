/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': 'hsl(220, 25%, 12%)',
        'accent': 'hsl(130, 70%, 50%)',
        'primary': 'hsl(210, 90%, 45%)',
        'surface': 'hsl(220, 25%, 18%)',
        'primary-contrast': 'hsl(210, 90%, 98%)',
        'secondary-contrast': 'hsl(220, 15%, 90%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(220, 15%, 10%, 0.20)',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
        'xl': '32px',
      },
    },
  },
  plugins: [],
}