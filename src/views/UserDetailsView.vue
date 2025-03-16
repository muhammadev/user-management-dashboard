<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import InputText from 'primevue/inputtext'

const route = useRoute()
const userStore = useUserStore()
const user = ref<UserType | null>(null)

onMounted(() => {
  user.value = userStore.users.find(u => u.id === Number(route.params.id))
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold">User Details</h1>
    <div v-if="user" class="mt-4">
      <label class="block text-gray-600">Name:</label>
      <InputText v-model="user.name" class="w-full" />

      <label class="block text-gray-600 mt-2">Role:</label>
      <InputText v-model="user.role" class="w-full" />

      <label class="block text-gray-600 mt-2">Status:</label>
      <InputText v-model="user.status" class="w-full" />
    </div>
    <p v-else class="text-gray-500">User not found.</p>
  </div>
</template>
