import { describe, it, expect } from "vitest";
import { validateSessionToken } from "../handlers/auth.js";
import * as jose from "jose";
import { mockRoles } from "@/mocks/mockData/mockRoles";

describe("Auth Handlers", () => {
  it("should generate a sessionToken on login", async () => {
    const loginPayload = {
      id: 0,
      role: mockRoles[0].id
    };

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginPayload)
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("sessionToken");
    expect(typeof data.sessionToken).toBe("string");

    // Decode the JWT token to ensure it has the correct payload.
    const decoded = jose.decodeJwt(data.sessionToken);
    expect(decoded).toHaveProperty("id", loginPayload.id);
  });

  it("should clear sessionToken on logout", async () => {
    // First, simulate a login to set the sessionToken
    const loginPayload = {
      id: 0,
      role: mockRoles[0].id
    };

    const loginResponse = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginPayload)
    });
    const loginData = await loginResponse.json();
    expect(loginData).toHaveProperty("sessionToken");

    // Now, call the logout endpoint
    const logoutResponse = await fetch("/api/logout", {
      method: "POST"
    });
    // Assuming HttpResponse returns a 200 status on success
    expect(logoutResponse.status).toBe(200);

    // After logout, validateSessionToken should return false
    const isValid = validateSessionToken(loginData.sessionToken);
    expect(isValid).toBe(false);
  });
});
