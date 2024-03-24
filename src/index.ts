//* Libraries imports
import z from "zod";

//* Local imports
import { fixUrlEnd, fixUrlStart, mergeUrls } from "./utils";

type PostArgs<T> = {
  url: string;
  body: string | object;
  headers?: HeadersInit;
  schema: z.ZodSchema<T>;
};

export const getDefaultHeaders = (): HeadersInit => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  return defaultHeaders;
};

class SpellError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpellError";
  }
}

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

    const validated = params.schema.safeParse(data);
    if (!validated.success) {
      throw new SpellError(validated.error.message);
    }

    return validated.data;
  }
}
