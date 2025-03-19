import { describe, it, expect } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useRoleStore } from "../roleStore.js";

describe("Role Store", () => {
  setActivePinia(createPinia());

  it("fetches roles successfully", async () => {
    const store = useRoleStore();
    await store.fetchRoles();

    // Check that roles were fetched (non-empty array)
    expect(store.roles.length).toBeGreaterThan(0);

    // Optionally, check that the first role has an "id" property
    expect(store.roles[0]).toHaveProperty("id");
  });
});
