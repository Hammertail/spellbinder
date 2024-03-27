//* Libraries imports
import { Effect } from "effect";
import z from "zod";

/**
 * Add "/" to the end of the url if it doesn't have it
 */

export function fixUrlEnd(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * Remove "/" from the start of the url if it has it
 */

export function fixUrlStart(url: string) {
  return url.startsWith("/") ? url.slice(1) : url;
}

/**
 * Merge two urls
 */

export function mergeUrls(baseUrl: string, url: string) {
  return `${fixUrlEnd(baseUrl)}${fixUrlStart(url)}`;
}

export function validateData<T>(data: any, schema: z.ZodSchema<T>): T {
  const validated = schema.safeParse(data);
  if (!validated.success) {
    throw new SpellError(validated.error.message);
  }

  return validated.data;
}

export function safeValidateData<T>(data: any, schema: z.ZodSchema<T>): T | null {
  const validated = schema.safeParse(data);
  if (!validated.success) {
    return null;
  }

  return validated.data;
}

export const getDefaultHeaders = (): HeadersInit => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  return defaultHeaders;
};

export class SpellError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpellError";
  }
}