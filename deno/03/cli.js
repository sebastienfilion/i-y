import { getMovieByTitle } from "./movies.js";
import { prepareForViewport } from "./utilities.js";

function displayMovies (data) {
  const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);

  return Deno.write(
    Deno.stdout.rid,
    prepareForViewport(data, { columns, rows, title: "My movie collection" })
  );
}

if (import.meta.main) {
  const [ action, title ] = Deno.args;

  if (action === "fetch") getMovieByTitle(Deno.env.get("OMDB_API_KEY"), title)
    .then(
      movie => Deno.writeTextFile(
        `${Deno.cwd()}/movies`,
        `${movie.Title}: ${movie.Plot}\r\n`,
        { append: true }
      )
    )
    .then(() => console.log("...done"));
  else if (action === "display") Deno.readFile(`${Deno.cwd()}/movies`)
    .then(displayMovies);
  else console.error(`There are no action "${action}"`);
}

