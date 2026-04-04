/**
 * This ideia is that, with API routes, we can create a more flexible and scalable way to handle requests.
 * 
 * We can define all the avaliable routes in the backend, use zod schemas to validate input, output, incoming and outgoing data...
 * 
 * Heres is an ideia of how the library API could look like:
 * 
 * PS: This is just an ideia, not a real implementation.
 * PS2: ignore the errors and warnings, this is just a ideia.
 */

// today, the library works like that:

// first, we import the spellbinder class

import { Spellbinder } from "spellbinder";
import z from "zod";

// then, we create a new instance of the spellbinder class

const spellbinder = new Spellbinder({
    baseUrl: "https://api.example.com",
});

// then we can make a request to the API

const response = await spellbinder.post({
    url: "/users",
    body: {
        name: "John Doe",
        email: "john.doe@example.com",
    },
    schema: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
    }),
});

// in theory, we are making a POST request to "https://api.example.com/users" and validating the response data with the zod schema
// but... how can we be sure that the request is made to the correct URL? and how can we be sure that the request is made with the correct body?

// in my ideia, we can define all the avaliable routes BEFORE creating the spellbinder instance.
// so we will have a new class, the `SpellbinderRoutes` class.

import { SpellbinderRoutes, SpellbinderRoute } from "spellbinder";

// with this class, we can define all the avaliable routes.
// using our last example, we can define the `createUserRoute` like this:

const createUserRoute = new SpellbinderRoute({
    url: "/users",
    method: "POST",
    body: {
        type: "application/json",
        schema: z.object({
            name: z.string(),
            email: z.string(),
        }),
    },
    response: {
        type: "application/json",
        schema: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
        }),
    },
    // when a request fails, we can try to parse the error response with a specific zod schema...
    error: {
        "400": {
            type: "application/json",
            schema: z.object({
                error: z.string(),
            }),
        }
    }
});

// then, we can add the route to the `SpellbinderRoutes` class

const routes = new SpellbinderRoutes().addRoute(createUserRoute);

// finally, we can add the routes to the spellbinder instance

const spellbinder = new Spellbinder({
    baseUrl: "https://api.example.com",
    routes,
});

// so now, when we make a request to the API, the library will automatically use the correct route based on the URL and method.

spellbinder.post({
    url: "/users", // typesafe url, because we defined the route with the url "/users"
    body: { // typesafe body, because we defined the body schema with the zod schema
        name: "John Doe",
        email: "john.doe@example.com",
    }
}).then((response) => {
    console.log(response); // typesafe response, because we defined the response schema with the zod schema
}).catch((error) => {
    // maybe typesafe error, because we defined the error schema with the zod schema
    // errors in typescript are hard to handle... but we can try to parse the error with the zod schema
    console.error(error);
});