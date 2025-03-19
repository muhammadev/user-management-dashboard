import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePermissionsService } from '@/composables/usePermissionsService'
import { useAuthStore } from '@/stores/authStore'
import { useRoleStore } from '@/stores/roleStore'
import { mockRoles } from '@/mocks/mockData/mockRoles'
import { mockUsers } from '@/mocks/mockData/mockUsers'

describe('usePermissionsService', () => {
  beforeEach(() => {
    // Create a new Pinia instance before each test
    setActivePinia(createPinia());
  });

  it('returns true if the logged-in user has the specified permission', () => {
    const authStore = useAuthStore();
    const roleStore = useRoleStore();

    roleStore.roles = mockRoles;

    // find a user with admin role
    const adminUser = mockUsers.find(u => u.role.name === 'Manager');
    authStore.loggedInUser = adminUser;

    const { hasPermission } = usePermissionsService();

    // Expect that the user has 'write'
    expect(hasPermission('write')).toBe(true);
    // Expect that the user doesn't have 'delete' permission which only the admin has
    expect(hasPermission('delete')).toBeFalsy();
  });

  it('returns false if there is no logged-in user', () => {
    const authStore = useAuthStore();
    const roleStore = useRoleStore();

    roleStore.roles = mockRoles;

    // No user is logged in
    authStore.loggedInUser = null;

    const { hasPermission } = usePermissionsService();
    expect(hasPermission('edit')).toBeFalsy();
  });

  it('returns false if user role is not found in the roles list', () => {
    const authStore = useAuthStore();
    const roleStore = useRoleStore();

    roleStore.roles = mockRoles;

    // Set loggedInUser with a role id that does not exist in the role store
    authStore.loggedInUser = { id: 0, role: { id: 9 } }

    const { hasPermission } = usePermissionsService();
    expect(hasPermission('edit')).toBeFalsy();
  });
});
