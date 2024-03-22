import { getDefaultHeaders } from "../utils";

type GETProps = {
  url: string;
  headers?: Record<string, string>;
};

export async function GET(args: GETProps) {
  const headers = args.headers || getDefaultHeaders();
  const response = await fetch(args.url, {
    headers,
  });
  return await response.json();
}
