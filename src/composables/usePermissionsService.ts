import { useAuthStore } from "@/stores/authStore";
import { useRoleStore } from "@/stores/roleStore";

export function usePermissionsService() {
  function hasPermission(permission: Role['permissions'][number]) {
    const { roles } = useRoleStore();
    const { loggedInUser: user } = useAuthStore();

    if (!user || !permission) return false;

    const userRole = roles.find(role => role.id === user?.role?.id);

    return userRole?.permissions.includes(permission);
  }

  return { hasPermission }
}
