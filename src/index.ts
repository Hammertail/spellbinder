//* Libraries imports
import z from "zod";

//* Local imports
import { fixUrlEnd, fixUrlStart, mergeUrls } from "./utils";

export class Spellbinder {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public get(url: string) {
    return fetch(mergeUrls(this.baseUrl, url), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public post(url: string, data: any) {
    return fetch(mergeUrls(this.baseUrl, url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  public put(url: string, data: any) {
    return fetch(mergeUrls(this.baseUrl, url), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  public delete(url: string) {
    return fetch(mergeUrls(this.baseUrl, url), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
