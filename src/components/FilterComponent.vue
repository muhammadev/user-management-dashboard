<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/userStore";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Button from "primevue/button";
import { StatusEnum } from "@/types/Status";
import { useRoleStore } from "@/stores/roleStore";

// Store instance
const userStore = useUserStore();
const roleStore = useRoleStore();

onMounted(() => {
  roleStore.fetchRoles();
})

// Define filter state
const filters = ref({
  name: userStore.filters.name || "",
  role: userStore.filters.role || null as string | null,
  status: userStore.filters.status || null as string | null,
});

const statuses = [...StatusEnum];

// Apply filters and fetch users
const applyFilters = () => {
  userStore.filters = filters.value;
  userStore.page = 1;
  userStore.fetchUsers();
};

// Reset filters and fetch users
const resetFilters = () => {
  filters.value = { name: "", status: "", role: null };
  userStore.filters = filters.value;
  userStore.page = 1;
  userStore.fetchUsers();
};
</script>

<template>
  <Card class="mb-4">
    <template #title>Filter Users</template>

    <template #content>
      <div class="flex flex-wrap gap-4 items-center">
        <InputText v-model="filters.name" placeholder="Search by name" class="p-inputtext-sm w-60" />
        <Select v-model="filters.role" :options="roleStore.roles" placeholder="Select role" class="w-60" showClear />
        <Select v-model="filters.status" :options="statuses" placeholder="Select status" class="w-60" showClear />
        <Button label="Apply Filters" icon="pi pi-filter" @click="applyFilters" />
        <Button label="Reset" icon="pi pi-times" severity="secondary" @click="resetFilters" />
      </div>
    </template>
  </Card>
</template>
