import { test, it, describe } from "node:test";
import { equal } from "node:assert";
import assert from "node:assert";

import z from "zod";

import { Spellbinder, SpellError } from "../src";

test("Spellbinder Get test", async () => {
  await it("should return the correct data from github", async () => {
    const url = "/users/tamicktom";
    const spellbinder = new Spellbinder({ baseUrl: "https://api.github.com" });

    const schema = z.object({
      login: z.string(),
      id: z.number(),
      followers: z.number(),
      following: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    });

    const response = await spellbinder.Get({ url, schema });

    console.log(response);

    equal(response.login, "Tamicktom");
    equal(response.id, 60244227);
    equal(response.created_at, "2020-01-24T00:19:27Z");
  });

  await it("should throw an error if the schema is not correct", async () => {
    const url = "/users/tamicktom";
    const spellbinder = new Spellbinder({ baseUrl: "https://api.github.com" });

    const schema = z.object({
      login: z.string(),
      id: z.number(),
      followers: z.number(),
      following: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    });

    try {
      await spellbinder.Get({ url, schema: schema.array() });
    } catch (error) {
      assert(error instanceof SpellError);
    }
  });
});
