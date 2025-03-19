<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthService } from '@/composables/useAuthService';
import { useRoleStore } from '@/stores/roleStore';
import Select from 'primevue/select';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { useToast } from "primevue";

const authService = useAuthService();
const roleStore = useRoleStore();
const router = useRouter();
const toast = useToast();

const role = ref<Role>();
const loading = ref(false);

onMounted(async () => {
  await roleStore.fetchRoles();

  role.value = roleStore.roles[0];
})

async function handleLogin() {
  loading.value = true;
  const user = {
    id: Number(Math.random().toString().split(".")[1]), // mocking a random id
    role: role.value,
  };

  authService.login(user)
    .then(() => {
      router.push("/")
    })
    .catch(e => {
      console.error(e);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong!"
      })
    }).finally(() => {
      loading.value = false;
    })
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto space-y-4">
    <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div class="space-y-2">
        <label for="role">Role (simulate)</label>
        <Select id="role" v-model="role" :options="roleStore.roles" option-label="name" class="w-full" />
      </div>
      <Button label="Login" type="submit" class="w-full" :loading="loading" />
    </form>
  </div>
</template>
