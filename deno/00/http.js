const listener = Deno.listen({ port: 8080 });

console.log("listening on 0.0.0.0:8080");


// Uint8Array -> Object
function parseRequest (x) {

  return new TextDecoder().decode(x)
    .split("\r\n")
    .reduce(
      (request, x, i, xs) => {
        if (i === 0) {
          const [ method, path ] = x.split(" ");

          return { method, path };
        }

        if (i === xs.length - 1 && x !== "") return { ...request, body: x };

        if (x === "") return request;

        const [ key, value ] = x.split(/\s*:\s*/);

        return { ...request, [key]: value };
      },
      {}
    );
}

for await (const connection of listener) {
  let buffer = new Uint8Array(1026 * 10);
  Deno.read(connection.rid, buffer)
    .then(n => {
      const request = parseRequest(buffer.subarray(0, n));
      console.log(request);
      return Deno.write(connection.rid, new TextEncoder().encode(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${request.body.length}\r\n\r\n${request.body}`))
    })
    .finally(() => connection.close());
}
