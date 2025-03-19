import api from "@/api/api";
import { useLoading } from "@/composables/useLoadingService.js";
import { defineStore } from "pinia";
import { useToast } from "primevue";

type RoleState = {
  roles: Role[]
}

export const useRoleStore = defineStore("role", {
  state: (): RoleState => ({
    roles: []
  }),
  actions: {
    fetchRoles(): Promise<void> {
      return new Promise(async (resolve, reject) => {

        const { setLoading } = useLoading();
        setLoading(true);

        try {
          const response = await api.get("/api/roles")

          const { data }: { data: Role[] } = response;
          this.roles = data;

          resolve();
        } catch (e) {
          console.error(e);

          // inform the user about the error through a toast
          const toast = useToast();
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!",
          });

          reject();
        }
      })
    }
  }
})
