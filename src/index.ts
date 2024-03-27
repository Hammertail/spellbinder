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
} from "./utils";

type PostArgs<T> = {
  url: string;
  body: string | object;
  headers?: HeadersInit;
  schema: z.ZodSchema<T>;
};

type GetArgs<T> = {
  url: string;
  headers?: HeadersInit;
  schema: z.ZodSchema<T>;
};

type ConstructorArgs = {
  baseUrl: string;
  defaultHeaders?: () => HeadersInit;
};

export class Spellbinder {
  private baseUrl: string;
  private defaultHeaders = getDefaultHeaders;

  constructor(args: ConstructorArgs) {
    this.baseUrl = args.baseUrl;
    if (args.defaultHeaders) {
      this.defaultHeaders = args.defaultHeaders;
    }
  }

  async Post<T>(params: PostArgs<T>): Promise<T> {
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

  async Get<T>(params: GetArgs<T>): Promise<T> {
    const url = mergeUrls(this.baseUrl, params.url);
    const headers = params.headers || this.defaultHeaders();

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    return validateData(data, params.schema);
  }
}
