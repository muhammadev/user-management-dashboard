import { useAuthStore } from '@/stores/authStore';
import { useToast } from "primevue";
import { onMounted, onUnmounted, ref } from "vue"
import { useAuthService } from './useAuthService';

export function useSessionTimeout() {
  const authService = useAuthService();
  const authStore = useAuthStore();
  const toast = useToast();

  const isWarned = ref(false);

  let interval: ReturnType<typeof setInterval>;

  const checkSession = () => {
    if (!authStore.sessionExpiresAt) return;

    console.log(authStore.sessionExpiresAt)

    const now = Date.now() / 1000; // the time in seconds

    // give warning before expiration by 1 minute
    if (now >= (authStore.sessionExpiresAt - 60) && !isWarned.value) {
      toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Your session will expire in 1 minute.",
        life: 3000
      });

      isWarned.value = true;
    }

    if (now >= authStore.sessionExpiresAt) {
      authService.logout();
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
