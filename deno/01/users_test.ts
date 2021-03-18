// users_test.ts
import { assert } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { getUser } from "./users.ts";


Deno.test("getUser", async () => {
  const user = await getUser();

  assert(typeof user === "object", "The user is not an object.");
  assert(user.name, "The user does not have a name.");
  assert(user.email, "The user does not have an email.");
});
