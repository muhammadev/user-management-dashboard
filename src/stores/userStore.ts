import { defineStore } from "pinia";
import api from "../api/api";

interface UserState {
  users: UserType[];
  totalUsers: number;
  page: number;
  pageSize: number;
  filters: {
    name: string;
    role: string | null;
    status: string | null;
  };
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    users: [],
    totalUsers: 0,
    page: 1,
    pageSize: 10,
    filters: {
      name: "",
      role: null,
      status: null
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/api/users", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            filters: JSON.stringify(this.filters)
          }
        });

        const { data: paginatedUsers, total, page, pageSize, filters } = response.data;
        this.users = paginatedUsers;
        this.totalUsers = total;
        this.page = page;
        this.pageSize = pageSize;
        this.filters = JSON.parse(filters);

      } catch (error) {
        console.error(error);
        this.error = "Failed to fetch users.";
      } finally {
        this.loading = false;
      }
    },
  },
});
