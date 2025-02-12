import type { ServerWebSocket } from "bun";

import { createBunWebSocket } from "hono/bun";

import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import indexRoute from "./routes/index.route";
import usersRoute from "./routes/users/user.index";

const app = createApp();

configureOpenApi(app);
const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

export const routes = app
  .route("/", indexRoute)
  .route("/", usersRoute)
  .get(
    "/ws",
    upgradeWebSocket((c) => {
      c.var.logger.debug("WebSocket connected");
      return {
        onMessage(event, ws) {
          c.var.logger.info(`Message from client: ${event.data}`);
          c.var.logger.info(`Message sent ECHO: ${event.data} `);
          ws.send(`ECHO: ${event.data}`);
        },
        onClose: () => {
          c.var.logger.info("Connection closed");
        },
      };
    }),
  );

export default routes;
