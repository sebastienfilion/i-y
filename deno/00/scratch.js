// Hello World

function f () {

  return Promise.reject(new Error("Reject"));
}

function g () {

  return new Promise((resolve, reject) => reject(new Error("Constructor")));
}

async function h () {

  throw new Error("Async");
}

let queue = [];

function pushQueue (f) {
  queue.push(f);
}


pushQueue(f);
pushQueue(g);
pushQueue(h);

while (queue.length > 0) {
  if (Math.random() > 0.5) {
    const p = queue.pop();

    p().catch(e => console.log(e));
  }
}
