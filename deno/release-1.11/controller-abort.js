const _a = "a".charCodeAt(0);
const _q = "q".charCodeAt(0);

class UsernameExtractor extends TransformStream {
  constructor() {
    super(
      {
        start(_) {},
        async transform (s, controller) {
          controller.enqueue(
            s.match(/(?<="username":")(\w+?)(?=")/g).join("\n")
          );
        }
      }
    )
  }
}

const convertReaderToAsyncIterator =
  async function* () {
    Deno.setRaw(Deno.stdin.rid, true);
    while (true) {
      const buffer = new Uint8Array(1);
      await Deno.stdin.read(buffer);
      yield buffer;
    }
    Deno.setRaw(Deno.stdin.rid, false);
  };

const handleUserInput = async (controller, iterator) => {
  console.log(`\x1b[H\x1b[JHit <a> to abort and <q> to quit.`);

  for await (const xs of iterator) {
    if (xs[0] === _a) {
      controller.abort();
      console.log(`\x1b[H\x1b[K\x1b[31mAborted\x1b[0m`);
    }
    if (xs[0] === _q) {
      Deno.exit();
    }
  }
};

const outputChunks = async (iterator) => {
  for await (const chunk of iterator) {
    console.log(`\x1b[2H\x1b[J${chunk}`);
  }
  Deno.exit();
};

if (import.meta.main) {
  const controller = new AbortController();

  const response = await fetch(
    "https://randomuser.me/api/?results=1000",
    { signal: controller.signal }
  )
    .catch(e => console.error(e));

  const stream = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new UsernameExtractor());

  outputChunks(stream)
    .catch(e => console.error(`\x1b[31mThe stream failed: ${e.message}\x1b[0m`));
  handleUserInput(controller, convertReaderToAsyncIterator())
    .catch(e => console.error(`\x1b[31mCapturing user input failed: ${e.message}\x1b[0m`));
}



