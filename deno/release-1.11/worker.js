const fibonacci = n => Array(n)
  .fill(1)
  .reduce(
    (xs, _, i) => [ ...xs, ...((i > 1 && [ xs[--i] + xs[--i] ]) || []) ],
    [ 0, ...((n > 1 && [ 1 ]) || []) ]
  );

const c = new BroadcastChannel("main");
self.postMessage("ready");

c.onmessage = async (e) => {
  if (e.data.action === "Start") {
    const xs = fibonacci(e.data.n);
    for (const x of xs) {
      console.log(`\x1b[${Number(self.name) + 1}H\x1b[KFibonacci ${self.name} (${e.data.n}) ${x}`);
      await new Promise(r => setTimeout(r, 100));
    }
  }
};
