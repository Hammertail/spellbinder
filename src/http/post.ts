import { getDefaultHeaders } from "../utils";

type POSTProps = {
  url: string;
  headers?: Record<string, string>;
  body: Record<string, any>;
};

export async function POST(args: POSTProps) {
  const headers = args.headers || getDefaultHeaders();
  const body = JSON.stringify(args.body);
  const response = await fetch(args.url, {
    method: "POST",
    headers,
    body,
  });
  return await response.json();
}
