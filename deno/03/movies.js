export function getMovieByTitle (APIKey, title) {

  return fetch(`http://www.omdbapi.com/?apikey=65ea1e8b&t=${encodeURIComponent(title)}`)
    .then(response => response.json());
}
