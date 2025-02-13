module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  setupFilesAfterEnv: ["./jest.setup.js"],
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/__tests__/**/*.spec.[jt]s?(x)",
    "**/*.test.[jt]s?(x)",
    "**/*.spec.[jt]s?(x)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],
};
