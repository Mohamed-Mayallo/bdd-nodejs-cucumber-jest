const { defineFeature, loadFeature } = require("jest-cucumber");
const { registerUser } = require("../../test-helpers");

const feature = loadFeature("./specifications/features/register.feature");

defineFeature(feature, (test) => {
  // Custom World object for sharing context between steps
  let customWorld = {
    response: null,
    registrationData: [],
    registrationResults: [],
  };

  // Hooks
  beforeAll(() => {
    console.log("Starting Registration Tests");
  });

  afterAll(() => {
    console.log("Completed Registration Tests");
  });

  beforeEach(function () {
    customWorld = {
      response: null,
      registrationData: [],
      registrationResults: [],
    };
  });

  // To eliminate duplication in step definitions, reuse the step definitions
  // However, to eliminate the duplication in the feature file, use Backgrounds
  const givenRegistrationSystemIsAvailable = (given) => {
    given("the registration system is available", () => {
      // System is available by default
    });
  };

  test("Successful user registration", ({ given, when, then }) => {
    givenRegistrationSystemIsAvailable(given);

    when(
      /^I submit registration with username "(.*)" and password "(.*)"$/,
      async (username, password) => {
        customWorld.response = await registerUser(username, password);
      }
    );

    then("I should receive a successful registration message", () => {
      expect(customWorld.response.status).toBe(201);
      expect(customWorld.response.body.message).toBe("User registered successfully");
    });
  });

  test("Registration with various credentials", ({ given, when, then }) => {
    givenRegistrationSystemIsAvailable(given);

    when(
      /^I submit registration with username "(.*)" and password "(.*)"$/,
      async (username, password) => {
        customWorld.response = await registerUser(username, password);
      }
    );

    then(/^I should receive "(.*)"$/, (message) => {
      if (message === "User registered successfully") {
        expect(customWorld.response.status).toBe(201);
      } else if (message === "User already exists") {
        expect(customWorld.response.status).toBe(409);
      } else if (message === "Invalid credentials") {
        expect(customWorld.response.status).toBe(400);
      }

      expect(customWorld.response.body.message).toBe(message);
    });
  });

  test("Registration with data table", ({ given, when, then }) => {
    givenRegistrationSystemIsAvailable(given);

    when("I submit multiple registrations:", async (dataTable) => {
      for (const { username, password } of dataTable) {
        const response = await registerUser(username, password);
        customWorld.registrationResults.push({ username, password, response });
      }
    });

    then("all registrations should be successful", () => {
      customWorld.registrationData.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully");
      });
    });
  });

  test("Registration with detailed response validation", ({ given, when, then }) => {
    givenRegistrationSystemIsAvailable(given);

    when(
      /^I submit registration with username "(.*)" and password "(.*)"$/,
      async (username, password) => {
        customWorld.response = await registerUser(username, password);
      }
    );

    then("I should receive a response matching:", (docString) => {
      const expectedResponse = JSON.parse(docString);

      expect(customWorld.response.status).toBe(expectedResponse.status);
      expect(customWorld.response.body.message).toBe(expectedResponse.body.message);
    });
  });
});
