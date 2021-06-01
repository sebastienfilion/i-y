// users.ts
export const targetURL = "https://randomuser.me/api/";

interface Users {
  name: string;
  email: string;
  login: {
    uuid: string;
  };
}

/**
 * Gets a User from the API
 *
 * ```
 * import { getUser } from "./users.ts";
 *
 * const p = getUser().then(user => user.fullName);
 * ```
 */
export function getUser (): Promise<Users> {

  return fetch(`${targetURL}?inc=name,email,login,id`)
    .then(response => response.json())
    .then(({ results: [ user ] }) => user);
}
