// cli.ts
import { getUser } from "./users.ts";

export async function writeUserFile () {
  const user = await getUser();

  return Deno.writeFile(`./${user.login.uuid}.json`, new TextEncoder().encode(JSON.stringify(user, null, 2)));
}

if (import.meta.url === Deno.mainModule) {
  console.log("%cGenerating a new user...", "color: gray");
  await writeUserFile();
  console.log("%cDone!", "color: green");
}
