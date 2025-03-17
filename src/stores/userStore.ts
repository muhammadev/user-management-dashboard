import { defineStore } from "pinia";
import api from "../api/api";
import type { RoleType } from "@/types/Role";
import type { StatusType } from "@/types/Status";

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
  singleUser: UserType | null;
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
    singleUser: null,
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
    async fetchSingleUser(userId: number) {
      this.loading = true;
      this.error = null;
      this.singleUser = null;

      try {
        const response = await api.get(`/api/users/${userId}`);
        this.singleUser = response.data;
      } catch (error) {
        console.error(error);
        this.error = `Failed to fetch user with ID: ${userId}`;
      } finally {
        this.loading = false;
      }
    },
    async updateSingleUser(userId: number, userData: Partial<UserType>) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put(`/api/users/${userId}`, userData);
        this.singleUser = response.data;

        // Update the user in the users list
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          this.users[index] = response.data;
        }
      } catch (error) {
        console.error(error);
        this.error = `Failed to update user with ID: ${userId}`;
      } finally {
        this.loading = false;
      }
    },
    deleteSingleUser(userId: number): Promise<void> {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        this.error = null;

        try {
          await api.delete(`/api/users/${userId}`);

          // Remove user from the list
          this.users = this.users.filter(user => user.id !== userId);

          // If the deleted user was the currently viewed one, reset it
          if (this.singleUser?.id === userId) {
            this.singleUser = null;
          }

          resolve();
        } catch (error) {
          console.error(error);
          this.error = `Failed to delete user with ID: ${userId}`;
          reject();
        } finally {
          this.loading = false;
        }
      })
    },
    updateUserRolesBulk(ids: number[], role: RoleType): Promise<void> {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        this.error = null;

        try {
          await api.put('/api/users/bulk-update-role', {
            ids,
            role
          })

          this.fetchUsers();
          resolve();
        } catch (error) {
          this.error = "Something went wrong!";
          console.error(error);
          reject();
        } finally {
          this.loading = false;
        }
      })
    },
    updateUserStatusBulk(ids: number[], status: StatusType): Promise<void> {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        this.error = null;

        try {
          await api.put('/api/users/bulk-update-status', {
            ids,
            status
          })

          this.fetchUsers();
          resolve();
        } catch (error) {
          this.error = "Something went wrong!";
          console.error(error);
          reject();
        } finally {
          this.loading = false;
        }
      })
    },
    deleteUsersBulk(ids: number[]): Promise<void> {
      return new Promise(async (resolve, reject) => {

        this.loading = true;
        this.error = null;

        try {
          await api.post('/api/users/bulk-delete-users', { ids });
          this.fetchUsers();
          resolve();
        } catch (error) {
          console.error(error);
          this.error = `Failed to delete user with ID: ${ids}`;
          reject();
        } finally {
          this.loading = false;
        }
      })
    },
  },
});
