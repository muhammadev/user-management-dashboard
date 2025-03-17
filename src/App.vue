<script setup lang="ts">
import { RouterView } from "vue-router";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast"
import { useSessionTimeout } from './composables/useSessionTimeout';

useSessionTimeout();
</script>

<template>
  <div class="bg-white dark:bg-black">
    <Toast />
    <ConfirmDialog />

    <RouterView />
  </div>
</template>
