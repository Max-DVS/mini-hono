import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  return c.json({ message: "The service is alive" });
});

export default app;
