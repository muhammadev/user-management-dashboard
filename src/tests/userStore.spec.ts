import { describe, it, expect } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "../stores/userStore";

describe("User Store", () => {
  setActivePinia(createPinia());

  it("fetches users", async () => {
    const store = useUserStore();
    await store.fetchUsers();
    expect(store.users.length).toBeGreaterThan(0);
  });
});
