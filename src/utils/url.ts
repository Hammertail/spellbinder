/**
 * This function creates a query string from an object.
 * 
 * example:
 * 
 * createUrlArgs({ page: 1, limit: 10 }) => "?page=1&limit=10"
 */

export function createUrlParams(
  args: Record<string | number, string | number>
): string {
  return Object.entries(args).reduce((acc, [key, value], index) => {
    return `${acc}${index === 0 ? "?" : "&"}${key}=${value}`;
  }, "");
}

/**
 * This function concatenates the baseUrl with the url and creates a query string from the args.
 * 
 * example:
 * 
 * createUrl("https://example.com", "/users", { page: 1, limit: 10 }) => "https://example.com/users?page=1&limit=10"
 */

export function createUrl(
  baseUrl: string,
  url: string,
  args: Record<string | number, string | number>
): string {
  const mergedUrl = mergeUrls(baseUrl, url);
  const urlParams = createUrlParams(args);

  if (mergedUrl.endsWith("?"))
    return `${mergedUrl}${urlParams.slice(1)}`;

  if (mergedUrl.endsWith("/"))
    return `${mergedUrl.slice(0, -1)}${urlParams}`;

  return `${mergeUrls(baseUrl, url)}${createUrlParams(args)}`;
}

/**
 * Add "/" to the end of the url if it doesn't have it.
 * 
 * example:
 * 
 * fixUrlEnd("https://example.com") => "https://example.com/"
 */

export function fixUrlEnd(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * Remove "/" from the start of the url if it has it.
 * 
 * example:
 * 
 * fixUrlStart("/users") => "users"
 */

export function fixUrlStart(url: string) {
  return url.startsWith("/") ? url.slice(1) : url;
}

/**
 * Merge two urls. It adds "/" to the end of the baseUrl and removes "/" from the start of the url.
 * 
 * example:
 * 
 * mergeUrls("https://example.com", "/users") => "https://example.com/users"
 */

export function mergeUrls(baseUrl: string, url: string) {
  return `${fixUrlEnd(baseUrl)}${fixUrlStart(url)}`;
}