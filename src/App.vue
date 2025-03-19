<script setup lang="ts">
import { RouterView } from "vue-router";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast"
import { useSessionTimeout } from '@/composables/useSessionTimeoutService';
import LoadingState from "@/components/LoadingState.vue";

useSessionTimeout();
</script>

<template>
  <div class="bg-white dark:bg-black">
    <Toast />
    <ConfirmDialog />
    <LoadingState />

    <RouterView />
  </div>
</template>
