import * as users from "./users.js";

users.getUser()
  .then(user => {
    console.log(`Welcome to ${user.name.title}. ${user.name.last}`);
  });
