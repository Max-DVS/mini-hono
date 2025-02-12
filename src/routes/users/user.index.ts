import { createRouter } from "@/lib/create-app";

import * as handlers from "./user.handler";
import * as routes from "./users.route";

const router = createRouter()
  .openapi(routes.createAnonUser, handlers.createAnonUser)
  .openapi(routes.list, handlers.list)
  .openapi(routes.updateName, handlers.updateName)
  .openapi(routes.listUserById, handlers.listUserById)
  .openapi(routes.deleteUserById, handlers.deleteUserById);

export default router;
