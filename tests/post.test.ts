//* Libraries imports
import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert";
import z from "zod";

//* Local imports
import { Spellbinder, SpellError } from "../src";
import { mockFetch, createEchoHandler } from "./helpers/mock-fetch";

describe("Spellbinder", () => {
  describe("post", () => {
    afterEach(() => {
      mock.restoreAll();
    });

    it("returns validated data when the response matches the schema", async () => {
      mockFetch(createEchoHandler("POST"));

      const spellbinder = new Spellbinder({
        baseUrl: "https://echo.example.com",
      });

      const schema = z.object({
        method: z.enum(["POST"]),
        args: z.object({}),
        data: z.string(),
        path: z.string(),
      });

      const body = { data: "Hello, World!" };

      const response = await spellbinder.post({
        url: "/",
        schema,
        body,
      });

      assert.equal(response.data, JSON.stringify(body));
    });

    it("throws a SpellError when the response does not match the schema", async () => {
      mockFetch(createEchoHandler("POST"));

      const spellbinder = new Spellbinder({
        baseUrl: "https://echo.example.com",
      });

      const schema = z.object({
        method: z.enum(["POST"]),
        args: z.object({}),
        data: z.number(),
        path: z.number(),
      });

      const body = { data: "Hello, World!" };

      await assert.rejects(
        () =>
          spellbinder.post({
            url: "/",
            schema,
            body,
          }),
        (error: unknown) => error instanceof SpellError
      );
    });

    it("sends the request with custom headers", async () => {
      const fetchMock = mockFetch(createEchoHandler("POST"));

      const spellbinder = new Spellbinder({
        baseUrl: "https://echo.example.com",
      });

      const schema = z.object({
        method: z.enum(["POST"]),
        args: z.object({}),
        data: z.string(),
        path: z.string(),
      });

      const body = { data: "Hello, World!" };
      const headers = {
        "Content-Type": "application/json",
        "X-Custom-Header": "spellbinder",
      };

      const response = await spellbinder.post({
        url: "/",
        schema,
        body,
        headers,
      });

      assert.equal(response.data, JSON.stringify(body));
      assert.equal(fetchMock.mock.callCount(), 1);

      const fetchInit = fetchMock.mock.calls[0]?.arguments[1] as
        | RequestInit
        | undefined;

      assert.deepEqual(fetchInit?.headers, headers);
    });

    it("requests the correct path for a nested route", async () => {
      mockFetch(createEchoHandler("POST"));

      const spellbinder = new Spellbinder({
        baseUrl: "https://echo.example.com",
      });

      const schema = z.object({
        method: z.enum(["POST"]),
        args: z.object({}),
        data: z.string(),
        path: z.literal("/post"),
      });

      const body = { data: "Hello, World!" };

      const response = await spellbinder.post({
        url: "/post",
        schema,
        body,
      });

      assert.equal(response.data, JSON.stringify(body));
      assert.equal(response.path, "/post");
    });

    it("appends URL parameters to the request", async () => {
      mockFetch(createEchoHandler("POST"));

      const spellbinder = new Spellbinder({
        baseUrl: "https://echo.example.com",
      });

      const params = { name: "John", age: "30" };

      const schema = z.object({
        method: z.enum(["POST"]),
        data: z.string(),
        path: z.literal("/post"),
        args: z.object({
          name: z.literal("John"),
          age: z.literal("30"),
        }),
      });

      const body = { data: "Hello, World!" };

      const response = await spellbinder.post({
        url: "/post",
        schema,
        body,
        params,
      });

      assert.equal(response.data, JSON.stringify(body));
      assert.deepEqual(response.args, params);
    });

    it("sends multipart/form-data bodies without throwing", async () => {
      mockFetch(createEchoHandler("POST"));

      const spellbinder = new Spellbinder({
        baseUrl: "https://echo.example.com",
      });

      const params = { name: "John", age: "30" };

      const schema = z.object({
        method: z.enum(["POST"]),
        data: z.string(),
        path: z.literal("/"),
        args: z.object({
          name: z.literal("John"),
          age: z.literal("30"),
        }),
      });

      const body = new FormData();
      body.append("name", "John");
      body.append("age", "30");

      const response = await spellbinder.post({
        url: "/",
        schema,
        body,
        params,
      });

      assert.equal(response.method, "POST");
      assert.deepEqual(response.args, params);
    });
  });
});
