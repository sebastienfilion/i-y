import { assert } from "https://deno.land/std@0.95.0/testing/asserts.ts";

const slow = (i) => new Promise(resolve => setTimeout(resolve, (i + 1) * 10));

Array(10).fill(0)
  .forEach((_, i) => Deno.test(`Slow Promise (${i})`, () => {

    return slow(i);
  }));
