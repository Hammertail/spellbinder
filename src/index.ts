//* Libraries imports
import { Effect } from "effect";
import z from "zod";

//* Local imports
import {
  fixUrlEnd,
  fixUrlStart,
  mergeUrls,
  validateData,
  safeValidateData,
  getDefaultHeaders,
  SpellError,
} from "./utils";

interface PostArgs<T> extends RequestInit {
  url: string;
  schema: z.ZodSchema<T>;
}

interface GetArgs<T> extends RequestInit {
  url: string;
  schema: z.ZodSchema<T>;
}

interface PutArgs<T> extends PostArgs<T> {}
interface PatchArgs<T> extends PostArgs<T> {}
interface DeleteArgs<T> extends GetArgs<T> {}

type ConstructorArgs = {
  baseUrl: string;
  defaultHeaders?: () => HeadersInit;
};

/**
 * Basic class to make requests to an API. It has methods to make POST, GET, PUT, PATCH and DELETE requests.
 * Usage example:
 * ```typescript
 * const spellbinder = new Spellbinder({ baseUrl: "https://api.example.com" });
 *
 * const data = await spellbinder.Get({
 *  url: "users",
 *  schema: z.array(z.object({
 *  id: z.string(),
 *  name: z.string(),
 * })),
 * ```
 */

class Spellbinder {
  private baseUrl: string;
  private defaultHeaders = getDefaultHeaders;

  public Post = this.post;
  public Get = this.get;
  public Put = this.put;
  public Patch = this.patch;
  public Delete = this.delete;

  constructor(args: ConstructorArgs) {
    this.baseUrl = args.baseUrl;
    if (args.defaultHeaders) {
      this.defaultHeaders = args.defaultHeaders;
    }
  }

  public async post<T>(params: PostArgs<T>): Promise<T> {
    const url = mergeUrls(this.baseUrl, params.url);
    const headers = params.headers || this.defaultHeaders();
    const body = params.body;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });

    const data = await response.json();

    return validateData(data, params.schema);
  }

  public async get<T>(params: GetArgs<T>): Promise<T> {
    const url = mergeUrls(this.baseUrl, params.url);
    const headers = params.headers || this.defaultHeaders();

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    return validateData(data, params.schema);
  }

  public async put<T>(params: PutArgs<T>): Promise<T> {
    const url = mergeUrls(this.baseUrl, params.url);
    const headers = params.headers || this.defaultHeaders();
    const body = params.body;

    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });

    const data = await response.json();

    return validateData(data, params.schema);
  }

  public async patch<T>(params: PatchArgs<T>): Promise<T> {
    const url = mergeUrls(this.baseUrl, params.url);
    const headers = params.headers || this.defaultHeaders();
    const body = params.body;

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers,
    });

    const data = await response.json();

    return validateData(data, params.schema);
  }

  public async delete<T>(params: DeleteArgs<T>): Promise<T> {
    const url = mergeUrls(this.baseUrl, params.url);
    const headers = params.headers || this.defaultHeaders();

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    return validateData(data, params.schema);
  }
}

export { Spellbinder, SpellError };
