export const targetURL = "https://randomuser.me/api/";

export function getUser () {

  return fetch(`${targetURL}?inc=name,email,login,id`)
    .then(response => response.json())
    .then(({ results: [ user ] }) => user);
}

