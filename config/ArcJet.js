import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/next";


export const aj = arcjet({
  key: process.env.ARCJET_KEY, // Your Arcjet key from https://app.arcjet.com
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"], // Allow Google, Bing, etc.
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
