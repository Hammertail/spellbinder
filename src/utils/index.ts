export function getDefaultHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

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
