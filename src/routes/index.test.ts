import { describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";

import mainRoute from "./index";

describe("Root Endpoint Tests", () => {
  const client = testClient(mainRoute);

  it("should return a 200 status and correct message format", async () => {
    const response = await client.index.$get();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "The service is alive" });
  });

  it("should return JSON content type", async () => {
    const response = await client.index.$get();
    expect(response.headers.get("content-type")).toMatch(/application\/json/);
  });

  it("should connect to WebSocket endpoint and echo message", (done) => {
    const ws = new WebSocket("ws://localhost:3000/ws");

    ws.onopen = () => {
      ws.send("Hello Server");
    };

    ws.onmessage = (event) => {
      expect(event.data).toBe("ECHO: Hello Server");
      ws.close();
      done();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      done(error);
    };
  });
});
