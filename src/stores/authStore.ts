import { defineStore } from "pinia";

interface authState {
  loggedInUser: Partial<User> | null;
  sessionExpiresAt: ReturnType<typeof Date.now> | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): authState => ({
    loggedInUser: null,
    sessionExpiresAt: null,
  }),
});
