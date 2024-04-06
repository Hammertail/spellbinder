import { test, it, describe } from "node:test";
import { equal } from "node:assert";
import assert from "node:assert";

import z from "zod";

import { Spellbinder, SpellError } from "../src";

test("Spellbinder get test", async () => {
  await it("should return the correct data from github", async () => {

    const spellbinder = new Spellbinder({
      baseUrl: "https://api.github.com/",
    });

    const url = "/users/tamicktom?search=1";

    const schema = z.object({
      login: z.string(),
      id: z.number(),
      followers: z.number(),
      following: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    });

    const response = await spellbinder.get({ url, schema });

    equal(response.login, "Tamicktom");
    equal(response.id, 60244227);
    equal(response.created_at, "2020-01-24T00:19:27Z");
  });

  await it("should throw an error if the schema is not correct", async () => {
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

    try {
      const banna = await spellbinder.get({ url, schema: schema.array() });
    } catch (error) {
      assert(error instanceof SpellError);
    }
  });

  await it("should throw an error if the url is not correct", async () => {
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

    try {
      await spellbinder.get({ url, schema });
    } catch (error) {
      assert(error instanceof SpellError);
    }
  });

  await it("should be able to use next cache", async () => {
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

    const response = await spellbinder.get({
      url,
      schema,
      next: {
        revalidate: 30, // 30 seconds
        tags: ["user"],
      },
    });

    equal(response.login, "Tamicktom");
    equal(response.id, 60244227);
    equal(response.created_at, "2020-01-24T00:19:27Z");
  });
});
