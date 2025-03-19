<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthService } from "@/composables/useAuthService";
import { useRouter, RouterLink } from "vue-router";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import { useAuthStore } from "@/stores/authStore";

const authService = useAuthService();
const authStore = useAuthStore();

const darkMode = ref<boolean>(document.documentElement.classList.contains("dark"));
const userMenu = ref();

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle("dark", darkMode.value);
};

const router = useRouter()
const userMenuItems = computed(() => [
  {
    label: "Logout", icon: "pi pi-sign-out", command: () => {
      authService.logout().then(() => {
        router.push("/login")
      })
    }
  },
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
      <nav class="hidden md:flex gap-4">
        <RouterLink to="/" class="text-gray-700 dark:text-gray-300 hover:text-primary">Home</RouterLink>
      </nav>

      <div class="flex items-center gap-5">
        <!-- Dark Mode Toggle -->
        <button @click="toggleDarkMode" class="cursor-pointer text-gray-500 dark:text-gray-300 hover:text-primary">
          <i class="pi" :class="darkMode ? 'pi-sun' : 'pi-moon'"></i>
        </button>

        <!-- User Menu -->
        <div v-if="authStore.loggedInUser" class="relative">
          <button @click="openUserMenu" class="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
            <Avatar shape="circle" :label="authStore.loggedInUser.role.name.split('')[0]"
              class="!bg-amber-300 !text-white" />
            <span>{{ authStore.loggedInUser.name }}</span>
            <i class="pi pi-chevron-down text-sm"></i>
          </button>
          <Menu ref="userMenu" :model="userMenuItems" popup />
        </div>

        <!-- Login/Register Links -->
        <div v-else>
          <RouterLink to="/login" class="text-gray-700 dark:text-gray-300 hover:text-primary">Login</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
