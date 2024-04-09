import { test, it, describe } from "node:test";
import { equal } from "node:assert";
import assert from "node:assert";

import z from "zod";

import { Spellbinder, SpellError } from "../src";

test("Spellbinder Post tests", async () => {
  await it("should return the correct data", async () => {
    const url = "/";
    const spellbinder = new Spellbinder({
      baseUrl: "https://echo.hoppscotch.io",
    });

    const schema = z.object({
      method: z.enum(["POST"]),
      args: z.object({}),
      data: z.string(),
      path: z.string(),
    });

    const body = { data: "Hello, World!" };

    const response = await spellbinder.post({
      url,
      schema,
      body,
    });

    assert(response.data === JSON.stringify(body));
  });

  await it("should throw an error if the schema is incorrect", async () => {
    const url = "/";
    const spellbinder = new Spellbinder({
      baseUrl: "https://echo.hoppscotch.io",
    });

    const schema = z.object({
      method: z.enum(["POST"]),
      args: z.object({}),
      data: z.number(),
      path: z.number(),
    });

    const body = { data: "Hello, World!" };

    try {
      await spellbinder.post({
        url,
        schema,
        body,
      });
    } catch (error) {
      assert(error instanceof SpellError);
    }
  });

  await it("should work with custom headers", async () => {
    const url = "/";
    const spellbinder = new Spellbinder({
      baseUrl: "https://echo.hoppscotch.io",
    });

    const schema = z.object({
      method: z.enum(["POST"]),
      args: z.object({}),
      data: z.string(),
      path: z.string(),
    });

    const body = { data: "Hello, World!" };

    const response = await spellbinder.post({
      url,
      schema,
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    assert(response.data === JSON.stringify(body));
  });

  await it("should work with another route", async () => {
    const url = "/post";
    const spellbinder = new Spellbinder({
      baseUrl: "https://echo.hoppscotch.io",
    });

    const schema = z.object({
      method: z.enum(["POST"]),
      args: z.object({}),
      data: z.string(),
      path: z.literal("/post"),
    });

    const body = { data: "Hello, World!" };

    const response = await spellbinder.post({
      url,
      schema,
      body,
    });

    assert(response.data === JSON.stringify(body));
  });

  // await it("should work with URL parameters", async () => {
  //   const url = "/post?name=John&age=30";
  //   const spellbinder = new Spellbinder({
  //     baseUrl: "https://echo.hoppscotch.io",
  //   });

  //   const schema = z.object({
  //     method: z.enum(["POST"]),
  //     data: z.string(),
  //     path: z.literal("/post"),
  //     args: z.object({
  //       name: z.literal("John"),
  //       age: z.literal("30"),
  //     }),
  //   });

  //   const body = { data: "Hello, World!" };

  //   const response = await spellbinder.post({
  //     url,
  //     schema,
  //     body,
  //   });

  //   assert(response.data === JSON.stringify(body));
  // });
});
