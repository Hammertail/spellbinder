//* Libraries imports
import type z from "zod";

//* Local imports
import {
  mergeUrls,
  validateData,
  getDefaultHeaders,
  createUrl
} from "./utils";
import { parseBody } from "./utils/parse-body";
import { debugLogger } from "./utils/debug-logger";

type Params = Record<string | number, string | number>;

interface BaseArgs<T> extends RequestInit {
  url: string;
  schema: z.ZodSchema<T>;
  params?: Params;
}

interface PostArgs<T> extends BaseArgs<T> {
  body: any;
}

interface GetArgs<T> extends BaseArgs<T> { }
interface PutArgs<T> extends PostArgs<T> { }
interface PatchArgs<T> extends PostArgs<T> { }
interface DeleteArgs<T> extends GetArgs<T> { }

type ConstructorArgs = {
  baseUrl: string;
  debug?: boolean;
  defaultHeaders?: () => Promise<HeadersInit>;
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

export class Spellbinder {
  private baseUrl: string;
  private DEBUG = false;
  private defaultHeaders = getDefaultHeaders;

  constructor(args: ConstructorArgs) {
    this.baseUrl = args.baseUrl;

    if (args.debug) {
      this.DEBUG = args.debug;
    }

    if (args.defaultHeaders) {
      this.defaultHeaders = args.defaultHeaders;
    }
  }

  public async get<T>({
    url,
    schema,
    headers,
    params,
    ...rest
  }: GetArgs<T>): Promise<T> {
    const requestUrl = params ? createUrl(this.baseUrl, url, params) : mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || await this.defaultHeaders();

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: requestHeaders,
      ...rest,
    });

    if (this.DEBUG) {
      debugLogger({
        httpMethod: "GET",
        url: requestUrl,
        headers: requestHeaders,
        body: null,
        response,
      });
    }

    const data = await response.json();

    return validateData(data, schema);
  }

  public async post<T>({
    url,
    schema,
    headers,
    body,
    params,
    ...rest
  }: PostArgs<T>): Promise<T> {
    const requestUrl = params ? createUrl(this.baseUrl, url, params) : mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || await this.defaultHeaders();
    const requestBody = parseBody(body);

    if (requestBody instanceof FormData) {
      if (requestHeaders) {
        // @ts-ignore
        requestHeaders["Content-Type"] = "multipart/form-data";
      }
    }

    const response = await fetch(requestUrl, {
      method: "POST",
      body: requestBody,
      headers: requestHeaders,
      ...rest,
    });

    if (this.DEBUG) {
      debugLogger({
        httpMethod: "POST",
        url: requestUrl,
        headers: requestHeaders,
        body: requestBody,
        response,
      });
    }

    const data = await response.json();

    return validateData(data, schema);
  }

  public async put<T>({
    url,
    schema,
    headers,
    body,
    params,
    ...rest
  }: PutArgs<T>): Promise<T> {
    const requestUrl = params ? createUrl(this.baseUrl, url, params) : mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || await this.defaultHeaders();
    const requestBody = parseBody(body);

    if (requestBody instanceof FormData) {
      if (requestHeaders) {
        // @ts-ignore
        requestHeaders["Content-Type"] = "multipart/form-data";
      }
    }

    const response = await fetch(requestUrl, {
      method: "PUT",
      body: requestBody,
      headers: requestHeaders,
      ...rest,
    });

    if (this.DEBUG) {
      debugLogger({
        httpMethod: "PUT",
        url: requestUrl,
        headers: requestHeaders,
        body: requestBody,
        response,
      });
    }

    const data = await response.json();

    return validateData(data, schema);
  }

  public async patch<T>({
    url,
    schema,
    headers,
    body,
    params,
    ...rest
  }: PatchArgs<T>): Promise<T> {
    const requestUrl = params ? createUrl(this.baseUrl, url, params) : mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || await this.defaultHeaders();
    const requestBody = parseBody(body);

    if (requestBody instanceof FormData) {
      if (requestHeaders) {
        // @ts-ignore
        requestHeaders["Content-Type"] = "multipart/form-data";
      }
    }

    const response = await fetch(requestUrl, {
      method: "PATCH",
      body: requestBody,
      headers: requestHeaders,
      ...rest,
    });

    if (this.DEBUG) {
      debugLogger({
        httpMethod: "PATCH",
        url: requestUrl,
        headers: requestHeaders,
        body: requestBody,
        response,
      });
    }

    const data = await response.json();

    return validateData(data, schema);
  }

  public async delete<T>({
    url,
    schema,
    headers,
    params,
    ...rest
  }: DeleteArgs<T>): Promise<T> {
    const requestUrl = params ? createUrl(this.baseUrl, url, params) : mergeUrls(this.baseUrl, url);
    const requestHeaders = headers || await this.defaultHeaders();

    const response = await fetch(requestUrl, {
      method: "DELETE",
      headers: requestHeaders,
      ...rest,
    });

    if (this.DEBUG) {
      debugLogger({
        httpMethod: "DELETE",
        url: requestUrl,
        headers: requestHeaders,
        body: null,
        response,
      });
    }

    const data = await response.json();

    return validateData(data, schema);
  }
}