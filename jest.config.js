module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.js", "**/?(*.)+(spec|test).js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
