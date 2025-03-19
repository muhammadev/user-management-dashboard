import { ref } from "vue";

export function useLoading() {
  const isLoading = ref(false);

  const setLoading = (state: boolean) => {
    isLoading.value = state;
  }

  return {
    isLoading,
    setLoading
  }
}
