import { test, it, describe } from "node:test";
import { equal } from "node:assert";
import assert from "node:assert";

import z from "zod";

import { Spellbinder, SpellError } from "../src";

test("Spellbinder Post test", async () => {
  await it("should return the correct data from github", async () => {
    const url = "/";
    const spellbinder = new Spellbinder({
      baseUrl: "https://echo.hoppscotch.io",
    });

    const schema = z.object({
      method: z.enum(["POST"]),
      args: z.object({}),
      data: z.string(),
    });

    const body = { data: "Hello, World!" };

    const data = await spellbinder.Post({
      url,
      schema,
      body,
    });

    assert(data.data === JSON.stringify(body));
  });
});
