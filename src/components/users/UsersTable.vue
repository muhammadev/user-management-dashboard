<script lang="ts" setup>
import { ref } from "vue";
import { RouterLink } from "vue-router"
import BulkActionDialog from "@/components/users/BulkActionDialog.vue";
import { useUserStore } from "@/stores/userStore";
import { Action } from "@/types/enums";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Paginator from "primevue/paginator";
import Select from "primevue/select";
import Button from "primevue/button";
import { usePermissionsService } from "@/composables/usePermissionsService";

const userStore = useUserStore();
const selectedUsers = ref<User[]>([]);
const toggleActionDialogVisibility = ref<boolean>(false);

// check the user permissions
const { hasPermission } = usePermissionsService();
const canWrite = hasPermission('write');
const canDelete = hasPermission('delete');

const selectedAction = ref<Action>();
const actions = [];

if (canWrite) {
  actions.push(...[
    { label: "Edit Role", value: Action.EditRole },
    { label: "Edit Status", value: Action.EditStatus },
  ])
}

if (canDelete) {
  actions.push({ label: "Delete", value: Action.Delete })
}

const applyAction = () => {
  toggleActionDialogVisibility.value = true;
};

type onPageChangeParams = {
  page: number;
  rows: number;
}
const onPageChange = ({ page, rows: pageSize }: onPageChangeParams) => {
  userStore.page = page + 1;
  userStore.pageSize = pageSize;
  userStore.fetchUsers();
};
</script>

<template>
  <div>
    <!-- Bulk Action (based on user's permissions) -->
    <div v-if="actions.length" class="flex gap-5 mt-10 mb-4">
      <Select v-model="selectedAction" :options="actions" optionLabel="label" optionValue="value"
        placeholder="Bulk Action" />

      <Button @click="applyAction" label="Apply Action" :disabled="!selectedUsers.length || !selectedAction"
        :title="(!selectedUsers.length && 'You need to select users first') || (!selectedAction && 'Select bulk action first')"
        :class="{ 'cursor-not-allowed': !selectedUsers.length }" />
    </div>

    <DataTable v-model:selection="selectedUsers" :value="userStore.users">
      <Column v-if="actions.length" selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="id" header="ID" sortable></Column>
      <Column field="name" header="Name" sortable></Column>
      <Column field="role" header="Role">
        <template #body="{ data }">
          {{ data.role.name }}
        </template>
      </Column>
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

    <Paginator :rows="userStore.pageSize" :totalRecords="userStore.totalUsers" :rowsPerPageOptions="[5, 10, 20]"
      :first="(userStore.page - 1) * userStore.pageSize" @page="onPageChange" class="mt-4" />

    <BulkActionDialog :selected-users="selectedUsers" :action="selectedAction"
      :toggle-visibility="toggleActionDialogVisibility" @hide="toggleActionDialogVisibility = false" />
  </div>
</template>
