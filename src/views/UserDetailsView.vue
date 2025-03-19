<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useRoute, useRouter } from "vue-router";
import { useRoleStore } from "@/stores/roleStore";
import { StatusEnum } from "@/types/Status";
import * as yup from "yup";
import { usePermissionsService } from "@/composables/usePermissionsService";

// Define a yup schema for validation
const validationSchema = yup.object({
  name: yup.string().trim().required("Name is required."),
  role: yup.object().required("Role is required."),
  status: yup.string().trim().required("Status is required.")
});

const userStore = useUserStore();
const toast = useToast();
const confirm = useConfirm();
const roleStore = useRoleStore();

const isEditing = ref(false);
const loading = ref(false);
const formError = ref<string | null>(null);

const fieldErrors = ref<{ name?: string; role?: string; status?: string }>({});
const form = ref<Partial<User>>({
  name: "",
  role: null,
  status: null,
});

const router = useRouter();
const route = useRoute();

// Fetch user data on mount
onMounted(async () => {
  loading.value = true;
  formError.value = null;
  await userStore.fetchSingleUser(Number(route.params.id));
  loading.value = false;

  if (userStore.singleUser) {
    form.value = { ...userStore.singleUser };
  } else {
    formError.value = "User not found.";
  }
});

// Computed property for loading state
const isLoading = computed(() => userStore.loading);

// Validate the form and add fieldErrors if there are any validation errors
const validateForm = async (): Promise<boolean> => {
  fieldErrors.value = {}; // reset errors
  try {
    await validationSchema.validate(form.value, { abortEarly: false });
    return true;
  } catch (err) {
    if (err.inner && Array.isArray(err.inner)) {
      err.inner.forEach((validationError) => {
        const field = validationError.path;
        if (field && !fieldErrors.value[field]) {
          fieldErrors.value[field] = validationError.message;
        }
      });
    }
    return false;
  }
};

// run validation and update user if valid
const saveChanges = async () => {
  const isValid = await validateForm();
  if (!isValid) {
    return;
  }

  loading.value = true;
  try {
    await userStore.updateSingleUser(userStore.singleUser!.id, form.value);
    toast.add({ severity: "success", summary: "Success", detail: "User updated!", life: 3000 });
    isEditing.value = false;
    // Clear field errors on success
    fieldErrors.value = {};
  } catch (e) {
    formError.value = "Failed to update user.";
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// Confirm delete user
const confirmDelete = () => {
  confirm.require({
    message: "Are you sure you want to delete this user?",
    header: "Confirm Deletion",
    icon: "pi pi-exclamation-triangle",
    accept: async () => {
      try {
        await userStore.deleteSingleUser(userStore.singleUser!.id);
        toast.add({ severity: "success", summary: "Deleted", detail: "User removed.", life: 3000 });
        router.push("/");
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to delete user.", life: 3000 });
      }
    },
  });
};

// check the user permissions
const { hasPermission } = usePermissionsService();
const canWrite = hasPermission('write');
const canDelete = hasPermission('delete');
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <!-- Loading & Error States -->
    <div v-if="isLoading" class="text-center text-gray-600">Loading user...</div>
    <div v-else-if="formError" class="text-red-500 text-center">{{ formError }}</div>

    <!-- User Profile Card -->
    <Card v-else>
      <template #title>
        <div class="flex justify-between items-center">
          <span>User Profile</span>
          <Button v-if="!isEditing && canWrite" icon="pi pi-pencil" @click="isEditing = true" label="Edit" />
        </div>
      </template>

      <template #content>
        <div class="space-y-4">
          <!-- Name Field -->
          <div class="flex flex-col">
            <label for="name" class="text-sm font-medium">Full Name</label>
            <InputText id="name" v-model="form.name" :disabled="!isEditing" class="w-full" />
            <span v-if="fieldErrors.name" class="text-red-500 text-sm">{{ fieldErrors.name }}</span>
          </div>

          <!-- Role Field -->
          <div class="flex flex-col">
            <label for="role" class="text-sm font-medium">Role</label>
            <Select id="role" v-model="form.role" :options="roleStore.roles" placeholder="Select Role" class="w-full"
              option-label="name" :disabled="!isEditing" />
            <span v-if="fieldErrors.role" class="text-red-500 text-sm">{{ fieldErrors.role }}</span>
          </div>

          <!-- Status Field -->
          <div class="flex flex-col">
            <label for="status" class="text-sm font-medium">Status</label>
            <Select id="status" v-model="form.status" :options="[...StatusEnum]" placeholder="Select Status"
              class="w-full" :disabled="!isEditing" />
            <span v-if="fieldErrors.status" class="text-red-500 text-sm">{{ fieldErrors.status }}</span>
          </div>

          <!-- Buttons -->
          <div class="flex justify-between mt-4">
            <Button v-if="isEditing" label="Cancel" icon="pi pi-times" severity="secondary"
              @click="isEditing = false" />
            <Button v-if="isEditing" label="Save Changes" icon="pi pi-check" class="p-button-success"
              @click="saveChanges" :loading="loading" />
            <Button v-if="!isEditing && canDelete" label="Delete User" icon="pi pi-trash" class="p-button-danger"
              @click="confirmDelete" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
