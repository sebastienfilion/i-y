import { assert, assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { stripColor } from "https://deno.land/std@0.97.0/fmt/colors.ts";
import { prepareForViewport, stripANSI } from "./utilities.js";

Deno.test(
  "stripANSI: Simple wrap",
  () => {
      const xs = new TextEncoder().encode(
        `\x1b[H\x1b[J\x1b[7mBacon ipsum dolor\x1b[27m`
      );

      const ys = stripANSI(xs);

      if (ys.byteLength !== 17)
          throw new Error(
            `The byte length is expected to be 17; got "${new TextDecoder().decode(ys)}" (${ys.byteLength})`
          );
  }
);

Deno.test(
  "stripANSI: Multiple sentence wrap",
  () => {
    const xs = new TextEncoder().encode(
      `\x1b[H\x1b[J\x1b[7mBacon ipsum dolor\x1b[27m\r\n\x1b[31mpancetta\x1b[39m fatback tail sausage`
    );

    const ys = stripANSI(xs);

    assertEquals(
      ys,
      new TextEncoder().encode(
        `Bacon ipsum dolor\r\npancetta fatback tail sausage`
      )
    )
  }
);

Deno.test(
  "stripANSI: Multiple sentence wrap with terminal sequence",
  () => {
    const xs = new TextEncoder().encode(
      `\x1b[H\x1b[J\x1b[7mBacon ipsum dolor\x1b[27m\r\n\x1b[31mpancetta fatback tail sausage\x1b[39m`
    );

    const ys = stripANSI(xs);

    assertEquals(
      ys,
      new TextEncoder().encode(
        `Bacon ipsum dolor\r\npancetta fatback tail sausage`
      )
    )
  }
);

Deno.test(
  "stripANSI: Performance",
  () => {
    const w = `\x1b[H\x1b[J\x1b[7mBacon ipsum dolor\x1b[27m\r\n\x1b[31mpancetta fatback tail sausage\x1b[39m`;
    const xs = new TextEncoder().encode(
      `\x1b[H\x1b[J\x1b[7mBacon ipsum dolor\x1b[27m\r\n\x1b[31mpancetta fatback tail sausage\x1b[39m`
    );

    let p1, p2, p3;

    const t1 = performance.now();

    let i = 0;
    while (i < 1000) {
      p1 = stripANSI(xs);
      i++;
    }

    const t2 = performance.now();

    let j = 0;
    while (j < 1000) {
      p2 = stripANSI(new TextEncoder().encode(w));
      j++
    }

    const t3 = performance.now();

    let k = 0;
    while (k < 1000) {
      p3 = stripColor(w);
      k++;
    }

    const t4 = performance.now();

    let l = 0;
    while (i < 1000) {
      stripANSI(xs);
      l++;
    }

    const t5 = performance.now();

    console.log(`stripANSI: ${t2 - t1}ms`);
    console.log(`stripANSI with TextEncoder: ${t3 - t2}ms`);
    console.log(`stripColor: ${t4 - t3}ms`);
    console.log(`stripANSI (bis): ${t5 - t4}ms`);

    assertEquals(p1, p2);
    assertEquals(new TextDecoder().decode(p1), p3);
  }
)

Deno.test(
  "prepareForViewport: buffer size",
  () => {
    const xs = new TextEncoder().encode(
      `Bacon ipsum dolor amet shank pancetta fatback tail sausage, chislic shoulder jowl jerky pork loin swine. Shoulder beef ribs strip steak beef tail venison, buffalo kevin ribeye alcatra. Salami chicken shankle ham hock drumstick prosciutto. Tongue beef chuck ham hock shoulder. Ribeye jowl ham hock pancetta corned beef. Rump tail shank leberkas bacon flank short loin salami tongue brisket tri-tip shoulder. Jowl alcatra fatback salami, picanha landjaeger doner chuck jerky spare ribs shoulder filet mignon chislic biltong pork belly.`
    )
    const b = prepareForViewport(
      xs,
      { columns: 80, rows: 25, ratio: 0.8, title: "I love bacon" }
    );

    if (b.byteLength > 80 * 25) throw new Error("The buffer is out of bound.");
  }
);
