console.log(Deno.permissions)

console.log(await Deno.permissions.query({ name: "read", path: import.meta.url }));

await Deno.permissions.request({ name: "read", path: import.meta.url })

console.log(await Deno.permissions.query({ name: "read", path: import.meta.url }));

await Deno.permissions.revoke({ name: "read", path: import.meta.url })

console.log(await Deno.permissions.query({ name: "read", path: import.meta.url }));
