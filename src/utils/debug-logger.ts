import { SpellError } from "../../dist";


type DebuggerLoggerArgs = {
  httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers: HeadersInit;
  body: any;
  response: Response;
}

export function debugLogger(args: DebuggerLoggerArgs) {
  if (!args.response.ok) {
    console.error(`
        Spellbinder ${args.httpMethod} Request Error
        Request URL: ${args.url}
        Request Headers: ${JSON.stringify(args.headers)}
        Request Body: ${JSON.stringify(args.body)}
      `);

    throw new SpellError(`
      Spellbinder ${args.httpMethod} Request Error
      Request URL: ${args.url}
      Request Headers: ${JSON.stringify(args.headers)}
      Request Body: ${JSON.stringify(args.body)}
    `);
  }

  console.log(`
      Spellbinder ${args.httpMethod} Request Success
      Request URL: ${args.url}
      Request Headers: ${JSON.stringify(args.headers)}
      Request Body: ${JSON.stringify(args.body)}
    `);
}