import { defineStore } from "pinia";
import api from "../api/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [] as UserType[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await api.get("/api/users");
        this.users = response.data;
      } catch (error) {
        console.error(error);
        this.error = "Failed to fetch users.";
      } finally {
        this.loading = false;
      }
    },
  },
});
