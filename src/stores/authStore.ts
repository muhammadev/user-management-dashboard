import { defineStore } from "pinia";
import { useRouter } from "vue-router";

interface authState {
  isLoggedIn: boolean;
  loggedInUser: UserType | null;
  sessionExpiresAt: ReturnType<typeof Date.now> | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): authState => ({
    isLoggedIn: false,
    loggedInUser: null,
    sessionExpiresAt: null,
  }),
  actions: {
    login(user: UserType) {
      this.isLoggedIn = true;
      this.loggedInUser = user;
      this.sessionExpiresAt = (Date.now() + (60000 * 5)); // 5 minutes only for demo purposes
    },
    logout() {
      this.isLoggedIn = false;
      this.loggedInUser = null;
      this.sessionExpiresAt = null;
      const router = useRouter();

      router.push("/auth/login")
    },
  },
});
