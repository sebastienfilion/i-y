import { serve, serveStatic } from "./server.js";
import { findIndexOfSequence, readLine } from "./utilities.js";

const $decoder = new TextDecoder();
const decode = $decoder.decode.bind($decoder);
const $encoder = new TextEncoder();
const encode = $encoder.encode.bind($encoder);

const log = (message, f) => async xs => {
  const ys = readLine(xs);
  const i = findIndexOfSequence(ys, encode(" HTTP/"));
  await Deno.write(Deno.stdout.rid, encode(`\x1b[2KServing ${message} ${decode(ys.subarray(0, i))}... `));

  const t = performance.now();

  try {
    const zs = await f(xs);
    const as = readLine(zs);
    const j = as.indexOf(32);
    const statusCode = Number(decode(as.subarray(j + 1, j + 4)));

    if (statusCode < 300)
      await Deno.write(Deno.stdout.rid, encode(`\x1b[32mSuccess ${statusCode} \x1b[37m(${(performance.now() - t).toPrecision(1)}ms)\x1b[0m\r\n`));
    else
      await Deno.write(Deno.stdout.rid, encode(`\x1b[31mFailure ${statusCode} \x1b[37m(${(performance.now() - t).toPrecision(1)}ms)\x1b[0m\r\n`));

    return zs;
  } catch (e) {
    await Deno.write(Deno.stdout.rid, encode(`\x1b[31mFailure ${e.message}\x1b[37m(${(performance.now() - t).toPrecision(1)}ms)\x1b[0m\r\n\x1b[37m${e.stack}\r\n\x1b[0m`));
    throw e;
  }
};

if (import.meta.main) {
  serve(
    Deno.listen({ port: Number(Deno.args[0]) }),
    log("Static", serveStatic)
  )
    .catch(e => console.error(e));
}
