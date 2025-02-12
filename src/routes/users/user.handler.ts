import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { users } from "@/db/schema";
import { generateRandomName } from "@/utils";

import type { CreateAnonUserRoute, DeleteUserByIdRoute, ListuserByIdRoute, ListUsersRoute, UpdateNameRoute } from "./users.route";

export const createAnonUser: AppRouteHandler<CreateAnonUserRoute> = async (c) => {
  c.var.logger.debug("Creating a new anon user");

  const name = generateRandomName();

  try {
    const [newUser] = await db
      .insert(users)
      .values({
        name,
      })
      .returning();

    return c.json({
      name: newUser.name,
      id: newUser.id,
    }, HttpStatusCodes.OK);
  }
  catch (e) {
    c.var.logger.error(e);
    return c.json({
      message: "Could not create user",
    }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }
};
export const list: AppRouteHandler<ListUsersRoute> = async (c) => {
  c.var.logger.debug("Listing Users");

  try {
    const getUsers = await db.select().from(users);
    return c.json(getUsers, HttpStatusCodes.OK);
  }
  catch (e) {
    c.var.logger.error(e);
    return c.json({
      message: "Could not list users",
    }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }
};

export const updateName: AppRouteHandler<UpdateNameRoute> = async (c) => {
  c.var.logger.debug("Updating a user by id");

  const { id } = c.req.param();
  const { name } = await c.req.json();

  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        name,
      })
      .where(eq(users.id, +id))
      .returning();
    return c.json({
      id: updatedUser.id,
      name: updatedUser.name,
    }, HttpStatusCodes.OK);
  }
  catch (e) {
    c.var.logger.error(e);
    return c.json({
      message: "Could not update user",
    }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }
};

export const listUserById: AppRouteHandler<ListuserByIdRoute> = async (c) => {
  c.var.logger.debug("Updating a user by id");

  const { id } = c.req.param();

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, +id));
    return c.json(user, HttpStatusCodes.OK);
  }
  catch (e) {
    c.var.logger.error(e);
    return c.json({
      message: "Could not update user",
    }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }
};

export const deleteUserById: AppRouteHandler<DeleteUserByIdRoute> = async (c) => {
  c.var.logger.debug("Deleting a user by id");

  const { id } = c.req.param();

  try {
    await db.delete(users)
      .where(eq(users.id, +id));
    return c.json({
      message: "User successfully deleted",
    }, HttpStatusCodes.OK);
  }
  catch (e) {
    c.var.logger.error(e);
    return c.json({
      message: "Could not update user",
    }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }
};
