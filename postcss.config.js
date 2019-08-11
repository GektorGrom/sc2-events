const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    tailwindcss('./tailwind.js'),
    // eslint-disable-next-line global-require
    require('autoprefixer'),
  ],
};
