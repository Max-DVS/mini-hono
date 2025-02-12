import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

import env from "@/env";

export function honoPinoLogger() {
  return logger({
    pino: pino(
      {
        level: env.NODE_ENV === "production" ? "info" : "debug",
      },
      env.NODE_ENV === "production"
        ? undefined
        : pretty({
            colorize: true,
          }),
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
