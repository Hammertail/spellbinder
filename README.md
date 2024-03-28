# spellbinder

Spellbinder is a wrapper around the `fetch` API that provides a simple way to make requests to a server and handle the response.
You can use Zod to validate the response data and handle errors in a more structured way.

This is NOT a replacement for the `fetch` API, but a wrapper around it to make it easier and convenient to use.

## Installation

```bash
npm install spellbinder
```

## Usage

```typescript
import { Spellbinder } from "spellbinder";

// Create a new instance of Spellbinder
const spellbinder = new Spellbinder({ baseUrl: "https://api.github.com/" });

// The URL to make the request to
const url = "/users/tamicktom"; // Equivalent to https://api.github.com/users/tamicktom

// The schema to validate the response data
const schema = z.object({
  login: z.string(),
  id: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Make a GET request to the server
const response = await spellbinder.Get({ url, schema });

// Be happy :)
console.log(response);
```
