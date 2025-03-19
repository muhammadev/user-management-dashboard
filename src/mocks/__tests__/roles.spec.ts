import { describe, it, expect } from "vitest";
import { mockRoles } from "../mockData/mockRoles.js";

describe("Roles Handler", () => {
  it("should return mock roles data for GET /api/roles", async () => {
    const response = await fetch("/api/roles");
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockRoles);
  });
});
