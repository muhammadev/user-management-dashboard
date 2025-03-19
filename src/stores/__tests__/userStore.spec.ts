import { describe, it, expect } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "../userStore.js";
import { mockRoles } from "@/mocks/mockData/mockRoles";
import { mockUsers } from "@/mocks/mockData/mockUsers";
import { StatusEnum } from "@/types/Status";

describe("User Store", () => {
  setActivePinia(createPinia());

  it("fetches users", async () => {
    const store = useUserStore();
    await store.fetchUsers();
    expect(store.users.length).toBeGreaterThan(0);
  });

  it("fetches single user", async () => {
    const store = useUserStore();
    await store.fetchSingleUser(1);
    expect(typeof store.singleUser).toBeDefined();
    expect(store.singleUser?.id).toBe(1);
  })

  it("updates a single user", async () => {
    const store = useUserStore();
    store.users = mockUsers;

    await store.updateSingleUser(1, { name: "New Name" });

    expect(store.singleUser).toBeDefined();
    expect(store.singleUser?.name).toBe("New Name");
    const updatedUser = store.users.find(user => user.id === 1);
    expect(updatedUser?.name).toBe("New Name");
  });

  it("deletes a single user", async () => {
    const store = useUserStore();
    store.users = mockUsers;
    store.singleUser = { id: 1, name: "User One", role: mockRoles[0], status: StatusEnum[0], created_at: new Date() };

    await store.deleteSingleUser(1);

    expect(store.users.find(user => user.id === 1)).toBeUndefined();
    expect(store.singleUser).toBeNull();
  });

  it("bulk updates user roles", async () => {
    const store = useUserStore();
    store.users = mockUsers;

    const newRole = mockRoles[0];
    await store.updateUserRolesBulk([1, 2], newRole);
    expect(store.users.filter(user => [1, 2].includes(user.id)).every(user => user.role.id === newRole.id)).toBe(true);
  });

  it("bulk updates user statuses", async () => {
    const store = useUserStore();
    store.users = mockUsers;

    const newStatus = StatusEnum[1];
    await store.updateUserStatusBulk([1, 2], newStatus);
    expect(store.users.filter(user => [1, 2].includes(user.id)).every(user => user.status === newStatus)).toBe(true);
  });

  it("bulk deletes users", async () => {
    const store = useUserStore();

    await store.deleteUsersBulk([1, 2]);
    expect(store.users.find(user => user.id === 1)).toBeUndefined();
    expect(store.users.find(user => user.id === 2)).toBeUndefined();
    expect(store.users.find(user => user.id === 3)).toBeDefined();
  });
});
