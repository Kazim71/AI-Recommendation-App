/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6fbff",
          100: "#eaf5ff",
          200: "#cfe9ff",
          300: "#b4ddff",
          400: "#7ec4ff",
          500: "#3b98ff",
          600: "#2f7be6",
          700: "#265fba",
          800: "#1c4686",
          900: "#123055",
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.800"),
            a: {
              color: theme("colors.blue.600"),
              "&:hover": { color: theme("colors.blue.700") },
            },
            h3: {
              marginTop: "1rem",
              marginBottom: "0.25rem",
              color: theme("colors.blue.600"),
            },
            strong: { color: theme("colors.gray.900") },
            li: {
              marginBottom: "0.25rem",
            },
          },
        },
        invert: {
          css: {
            color: theme("colors.gray.100"),
            a: { color: theme("colors.blue.400") },
            h3: { color: theme("colors.blue.400") },
            strong: { color: theme("colors.white") },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
