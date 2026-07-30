//* Libraries imports
import { describe, it } from "node:test";
import { equal } from "node:assert";

//* Local imports
import { createUrl, createUrlArgs, mergeUrls } from "../src/utils";

describe("URL utilities", () => {
  describe("mergeUrls", () => {
    it("concatenates the base URL with a path that starts with a slash", () => {
      const url = "/users/tamicktom";
      const baseUrl = "https://echo.example.com";

      const mergedUrl = mergeUrls(baseUrl, url);

      equal(mergedUrl, "https://echo.example.com/users/tamicktom");
    });
  });

  describe("createUrlArgs", () => {
    it("builds a query string from an object of parameters", () => {
      const params = { page: 1, limit: 10 };

      const urlParams = createUrlArgs(params);

      equal(urlParams, "?page=1&limit=10");
    });
  });

  describe("createUrl", () => {
    it("builds a full URL when the path starts with a slash", () => {
      const params = { page: 1, limit: 10 };
      const baseUrl = "https://echo.example.com";
      const url = "/users/tamicktom";

      const urlWithParams = createUrl(baseUrl, url, params);

      equal(
        urlWithParams,
        "https://echo.example.com/users/tamicktom?page=1&limit=10"
      );
    });

    it("builds a full URL when the path does not start with a slash", () => {
      const params = { page: 1, limit: 10 };
      const baseUrl = "https://echo.example.com";
      const url = "users/tamicktom";

      const urlWithParams = createUrl(baseUrl, url, params);

      equal(
        urlWithParams,
        "https://echo.example.com/users/tamicktom?page=1&limit=10"
      );
    });
  });
});
