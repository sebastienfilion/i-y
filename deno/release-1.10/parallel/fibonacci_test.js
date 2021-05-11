import { assert } from "https://deno.land/std@0.95.0/testing/asserts.ts";

const fibonacci = n => Array(n)
  .fill(1)
  .reduce(
    (xs, _, i) => [ ...xs, ...((i > 1 && [ xs[--i] + xs[--i] ]) || []) ],
    [ 0, ...((n > 1 && [ 1 ]) || []) ]
  );

Array(10).fill(0)
  .forEach((_, i) => Deno.test(`Fibonacci (${i})`, () => {
    assert(fibonacci((i + 1) * 100).length === (i + 1) * 100);
  }));
