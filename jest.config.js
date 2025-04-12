module.exports = {
  rootDir: ".",
  testMatch: ["**/specifications/step-definitions/**/*.steps.js"],
  testTimeout: 60000,
  verbose: true,
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/setup.js"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "reports",
        outputName: "junit.xml",
      },
    ],
  ],
};
