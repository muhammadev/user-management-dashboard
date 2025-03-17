<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Button from "primevue/button";
import { RolesEnum } from "@/types/Role";
import { StatusEnum } from "@/types/Status";

// Store instance
const store = useUserStore();

// Define filter state
const filters = ref({
  name: store.filters.name || "",
  role: store.filters.role || null as string | null,
  status: store.filters.status || null as string | null,
});

// TODO: get available roles from api
const roles = [...RolesEnum];
const statuses = [...StatusEnum];

// Apply filters and fetch users
const applyFilters = () => {
  store.filters = filters.value;
  store.page = 1;
  store.fetchUsers();
};

// Reset filters and fetch users
const resetFilters = () => {
  filters.value = { name: "", status: "", role: null };
  store.filters = filters.value;
  store.page = 1;
  store.fetchUsers();
};
</script>

<template>
  <Card class="mb-4">
    <template #title>Filter Users</template>

    <template #content>
      <div class="flex flex-wrap gap-4 items-center">
        <InputText v-model="filters.name" placeholder="Search by name" class="p-inputtext-sm w-60" />
        <Select v-model="filters.role" :options="roles" placeholder="Select role" class="w-60" showClear />
        <Select v-model="filters.status" :options="statuses" placeholder="Select status" class="w-60" showClear />
        <Button label="Apply Filters" icon="pi pi-filter" @click="applyFilters" />
        <Button label="Reset" icon="pi pi-times" severity="secondary" @click="resetFilters" />
      </div>
    </template>
  </Card>
</template>
