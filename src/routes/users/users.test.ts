import { beforeAll, describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";

import app from "@/app";

import { db } from "../../db";
import { users } from "../../db/schema";

// interface UserResponse {
//   user: {
//     id: number;
//     name: string;
//   };
// }

async function prepareDatabase() {
    await db.delete(users);

    await db.insert(users).values({
        name: "PeskySultan",
        id: 1,
    });
}

describe("Users Route Tests", () => {
    const client = testClient(app);

    beforeAll(async () => {
        await prepareDatabase();
    });

    it("should create a new user", async () => {
        const response = await client.users.create.$get();

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).not.toBeNull();
        expect(data).toHaveProperty("id");
        expect(data).toHaveProperty("name");
    });

    it("should get a list of users", async () => {
        const response = await client.users.$get();
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
    });

    it("should get a user by ID and check it has a name ", async () => {
        const userId = 1;
        const response = await client.users[":id"].$get({
            param: {
                id: userId.toString(),
            },
        });
        const data = (await response.json());
        expect(response.status).toBe(200);
        expect(data).toHaveProperty("name");
    });

    it("should update a user and check that it has a name", async () => {
        const userId = 1;
        await client.users[":id"].$patch({
            param: { id: userId.toString() },
            json: { name: "Sultan-Pesky" },
        });
        const element = await client.users[":id"].$get({
            param: { id: userId.toString() },
        });
        const data = await element.json();
        expect(data).toHaveProperty("name", "Sultan-Pesky");
    });

    it("should delete a user", async () => {
        const userId = 1;

        const response = await client.users[":id"].$delete({
            param: { id: userId.toString() },
        });

        expect(response.status).toBe(200);
    });
});
