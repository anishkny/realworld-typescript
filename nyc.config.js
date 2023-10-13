module.exports = {
  cache: false,
  exclude: ["src/migrations/**"],
  reporter: ["text", "html", "lcov"],
  "check-coverage": true,
  branches: 80,
  lines: 80,
  functions: 80,
  statements: 80,
};
