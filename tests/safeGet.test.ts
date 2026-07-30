//* Libraries imports
import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert";
import z from "zod";

//* Local imports
import { Spellbinder } from "../src";
import { mockFetch, jsonResponse } from "./helpers/mock-fetch";

describe("Spellbinder", () => {
  describe("safeGet", () => {
    afterEach(() => {
      mock.restoreAll();
    });

    it("returns success with validated data when the response matches the schema", async () => {
      mockFetch(() =>
        jsonResponse({
          login: "Tamicktom",
          id: 60244227,
          followers: 10,
          following: 5,
          created_at: "2020-01-24T00:19:27Z",
          updated_at: "2024-01-01T00:00:00Z",
        })
      );

      const spellbinder = new Spellbinder({
        baseUrl: "https://api.github.com/",
      });

      const schema = z.object({
        login: z.string(),
        id: z.number(),
        followers: z.number(),
        following: z.number(),
        created_at: z.string(),
        updated_at: z.string(),
      });

      const result = await spellbinder.safeGet({
        url: "/users/tamicktom",
        schema,
      });

      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.login, "Tamicktom");
        assert.equal(result.data.id, 60244227);
      }
    });

    it("returns an error when the response does not match the schema", async () => {
      mockFetch(() =>
        jsonResponse({
          login: "Tamicktom",
          id: 60244227,
          followers: 10,
          following: 5,
          created_at: "2020-01-24T00:19:27Z",
          updated_at: "2024-01-01T00:00:00Z",
        })
      );

      const spellbinder = new Spellbinder({
        baseUrl: "https://api.github.com/",
      });

      const schema = z.object({
        login: z.string(),
        id: z.number(),
        followers: z.number(),
        following: z.number(),
        created_at: z.string(),
        updated_at: z.string(),
      });

      const result = await spellbinder.safeGet({
        url: "/users/tamicktom",
        schema: schema.array(),
      });

      assert.equal(result.success, false);
      if (!result.success) {
        assert.equal(result.error.errors.length, 1);
        assert.ok(result.error instanceof z.ZodError);
      }
    });

    it("returns an error when the response body is incompatible with the schema", async () => {
      mockFetch(() =>
        jsonResponse({
          message: "Not Found",
          documentation_url: "https://docs.github.com/rest",
        })
      );

      const spellbinder = new Spellbinder({
        baseUrl: "https://api.github.com",
      });

      const schema = z.object({
        login: z.string(),
        id: z.number(),
        followers: z.number(),
        following: z.number(),
        created_at: z.string(),
        updated_at: z.string(),
      });

      const result = await spellbinder.safeGet({
        url: "users",
        schema,
      });

      assert.equal(result.success, false);
      if (!result.success) {
        assert.ok(result.error instanceof z.ZodError);
      }
    });
  });
});
