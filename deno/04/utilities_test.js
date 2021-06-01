import { assert, assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { bench, runBenchmarks } from "https://deno.land/std@0.97.0/testing/bench.ts";
import { stripColor } from "https://deno.land/std@0.97.0/fmt/colors.ts";
import { prepareForViewport, stripANSI } from "./utilities.js";

Deno.test(
  "stripANSI: Simple wrap",
  () => {
      const xs = new TextEncoder().encode(
        `\x1b[H\x1b[J\x1b[7mBacon ipsum dolor\x1b[27m`
      );

      console.log("\x1b[H\x1b[J\x1b[7m Hello Meeeeee\x1b[27m")

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
  "stripANSI: With cursor function",
  () => {
    const xs = new TextEncoder().encode(
      `\x1b[H\x1b[JBacon ipsum dolor\x1b[20;32Hpancetta fatback tail sausage`
    );

    const ys = stripANSI(xs);

    assertEquals(
      ys,
      new TextEncoder().encode(
        `Bacon ipsum dolorpancetta fatback tail sausage`
      )
    )
  }
);

Deno.test(
  "stripANSI: Performance",
  async () => {
    const w = `\x1b[H\x1b[J\x1b[7mBacon ipsum dolor\x1b[27m\r\n\x1b[31mpancetta fatback tail sausage\x1b[39m`;
    const xs = new TextEncoder().encode(
      `\x1b[H\x1b[J\x1b[7mBacon ipsum dolor\x1b[27m\r\n\x1b[31mpancetta fatback tail sausage\x1b[39m`
    );

    bench({
      name: "stripANSI",
      func: b => {
        b.start();
        let i = 0;
        while (i < 1e6) {
          stripANSI(xs);
          i++;
        }
        b.stop();
      }
    });

    bench({
      name: "stripANSI with TextEncoder",
      func: b => {
        b.start();
        let i = 0;
        while (i < 1e6) {
          stripANSI(new TextEncoder().encode(w));
          i++
        }
        b.stop();
      }
    });

    bench({
      name: "stripColor",
      func: b => {
        b.start();
        let i = 0;
        while (i < 1e6) {
          stripColor(w);
          i++
        }
        b.stop();
      }
    });

    bench({
      name: "stripColor with TextDecoder",
      func: b => {
        b.start();
        let i = 0;
        while (i < 1e6) {
          stripColor(new TextDecoder().decode(xs));
          i++
        }
        b.stop();
      }
    });

    await runBenchmarks();
  }
)

Deno.test(
  "prepareForViewport: buffer size",
  async () => {
    const xs = new TextEncoder().encode(
      `Bacon ipsum dolor amet shank pancetta fatback tail sausage, chislic shoulder jowl jerky pork loin swine. Shoulder beef ribs strip steak beef tail venison, buffalo kevin ribeye alcatra. Salami chicken shankle ham hock drumstick prosciutto. Tongue beef chuck ham hock shoulder. Ribeye jowl ham hock pancetta corned beef. Rump tail shank leberkas bacon flank short loin salami tongue brisket tri-tip shoulder. Jowl alcatra fatback salami, picanha landjaeger doner chuck jerky spare ribs shoulder filet mignon chislic biltong pork belly.`
    )
    const b = prepareForViewport(
      xs,
      { columns: 80, rows: 25, ratio: 0.8, title: "I love bacon" }
    );

    console.log("Hello", b);

    await Deno.write(Deno.stdout.rid, b);

    if (b.byteLength > 80 * 25) throw new Error("The buffer is out of bound.");
  }
);

// Deno.test(
//   "prepareForViewport: buffer size",
//   () => {
//     const xs = new TextEncoder().encode(
//       `Bacon ipsum dolor amet shank pancetta fatback tail sausage, chislic shoulder jowl jerky pork loin swine. Shoulder beef ribs strip steak beef tail venison, buffalo kevin ribeye alcatra. Salami chicken shankle ham hock drumstick prosciutto. Tongue beef chuck ham hock shoulder. Ribeye jowl ham hock pancetta corned beef. Rump tail shank leberkas bacon flank short loin salami tongue brisket tri-tip shoulder. Jowl alcatra fatback salami, picanha landjaeger doner chuck jerky spare ribs shoulder filet mignon chislic biltong pork belly.`
//     )
//     const b = prepareForViewport(
//       xs,
//       { columns: 80, rows: 25, ratio: 0.8, title: "I love bacon" }
//     );
//
//     console.log(new TextDecoder().decode(stripANSI(b)));
//   }
// );
