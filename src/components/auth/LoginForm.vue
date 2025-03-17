<script setup lang="ts">
// Logic & Imports first
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Select from 'primevue/select';
import Button from 'primevue/button';
import { RolesEnum } from '@/types/Role';

const router = useRouter();
const authStore = useAuthStore();

const role = ref<Role>('Viewer');
const loading = ref(false);

const roles = [...RolesEnum];

async function handleLogin() {
  loading.value = true;
  await new Promise((res) => setTimeout(res, 600));

  const user = {
    name: "John Doe",
    role: role.value,
  };

  authStore.login(user);
  router.push('/');
  loading.value = false;
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto space-y-4">
    <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div class="space-y-2">
        <label for="role">Role (simulate)</label>
        <Select id="role" v-model="role" :options="roles" class="w-full" />
      </div>
      <Button label="Login" type="submit" class="w-full" :loading="loading" />
    </form>
  </div>
</template>
