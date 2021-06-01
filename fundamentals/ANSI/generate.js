// export const moveCursor = (rows, columns) => '\x1b[' + (rows + 1) + ';' + (columns + 1) + 'H';
const { encode } = new TextEncoder();
const clear = () => new Uint8Array([ 27, 91, 72, 27, 91, 74 ]);
const hideCursor = () => new Uint8Array([ 27, 91, 50, 53, 108 ])
const move = (x, y) => new Uint8Array([ 27, 91, ...encode(y), 59, ...encode(x), 72 ]);
const fill = (n) => new Uint8Array(n).fill(32);
const inverse = () => new Uint8Array([ 27, 91, 55, 109 ]);
const reset = () => new Uint8Array([ 27, 91, 48, 109 ]);

const xs = new Uint8Array(1024);

[
  clear(),
  hideCursor(),
  inverse(),
  move(19, 2),
  fill(12),
  move(15, 3),
  fill(20),
  move(11, 4),
  fill(28),
  move(8, 5),
  fill(34),
  move(6, 6),
  fill(38),
  move(4, 7),
  fill(42),
  move(4, 8),
  fill(42),
  move(4, 9),
  fill(15),
  move(26, 9),
  fill(20),
  move(2, 10),
  fill(12),
  move(30, 10),
  fill(18),
  move(2, 11),
  fill(10),
  move(14, 11),
  fill(1),
  move(18, 11),
  fill(1),
  move(31, 11),
  fill(17),
  move(2, 12),
  fill(9),
  move(33, 12),
  fill(15),
  move(2, 13),
  fill(10),
  move(24, 13),
  fill(2),
  move(33, 13),
  fill(15),
  move(4, 14),
  fill(21),
  move(34, 14),
  fill(12),
  move(4, 15),
  fill(18),
  move(34, 15),
  fill(12),
  move(4, 16),
  fill(20),
  move(34, 16),
  fill(12),
  move(6, 17),
  fill(18),
  move(35, 17),
  fill(9),
  move(8, 18),
  fill(16),
  move(35, 18),
  fill(7),
  move(11, 19),
  fill(13),
  move(34, 19),
  fill(5),
  move(15, 20),
  fill(9),
  move(31, 20),
  fill(4),
  move(20, 21),
  fill(12),
  move(35, 23),
  reset(),
  encode("Deno"),
  move(79, 25)
]
  .reduce(
    (i, ys) => xs.set(ys, i) || i + ys.byteLength,
    0
  );

await Deno.writeFile(
  `${Deno.cwd()}/logo.js`,
  encode(`export const logo = new Uint8Array([${xs.toString()}]);`)
);
await Deno.writeFile(`${Deno.cwd()}/logo`, xs);
await Deno.write(Deno.stdout.rid, xs);
await new Promise(resolve => setTimeout(resolve, 1000 * 1000));
