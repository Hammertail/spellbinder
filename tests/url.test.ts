import { test, it, describe } from "node:test";
import { equal } from "node:assert";
import assert from "node:assert";

import z from "zod";

import {
  createUrl,
  createUrlArgs,
  fixUrlEnd,
  fixUrlStart,
  getDefaultHeaders,
  mergeUrls
} from "../src/utils";

test("Url Params functions test", async () => {
  await it("should return the correct url", async () => {
    const url = "/users/tamicktom";
    const baseIrl = "https://echo.hoppscotch.io";

    const mergedUrl = mergeUrls(baseIrl, url);

    equal(mergedUrl, "https://echo.hoppscotch.io/users/tamicktom");
  });

  await it("should create the right url with url params", async () => {
    const params = { page: 1, limit: 10 };

    const urlParams = createUrlArgs(params);

    equal(urlParams, "?page=1&limit=10");
  });

  await it("should create the right url with url params and base url", async () => {
    const params = { page: 1, limit: 10 };
    const baseUrl = "https://echo.hoppscotch.io";
    const url = "/users/tamicktom";

    const urlWithParams = createUrl(baseUrl, url, params);

    equal(urlWithParams, "https://echo.hoppscotch.io/users/tamicktom?page=1&limit=10");
  });

  await it("should create the right url with url params and base url", async () => {
    const params = { page: 1, limit: 10 };
    const baseUrl = "https://echo.hoppscotch.io";
    const url = "users/tamicktom";

    const urlWithParams = createUrl(baseUrl, url, params);

    equal(urlWithParams, "https://echo.hoppscotch.io/users/tamicktom?page=1&limit=10");
  });
});
