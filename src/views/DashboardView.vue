<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import FilterComponent from "@/components/FilterComponent.vue"
import UsersTable from "@/components/users/UsersTable.vue"

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUsers();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">User Dashboard Management</h1>

    <div v-if="!userStore.loading">
      <FilterComponent />

      <UsersTable />
    </div>

    <p v-else>Loading users...</p>
  </div>
</template>
