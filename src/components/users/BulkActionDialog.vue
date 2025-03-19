<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Action } from "@/types/enums";
import { StatusEnum } from '@/types/Status';

import Dialog from "primevue/dialog";
import Select from "primevue/select";
import Button from "primevue/button";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "primevue/usetoast";
import { useRoleStore } from "@/stores/roleStore";

const props = defineProps<{
  action: Action;
  selectedUsers: User[];
  toggleVisibility: boolean;
}>();

defineEmits<{
  (e: 'hide'): void
}>();

const toast = useToast();
const userStore = useUserStore();
const roleStore = useRoleStore();

const statuses = [...StatusEnum];
const role = ref<Role>();
const status = ref<Status>(StatusEnum[0])

// const loading = ref(false);
const visible = ref<boolean>(false);
const userIDs = ref(props.selectedUsers.map(u => u.id))


onMounted(async () => {
  visible.value = props.toggleVisibility;

  await roleStore.fetchRoles();

  role.value = roleStore.roles[0];
})

watch(() => props.toggleVisibility, (isVisible) => {
  visible.value = isVisible
})

watch(() => props.selectedUsers, (users) => {
  userIDs.value = users.map(u => u.id)
})

const handleSubmit = () => {
  switch (props.action) {
    case Action.EditRole:
      userStore.updateUserRolesBulk(userIDs.value, role.value).then(() => {
        toast.add({ severity: "success", summary: "Success", detail: "Roles updated!", life: 3000 });
      }).catch(() => {
        toast.add({ severity: "error", summary: "Error", detail: "Something went wrong!" });
      });
      break;

    case Action.EditStatus:
      userStore.updateUserStatusBulk(userIDs.value, status.value).then(() => {
        toast.add({ severity: "success", summary: "Success", detail: "Status updated!", life: 3000 });
      }).catch(() => {
        toast.add({ severity: "error", summary: "Error", detail: "Something went wrong!" });
      });
      break;

    case Action.Delete:
      userStore.deleteUsersBulk(userIDs.value).then(() => {
        toast.add({ severity: "success", summary: "Success", detail: "Users Deleted Successfully!", life: 3000 });
      }).catch(() => {
        toast.add({ severity: "error", summary: "Error", detail: "Something went wrong!" });
      });
      break;

  }

  visible.value = false;
};
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Bulk Action" :style="{ width: '25rem' }" @hide="$emit('hide')">
    <span v-if="[Action.EditRole, Action.EditStatus].includes(action)"
      class="text-surface-500 dark:text-surface-400 block mb-8">
      Update the {{
        (action === Action.EditRole && "role") || (action === Action.EditStatus && "status")
      }} of users: {{
        userIDs.join(",")
      }}.
    </span>


    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- if updating user roles -->
      <div v-if="action === Action.EditRole" class="space-y-2">
        <label for="role">Change Users Roles</label>
        <Select id="role" v-model="role" :options="roleStore.roles" class="w-full" option-label="name" />
      </div>

      <!-- if updating user status -->
      <div v-if="action === Action.EditStatus" class="space-y-2">
        <label for="role">Change Users Status</label>
        <Select id="role" v-model="status" :options="statuses" class="w-full" />
      </div>

      <!-- if deleting users -->
      <div v-if="action === Action.Delete" class="text-center">
        <h1>Are you sure you want to delete the users: {{
          userIDs.join(",")
        }}?
        </h1>
        <p class="text-red-600">THIS IS IRREVERSIBLE</p>
      </div>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="submit" :label="(action === Action.Delete && 'DELETE') || 'Save'"
          :severity="(action === Action.Delete && 'danger') || 'success'"></Button>
      </div>
    </form>
  </Dialog>
</template>
