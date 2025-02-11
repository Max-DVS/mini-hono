import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { generateRandomName } from "../../utils";
import { db } from "../../db";
import { users } from "../../db/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono()
  .get("/create", async (c) => {
    const name = generateRandomName();

    const [newUser] = await db
      .insert(users)
      .values({
        name,
      })
      .returning();

    return c.json({ user: newUser });
  })
  .get("/list", async (c) => {
    const usersList = await db.select().from(users);

    return c.json({ users: usersList });
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)));

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  })
  .patch(
    "/:id",
    zValidator(
      "json",
      z.object({
        name: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.param();
      const { name } = await c.req.json();

      const [updatedUser] = await db
        .update(users)
        .set({
          name: name,
        })
        .where(eq(users.id, Number(id)))
        .returning({
          id: users.id,
          name: users.name,
        });

      if (!updatedUser) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
        },
      });
    }
  )
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    await db
      .delete(users)
      .where(eq(users.id, Number(id)))
      .returning();

    return c.json(200);
  });

export default app;
