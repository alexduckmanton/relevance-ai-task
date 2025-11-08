/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-teal': '#0F766E',
        'text-dark': '#1F2937',
        'text-medium': '#6B7280',
        'text-muted': '#9CA3AF',
        'bg-light': '#F3F4F6',
        'bg-page': '#F9FAFB',
        'bg-active': '#E5E7EB',
      },
    },
  },
  plugins: [],
}

