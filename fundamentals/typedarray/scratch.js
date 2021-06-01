fetch("https://randomuser.me/api/")
  .then(response => response.body.getReader().read())
  .then(({ value }) => {
    // console.log(JSON.parse(new TextDecoder().decode(value)));
    Deno.write(Deno.stdout.rid, value);
  });
