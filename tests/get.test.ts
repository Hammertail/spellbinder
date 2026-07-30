//* Libraries imports
import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert";
import z from "zod";

//* Local imports
import { Spellbinder, SpellError } from "../src";
import { mockFetch, jsonResponse } from "./helpers/mock-fetch";

describe("Spellbinder", () => {
  describe("get", () => {
    afterEach(() => {
      mock.restoreAll();
    });

    it("returns validated data when the response matches the schema", async () => {
      const githubUser = {
        login: "Tamicktom",
        id: 60244227,
        followers: 10,
        following: 5,
        created_at: "2020-01-24T00:19:27Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockFetch(() => jsonResponse(githubUser));

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

      const response = await spellbinder.get({
        url: "/users/tamicktom",
        schema,
        params: { search: 1 },
      });

      assert.equal(response.login, "Tamicktom");
      assert.equal(response.id, 60244227);
      assert.equal(response.created_at, "2020-01-24T00:19:27Z");
    });

    it("throws a SpellError when the response does not match the schema", async () => {
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

      await assert.rejects(
        () =>
          spellbinder.get({
            url: "/users/tamicktom",
            schema: schema.array(),
          }),
        (error: unknown) => error instanceof SpellError
      );
    });

    it("throws a SpellError when the response body is incompatible with the schema", async () => {
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

      await assert.rejects(
        () =>
          spellbinder.get({
            url: "users",
            schema,
          }),
        (error: unknown) => error instanceof SpellError
      );
    });

    it("forwards next.js cache options to fetch", async () => {
      const fetchMock = mockFetch(() =>
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

      const nextOptions = {
        revalidate: 30,
        tags: ["user"],
      };

      const response = await spellbinder.get({
        url: "/users/tamicktom",
        schema,
        // Next.js extends RequestInit with a `next` field at runtime.
        ...({ next: nextOptions } as RequestInit),
      });

      assert.equal(response.login, "Tamicktom");
      assert.equal(fetchMock.mock.callCount(), 1);

      const fetchInit = fetchMock.mock.calls[0]?.arguments[1] as
        | { next?: { revalidate: number; tags: string[] } }
        | undefined;

      assert.deepEqual(fetchInit?.next, nextOptions);
    });
  });
});
