import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: "ec-app",
  apiKey: process.env.API_KEY!,
});
