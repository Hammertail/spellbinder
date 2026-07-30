//* Libraries imports
import { mock } from "node:test";

export type FetchMockHandler = (
  url: string,
  init?: RequestInit
) => Promise<Response> | Response;

/**
 * Replaces global `fetch` with a mock handler for the duration of the current test.
 * Call `mock.restoreAll()` in `afterEach` to clean up.
 */
export function mockFetch(handler: FetchMockHandler) {
  return mock.method(
    globalThis,
    "fetch",
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      return handler(url, init);
    }
  );
}

/**
 * Builds a JSON `Response` suitable for Spellbinder's `response.json()` usage.
 */
export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

/**
 * Echo-style handler that mirrors hoppscotch/httpbin-like APIs used by the old tests.
 * Returns method, path, query args and the request body as a string.
 */
export function createEchoHandler(method: string): FetchMockHandler {
  return async (url, init) => {
    const parsed = new URL(url);
    const args: Record<string, string> = {};

    parsed.searchParams.forEach((value, key) => {
      args[key] = value;
    });

    let data = "";

    if (typeof init?.body === "string") {
      data = init.body;
    } else if (init?.body instanceof FormData) {
      data = JSON.stringify(Object.fromEntries(init.body.entries()));
    }

    return jsonResponse({
      method,
      args,
      data,
      path: parsed.pathname === "" ? "/" : parsed.pathname,
    });
  };
}
