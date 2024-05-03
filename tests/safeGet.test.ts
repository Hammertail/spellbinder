import { test, it, describe } from "node:test";
import { equal } from "node:assert";
import assert from "node:assert";

import z from "zod";

import { Spellbinder, SpellError } from "../src";

test("Spellbinder safeGet test", async () => {

  await it("should return error if the schema is not correct", async () => {
    const url = "/users/tamicktom";
    const spellbinder = new Spellbinder({ baseUrl: "https://api.github.com/" });

    const schema = z.object({
      login: z.string(),
      id: z.number(),
      followers: z.number(),
      following: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    });

    const banana = await spellbinder.safeGet({ url, schema: schema.array() });

    assert(banana.success === false);
    assert(banana.error.errors.length === 1);
    assert(banana.error instanceof z.ZodError);
  });

  await it("should return an error if the url is not correct", async () => {
    const url = "users";
    const spellbinder = new Spellbinder({ baseUrl: "https://api.github.com" });

    const schema = z.object({
      login: z.string(),
      id: z.number(),
      followers: z.number(),
      following: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    });

    const user = await spellbinder.safeGet({ url, schema });

    assert(user.success === false);
    assert(user.error instanceof z.ZodError);
  });
});
