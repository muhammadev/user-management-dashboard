import { useAuthStore } from "@/stores/authStore";
import { useToast } from "primevue";
import { onMounted, onUnmounted, ref } from "vue"

export function useSessionTimeout() {
  const authStore = useAuthStore();
  const toast = useToast();

  const isWarned = ref(false);

  let interval: ReturnType<typeof setInterval>;

  const checkSession = () => {
    if (!authStore.sessionExpiresAt) return;

    const now = Date.now();

    // give warning before expiration by 1 minute
    if (now >= (authStore.sessionExpiresAt - 60 * 1000) && !isWarned.value) {
      toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Your session will expire in 1 minute.",
        life: 3000
      });

      isWarned.value = true;
    }

    if (now >= authStore.sessionExpiresAt) {
      authStore.logout();
      isWarned.value = false;
    }
  }

  onMounted(() => {
    // check if session expired every 5 seconds...
    interval = setInterval(checkSession, 5 * 1000);

  })

  onUnmounted(() => {
    // clear the interval
    clearInterval(interval);
  })
}
