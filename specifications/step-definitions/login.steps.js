const { defineFeature, loadFeature } = require("jest-cucumber");
const { loginUser, registerUser } = require("../../test-helpers");

const feature = loadFeature("./specifications/features/login.feature");

defineFeature(feature, (test) => {
  // Custom World object for sharing context between steps
  let customWorld = {
    response: null,
    loginData: [],
    loginResults: [],
  };

  // Hooks
  beforeAll(() => {
    console.log("Starting Login Tests");
  });

  afterAll(() => {
    console.log("Completed Login Tests");
  });

  beforeEach(async function () {
    customWorld = {
      response: null,
      loginData: [],
      loginResults: [],
    };

    // Register test user before each test
    await registerUser("testuser", "testpass");
  });

  // Reusable step definitions
  const givenLoginSystemIsAvailable = (given) => {
    given("the login system is available", () => {
      // System is available by default
    });
  };

  const givenRegisteredUser = (given) => {
    given(
      /^I am a registered user with username "(.*)" and password "(.*)"$/,
      (username, password) => {
        customWorld.registeredUsername = username;
        customWorld.registeredPassword = password;
      }
    );
  };

  test("Successful login", ({ given, when, then }) => {
    givenLoginSystemIsAvailable(given);
    givenRegisteredUser(given);

    when(
      /^I submit login with username "(.*)" and password "(.*)"$/,
      async (username, password) => {
        customWorld.response = await loginUser(username, password);
      }
    );

    then("I should receive a valid JWT token", () => {
      expect(customWorld.response.status).toBe(200);
      expect(customWorld.response.body.token).toBeDefined();
      expect(customWorld.response.body.token).toBeValidJWT(); // Custom matcher
    });
  });

  test("Login with various credentials", ({ given, when, then }) => {
    givenLoginSystemIsAvailable(given);
    givenRegisteredUser(given);

    when(
      /^I submit login with username "(.*)" and password "(.*)"$/,
      async (username, password) => {
        customWorld.response = await loginUser(username, password);
      }
    );

    then(/^I should receive "(.*)"$/, (message) => {
      if (message === "success") {
        expect(customWorld.response.status).toBe(200);
        expect(customWorld.response.body.token).toBeDefined();
        expect(customWorld.response.body.token).toBeValidJWT();
      } else if (message === "Invalid credentials") {
        expect(customWorld.response.status).toBe(401);
        expect(customWorld.response.body.message).toBe(message);
      }
    });
  });

  test("Login with data table", ({ given, when, then }) => {
    givenLoginSystemIsAvailable(given);
    givenRegisteredUser(given);

    when("I submit multiple login attempts:", async (dataTable) => {
      for (const { username, password, expected_result } of dataTable) {
        const response = await loginUser(username, password);
        customWorld.loginResults.push({
          username,
          password,
          expected_result,
          response,
        });
      }
    });

    then("the login results should match expectations", () => {
      customWorld.loginResults.forEach(({ expected_result, response }) => {
        if (expected_result === "success") {
          expect(response.status).toBe(200);
          expect(response.body.token).toBeDefined();
          expect(response.body.token).toBeValidJWT();
        } else {
          expect(response.status).toBe(401);
          expect(response.body.message).toBe("Invalid credentials");
        }
      });
    });
  });
});
