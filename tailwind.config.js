/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      maxWidth: {
        'container': '1400px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '2rem',
        },
        screens: {
          '2xl': '1400px',
        },
      },
      fontSize: {
        'countdown': 'clamp(15rem, 80vw, 40rem)',
      }
    },
  },
  plugins: [],
}
