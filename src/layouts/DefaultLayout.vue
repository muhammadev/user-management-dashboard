<script setup lang="ts">
import { RouterView } from "vue-router";
import HeaderComponent from '@/components/layout/HeaderComponent.vue';
</script>

<template>
  <div class="min-h-screen">
    <HeaderComponent />

    <main class="container mx-auto">
      <router-view />
    </main>
  </div>
</template>