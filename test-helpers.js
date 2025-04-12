const request = require("supertest");
const app = require("./src/index");

// Helper functions for authentication tests
async function registerUser(username, password) {
  const response = await request(app).post("/register").send({ username, password });
  return response;
}

async function loginUser(username, password) {
  const response = await request(app).post("/login").send({ username, password });
  return response;
}

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

module.exports = {
  registerUser,
  loginUser,
};
