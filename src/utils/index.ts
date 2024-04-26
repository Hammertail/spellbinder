//* Libraries imports
import type z from "zod";

export {
  createUrl,
  createUrlParams as createUrlArgs,
  fixUrlEnd,
  fixUrlStart,
  mergeUrls,
} from "./url";

export function validateData<T>(data: any, schema: z.ZodSchema<T>): T {
  const validated = schema.safeParse(data);
  if (!validated.success) {
    throw new SpellError(validated.error.message);
  }

  return validated.data;
}

export function safeValidateData<T>(
  data: any,
  schema: z.ZodSchema<T>
): T | z.ZodError {
  const validated = schema.safeParse(data);
  if (!validated.success) {
    return validated.error;
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