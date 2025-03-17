<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter, RouterLink } from "vue-router";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";

const authStore = useAuthStore();
const router = useRouter();

const darkMode = ref<boolean>(document.documentElement.classList.contains("dark"));
const userMenu = ref();

const user = computed(() => authStore.loggedInUser);

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle("dark", darkMode.value);
};

const userMenuItems = computed(() => [
  { label: "Profile", icon: "pi pi-user", command: () => router.push("/profile") },
  { separator: true },
  { label: "Logout", icon: "pi pi-sign-out", command: () => authStore.logout() },
]);

const openUserMenu = (event: Event) => {
  userMenu.value?.toggle(event);
};
</script>

<template>
  <header class="shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Logo -->
      <RouterLink to="/" class="text-xl font-bold text-black dark:text-white">
        MyApp
      </RouterLink>

      <!-- Navigation Links -->
      <nav class="hidden md:flex space-x-6">
        <RouterLink to="/" class="text-gray-700 dark:text-gray-300 hover:text-primary">Home</RouterLink>
      </nav>

      <!-- Right Side (User Menu + Dark Mode) -->
      <div class="flex items-center space-x-4">
        <!-- Dark Mode Toggle -->
        <button @click="toggleDarkMode" class="cursor-pointer text-gray-500 dark:text-gray-300 hover:text-primary">
          <i class="pi" :class="darkMode ? 'pi-sun' : 'pi-moon'"></i>
        </button>

        <!-- User Menu -->
        <div v-if="user" class="relative">
          <button @click="openUserMenu" class="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <Avatar shape="circle" label="U" class="bg-primary text-white" />
            <span>{{ user.name }}</span>
            <i class="pi pi-chevron-down text-sm"></i>
          </button>
          <Menu ref="userMenu" :model="userMenuItems" popup />
        </div>

        <!-- Login/Register Links -->
        <div v-else class="space-x-4">
          <RouterLink to="/auth/login" class="text-gray-700 dark:text-gray-300 hover:text-primary">Login</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
