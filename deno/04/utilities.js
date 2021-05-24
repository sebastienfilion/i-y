export function prepareForViewport (data, { columns, ratio = 0.8, rows, title = "Untitled" }) {
  const UI_HEADERS = new TextEncoder().encode(
    `\x1b[H\x1b[J\x1b[7m ${title}${Array(columns - title.length - 1).fill(" ").join("")}\x1b[27m\r\n\r\n`
  );
  const UI_MORE = new TextEncoder().encode("\n\r[More...]\n\r");

  const maxCharacterCount = Math.round(columns * ratio);

  let i = 1;
  let xi = 0;
  const xl = data.byteLength;
  let ys = new Uint8Array(columns * rows);
  let yi = UI_HEADERS.byteLength;
  const yl = ys.byteLength;

  const W = " ".charCodeAt(0);
  const CL = "\r".charCodeAt(0);
  const RF = "\n".charCodeAt(0);

  ys.set(UI_HEADERS, 0);

  while (xi < xl) {
    let gi = data.indexOf(CL, xi);
    let zi = xi + maxCharacterCount;
    while (zi > 0 && zi > xi && ![ W, CL, RF ].includes(data[zi])) zi--
    if (gi > 0 && zi > gi) zi = gi + 1;

    const zs = new Uint8Array([ ...(xi > 0 ? [ W, W ] : []), ...data.slice(xi, zi), CL, RF ]);

    if (zs.byteLength + yi > ys.byteLength) break
    if (i >= rows) {
      if (xl - xi > 5) ys.set(UI_MORE, yl - UI_MORE.byteLength);
      break
    }

    ys.set(zs, yi)

    yi = yi + zs.length;
    xi = zi;
    i = gi > 0 ? i + 2 : i + 1;
  }

  return ys;
}

export const highlight = x => `\x1b[J\x1b[7m${x}\x1b[27m`;
export const blue = x => `\x1b[34m${x}\x1b[39m`;

export const stripANSI = (xs) => {
  const E = 27;
  const LB = "[".charCodeAt(0);
  const _0 = "0".charCodeAt(0);
  const _9 = "9".charCodeAt(0);
  const _A = "A".charCodeAt(0);
  const _Z = "Z".charCodeAt(0);
  const _m = "m".charCodeAt(0);
  const ys = new Uint8Array(xs.byteLength);
  const xl = xs.byteLength;
  let i = 0,
    j = 0,
    k = 0,
    escape = false;

  while (j < xl) {
    escape = escape || xs[j] === E;

    if (xs[j] === E && xs[j + 1] === LB) {
      if (i !== j) {
        ys.set(xs.subarray(i, j), k);
        k += j - i;
        i = j;
      }

      if (xs[j + 2] >= _A && xs[j + 2] <= _Z) {
        i += 3;
        j += 3;
      } else if (xs[j + 2] >= _0 && xs[j + 2] <= _9) {
        i += 3;
        j += 3;
        do {
          i++;
          j++;
        } while (xs[j - 1] !== _m);
      }
    } else if ((j === xl - 1) && i !== j) {
      ys.set(xs.subarray(i, j + 1), k);
      k += j - i + 1;
      break;
    } else j++;
  }

  return ys.subarray(0, k);
};
