<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const store = useUserStore();

onMounted(() => {
  store.fetchUsers();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>

    <DataTable :value="store.users" v-if="!store.loading">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="role" header="Role"></Column>
      <Column field="status" header="Status"></Column>
    </DataTable>

    <p v-else>Loading users...</p>
  </div>
</template>
