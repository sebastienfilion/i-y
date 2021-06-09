
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

const outputChunks = async (iterator) => {
  for await (const chunk of iterator) {
    console.log(`\x1b[H\x1b[J${chunk}`);
  }
  Deno.exit();
};

if (import.meta.main) {
  const response = await fetch("https://randomuser.me/api/?results=1000")
    .catch(e => console.error(e));

  const stream = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new UsernameExtractor());

  outputChunks(stream)
    .catch(e => console.error(`\x1b[31mThe stream failed: ${e.message}\x1b[0m`));
}



