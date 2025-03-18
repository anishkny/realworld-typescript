import { test } from "node:test";
import { strict as assert } from "node:assert";
import axios from "axios";

const APIURL = process.env.APIURL || "http://localhost:8000/api";

// Globals
const NUM_USERS = 20;
const ARTICLES_PER_USER = 10;
const usernames = [...Array(NUM_USERS).keys()].map(
  (i) => `user-${i}-${rand()}`,
);
const tokensHash = {};

test("Create users", async () => {
  const results = await Promise.all(
    usernames.map((username) =>
      axios.post(`${APIURL}/users`, {
        user: {
          email: `${username}@mail.com`,
          password: "password",
          username,
        },
      }),
    ),
  );

  // Assert all users were created
  results.forEach((result) => {
    assert.strictEqual(result.status, 200);
  });

  // Store tokens
  results.forEach((result) => {
    const { user } = result.data;
    tokensHash[user.username] = user.token;
  });
});

function rand() {
  return Math.random().toString(36).substring(2);
}
