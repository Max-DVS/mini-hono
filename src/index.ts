import type { ServerWebSocket } from "bun";

import { createBunWebSocket } from "hono/bun";

import app from "./app";
import env from "./env";

const { websocket } = createBunWebSocket<ServerWebSocket>();

const port = env.PORT ?? 3000;

export default {
  port,
  fetch: app.fetch,
  websocket,
};
