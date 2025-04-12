const { setJestCucumberConfiguration } = require("jest-cucumber");

// Should coming from .env file instead
const env = "development";
process.env.NODE_ENV = env;

let tagFilter = undefined;

if (process.env.NODE_ENV === "staging") {
  tagFilter = "@smoke and not @regression";
} else if (process.env.NODE_ENV === "production") {
  tagFilter = "@regression and not @smoke";
}

// Configure jest-cucumber
setJestCucumberConfiguration({
  tagFilter,
  scenarioNameTemplate: (vars) => {
    const tags = vars.scenarioTags ? ` [${vars.scenarioTags.join(", ")}]` : "";
    return `${vars.featureTitle} - ${vars.scenarioTitle}${tags}`;
  },
});

// Global test configuration
beforeAll(() => {
  console.log("Starting Test Suite");
});

afterAll(() => {
  console.log("Completed Test Suite");
});

// Custom matchers
expect.extend({
  toBeValidJWT: (received) => {
    const jwtPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    const pass = jwtPattern.test(received);
    return {
      message: () => `Expected ${received} ${pass ? "not " : ""}to be a valid JWT token`,
      pass,
    };
  },
});
