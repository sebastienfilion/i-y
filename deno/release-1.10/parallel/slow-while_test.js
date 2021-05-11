import { assert } from "https://deno.land/std@0.95.0/testing/asserts.ts";

const slow = (d) => {
  const x = new Date().getTime();
  let y = x;
  while ((y - x) < d * 10) {
    y = new Date().getTime();
  }
};

Array(10).fill(0)
  .forEach((_, i) => Deno.test(`Slow While (${i})`, () => {

    return slow(i);
  }));

