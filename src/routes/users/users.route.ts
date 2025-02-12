import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

export const createAnonUser = createRoute({
  tags: ["user"],
  method: "get",
  path: "/users/create",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
      "The created user name",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Error generating a random user",
    ),
  },
});

export const list = createRoute({
  tags: ["user"],
  method: "get",
  path: "/users",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
        }),
      ),
      "The list of registered users",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Error listing users",
    ),
  },
});

export const updateName = createRoute({
  tags: ["user"],
  method: "patch",
  path: "/users/:id",
  request: {
    body: jsonContentRequired(
      z.object({
        name: z.string(),
      }),
      "The user fields to update",
    ),
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.number(),
        name: z.string(),
      },
      ),
      "The updated user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Error updating user",
    ),
  },
});

export const listUserById = createRoute({
  tags: ["user"],
  method: "get",
  path: "/users/:id",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
      "The user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Error listing user",
    ),
  },
});

export const deleteUserById = createRoute({
  tags: ["user"],
  method: "delete",
  path: "/users/:id",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: "User successfully deleted",
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Error deleting user",
    ),
  },
});

export type CreateAnonUserRoute = typeof createAnonUser;
export type ListUsersRoute = typeof list;
export type UpdateNameRoute = typeof updateName;
export type ListuserByIdRoute = typeof listUserById;
export type DeleteUserByIdRoute = typeof deleteUserById;
