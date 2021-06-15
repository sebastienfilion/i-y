export const serve = async (listener, f) => {
  for await (const connection of listener) {
    let xs = new Uint8Array(1024);
    const n = await Deno.read(connection.rid, xs);

    try {
      await Deno.write(connection.rid, await f(xs.subarray(0, n)));
    } catch (e) {
      await Deno.write(
        connection.rid,
        new TextEncoder().encode(
          `HTTP/1.1 500 Internal Server Error\r\nContent-Type: text/plain\r\nContent-Length: ${7 + e.message.length}\r\n\r\nError: ${e.message}`
        )
      );
    }

  }
};
