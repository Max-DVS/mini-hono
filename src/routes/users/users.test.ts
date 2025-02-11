import { testClient } from "hono/testing";
import { beforeAll, describe, expect, it } from "bun:test";
import userRoute from "./users.route";
import { db } from "../../db";
import { users } from "../../db/schema";

type UserResponse = {
  user: {
    id: number;
    name: string;
  };
};

async function prepareDatabase() {
  await db.delete(users);

  await db.insert(users).values({
    name: "PeskySultan",
    id: 1,
  });
}

describe("Users Route Tests", () => {
  const client = testClient(userRoute);

  beforeAll(async () => {
    await prepareDatabase();
  });

  it("should create a new user", async () => {
    const response = await client.create.$get();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).not.toBeNull();
    expect(data.user).toHaveProperty("id");
    expect(data.user).toHaveProperty("name");
  });

  it("should get a list of users", async () => {
    const response = await client.list.$get();
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(data.users)).toBe(true);
  });

  it("should get a user by ID and check it has a name ", async () => {
    const userId = 1;
    const response = await client[":id"].$get({
      param: {
        id: userId.toString(),
      },
    });

    const data = (await response.json()) as UserResponse;

    expect(response.status).toBe(200);

    expect(data.user).toHaveProperty("name");
  });

  it("should update a user and check that it has a name", async () => {
    const userId = 1; // Replace with a valid user ID

    await client[":id"].$patch({
      param: { id: userId.toString() },
      json: { name: "Sultan-Pesky" },
    });

    const element = await client[":id"].$get({
      param: { id: userId.toString() },
    });

    const data = (await element.json()) as UserResponse;

    expect(data.user).toHaveProperty("name", "Sultan-Pesky");
  });

  it("should delete a user", async () => {
    const userId = 1;

    const response = await client[":id"].$delete({
      param: { id: userId.toString() },
    });

    expect(response.status).toBe(200);
  });
});
