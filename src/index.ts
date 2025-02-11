import { Hono } from "hono";
import userRoute from "./routes/users/users.route";
import mainRoute from "./routes/index";
import { createBunWebSocket } from "hono/bun";
import type { ServerWebSocket } from "bun";

const app = new Hono();
const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

export const routes = app
  .route("/", mainRoute)
  .route("/users", userRoute)
  .get(
    "/ws",
    upgradeWebSocket((c) => {
      return {
        onMessage(event, ws) {
          console.log(`Message from client: ${event.data}`);
          console.log(`Message sent ECHO: ${event.data} `);
          ws.send(`ECHO: ${event.data}`);
        },
        onClose: () => {
          console.log("Connection closed");
        },
      };
    })
  );

export default {
  port: 3000,
  fetch: routes.fetch,
  websocket,
};

export type AppType = typeof routes;
