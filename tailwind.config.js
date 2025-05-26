/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  "*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1E4335',
        secondary: '#EBB87D',
        accent: '#F4A54B',
        background: '#EDE6DE',
        text: '#0F0C09'
      }
    },
  },
  plugins: [],
}

