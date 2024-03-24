import { test, it, describe } from "node:test";
import { equal } from "node:assert";
import assert from "node:assert";

import z from "zod";

import { Spellbinder } from "../src";

test("Spellbinder get test", async () => {
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
});
