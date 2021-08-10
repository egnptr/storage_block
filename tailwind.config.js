module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "royal-purple": "#656DFF",
        "royal-yellow": "#FFB469",
        "royal-pink": "#D665FF",
        "royal-blue": "#2C3353",
        "royal-light-blue": "#636C98",
        "royal-dark-blue": "#212847",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
