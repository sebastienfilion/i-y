import { assert, assertThrowsAsync } from "https://deno.land/std@0.95.0/testing/asserts.ts";

Deno.test(
  {
    name: "Fetch resource",
    permissions: {
      net: true
    },
    fn() {

      return fetch("https://randomuser.me/api/")
        .then(response => response.json())
        .then(assert);
    }
  }
);

Deno.test(
  {
    name: "Fetch resource: Permission overwrite",
    permissions: {
      net: false
    },
    fn() {

      assertThrowsAsync(
        () => fetch("https://randomuser.me/api/")
          .then(response => response.json())
      );
    }
  }
);

Deno.test(
  {
    name: "Permission Query: Granted",
    permissions: {
      net: [ "randomuser.me" ]
    },
    fn() {

      return Deno.permissions.query({ name: "net", host: "randomuser.me" })
        .then(({ state }) => {
          assert(state, "granted");
        });
    }
  }
);

Deno.test(
  {
    name: "Permission Query: Prompt",
    permissions: {
      net: false
    },
    fn() {

      return Deno.permissions.query({ name: "net", host: "randomuser.me" })
        .then(({ state }) => {
          assert(state, "prompt");
        });
    }
  }
);

