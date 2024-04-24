
import { isBrowser } from "./isBrowser";

export function parseBody(body: any) {
  let requestBody: BodyInit;
  try {
    if (isBrowser) {
      if (body instanceof FormData) {
        requestBody = body;
      } else if (body instanceof HTMLFormElement) {
        requestBody = new FormData(body);
      } else {
        requestBody = JSON.stringify(body);
      }
    } else {
      if (body instanceof FormData) {
        requestBody = body;
      } else {
        requestBody = JSON.stringify(body);
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("Invalid body type. Please provide a valid body.");
  }

  return requestBody;
}