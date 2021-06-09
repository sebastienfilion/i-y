const c = new BroadcastChannel("main");

const initializeWorkerPool = async n => {
  for (let i = 0; i < n; i++) {
    const w = new Worker(new URL("./worker.js", import.meta.url).href, { type: "module", name: `${i + 1}` });
    await new Promise((resolve) => w.onmessage = resolve);
  }
}

if (import.meta.main) {
  await initializeWorkerPool(3);

  console.log(`\x1b[?25l\x1b[H\x1b[J\x1b[32mWorker pool is ready.\x1b[0m`);

  setTimeout(
    () => c.postMessage({ action: "Start", n: 1000 }),
    1000
  );
}
