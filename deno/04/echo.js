Deno.setRaw(Deno.stdin.rid, true);
Deno.copy(Deno.stdin, Deno.stdout);
