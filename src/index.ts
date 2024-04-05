//* Libraries imports
import { Effect, Request } from "effect";
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

interface BaseArgs<T> extends RequestInit {
  url: string;
  schema: z.ZodSchema<T>;
}

interface PostArgs<T> extends BaseArgs<T> {
  body: any; // justification: any type is needed here to allow any type of body
}

interface GetArgs<T> extends BaseArgs<T> {}
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

  public async post<T>({
    url,
    schema,
    headers,
    body,
    ...rest
  }: PostArgs<T>): Promise<T> {
    const requestUrl = mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || this.defaultHeaders();
    const requestBody = body;

    const response = await fetch(requestUrl, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: requestHeaders,
      ...rest,
    });

    const data = await response.json();

    return validateData(data, schema);
  }

  public async get<T>({
    url,
    schema,
    headers,
    ...rest
  }: GetArgs<T>): Promise<T> {
    const requestUrl = mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || this.defaultHeaders();

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: requestHeaders,
      ...rest,
    });

    const data = await response.json();

    return validateData(data, schema);
  }

  public async put<T>({
    url,
    schema,
    headers,
    body,
    ...rest
  }: PutArgs<T>): Promise<T> {
    const requestUrl = mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || this.defaultHeaders();
    const requestBody = body;

    const response = await fetch(requestUrl, {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: requestHeaders,
      ...rest,
    });

    const data = await response.json();

    return validateData(data, schema);
  }

  public async patch<T>({
    url,
    schema,
    headers,
    body,
    ...rest
  }: PatchArgs<T>): Promise<T> {
    const requestUrl = mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || this.defaultHeaders();
    const requestBody = body;

    const response = await fetch(requestUrl, {
      method: "PATCH",
      body: JSON.stringify(requestBody),
      headers: requestHeaders,
      ...rest,
    });

    const data = await response.json();

    return validateData(data, schema);
  }

  public async delete<T>({
    url,
    schema,
    headers,
    ...rest
  }: DeleteArgs<T>): Promise<T> {
    const requestUrl = mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || this.defaultHeaders();

    const response = await fetch(requestUrl, {
      method: "DELETE",
      headers: requestHeaders,
      ...rest,
    });

    const data = await response.json();

    return validateData(data, schema);
  }
}

export { Spellbinder, SpellError };
