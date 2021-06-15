import { serve } from "./server.js";

if (import.meta.main) {
  serve(
    Deno.listen({ port: Number(Deno.args[0]) }),
    _ =>
      Promise.reject(
        new Error("FU")
      )
  )
    .catch(e => console.error(e));
}
