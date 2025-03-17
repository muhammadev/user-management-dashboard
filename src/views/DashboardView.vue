<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from "vue-router"
import FilterComponent from "../components/FilterComponent.vue"
import { useUserStore } from "../stores/userStore";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Paginator from "primevue/paginator";

const store = useUserStore();

onMounted(() => {
  store.fetchUsers();
});

const onPageChange = ({ page, rows: pageSize }: { page: number, rows: number }) => {
  store.page = page + 1;
  store.pageSize = pageSize;
  store.fetchUsers();
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>

    <div v-if="!store.loading">
      <FilterComponent />

      <DataTable :value="store.users">
        <Column field="id" header="ID" sortable></Column>
        <Column field="name" header="Name" sortable></Column>
        <Column field="role" header="Role"></Column>
        <Column field="status" header="Status"></Column>
        <Column field="created_at" header="Date Joined" sortable>
          <template #body="{ data }">
            {{ new Date(data.created_at).toLocaleDateString() }}
          </template>
        </Column>
        <Column header="View">
          <template #body="{ data }">
            <RouterLink :to="`/user/${data.id}`">
              <i class="pi pi-eye"></i>
            </RouterLink>
          </template>
        </Column>
      </DataTable>

      <Paginator :rows="store.pageSize" :totalRecords="store.totalUsers" :rowsPerPageOptions="[5, 10, 20]"
        :first="(store.page - 1) * store.pageSize" @page="onPageChange" class="mt-4" />
    </div>

    <p v-else>Loading users...</p>
  </div>
</template>
