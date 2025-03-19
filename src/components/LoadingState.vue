<script lang="ts" setup>
import { useLoading } from "@/composables/useLoadingService";

const { isLoading } = useLoading();
</script>

<template>
  <div v-if="isLoading" class="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/50">
    Loading...</div>
</template>
