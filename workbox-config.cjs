module.exports = {
  globDirectory: "dist/",
  globPatterns: [
    "**/*.{html,js,css,png,jpg,svg,ico,json}"
  ],
  globIgnores: ["**/node_modules/**/*"],
  swSrc: "src/sw.js",
  swDest: "dist/sw.js"
};