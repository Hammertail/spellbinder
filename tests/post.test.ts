import { test, it, describe } from "node:test";
import { equal } from "node:assert";
import assert from "node:assert";

import z from "zod";

import { Spellbinder, SpellError } from "../src";

test("Spellbinder Post test", async () => {
  await it("should return the correct data from github", async () => {
    const spell = new Spellbinder({ baseUrl: "https://api.github.com/" });
    const url = "/users";
    const body = {};

    const schema = z.object({
      login: z.string(),
      id: z.number(),
      followers: z.number(),
      following: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    });

    const response = await spell.Post({ url, schema, body });
  });
});
