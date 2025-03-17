import { useAuthStore } from "@/stores/authStore";
import { useToast } from "primevue";
import { onMounted, onUnmounted } from "vue"

export function useSessionTimeout() {
  const authStore = useAuthStore();
  const toast = useToast();

  let interval: ReturnType<typeof setInterval>;

  const checkSession = () => {
    if (!authStore.sessionExpiresAt) return;

    const now = Date.now();

    // give warning before expiration by 1 minute
    if (now >= (authStore.sessionExpiresAt - 60000)) {
      toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Your session will expire in 1 minute.",
        life: 3000
      })
    }

    if (now >= authStore.sessionExpiresAt) {
      authStore.logout();
    }
  }

  onMounted(() => {
    // check if session expired every 5 seconds...
    interval = setInterval(checkSession, 5000);

  })

  onUnmounted(() => {
    // clear the interval
    clearInterval(interval);
  })
}
