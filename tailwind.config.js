/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        carrotorange: "#E89005",
        safetyorange: "#EC7505",
        yaleblue: "#083D77",
        mantis: "#7AC74F",
        pistacchio: "#A1CF6B",
      },
    },
  },
  plugins: [],
};
