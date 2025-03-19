import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginForm from '@/components/auth/LoginForm.vue';
import { useRoleStore } from '@/stores/roleStore';
import { mockRoles } from '@/mocks/mockData/mockRoles';

// Mock PrimeVue's useToast
const toastAddMock = vi.fn();
vi.mock('primevue', () => ({
  useToast: () => ({
    add: toastAddMock,
  }),
}));

// Mock useAuthService to override its login method
const loginMock = vi.fn().mockResolvedValue(undefined);
vi.mock('@/composables/useAuthService', () => ({
  useAuthService: () => ({
    login: loginMock,
    logout: vi.fn(),
  }),
}));

// Mock useRouter so we can spy on router.push
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance
    setActivePinia(createPinia());

    // Prepopulate roleStore roles so that onMounted sets the role
    const roleStore = useRoleStore();
    roleStore.roles = mockRoles;

    // Clear previous mocks
    toastAddMock.mockClear();
    loginMock.mockClear();
    pushMock.mockClear();
  });

  it('calls login and navigates to "/" on successful form submission', async () => {
    // Mount the component with necessary global stubs/plugins
    const wrapper = mount(LoginForm, {
      global: {
        plugins: [createPinia()],
        stubs: {
          Select: true,
          Button: true
        }
      }
    });

    // Wait for onMounted (fetchRoles and setting role) to complete
    await flushPromises();

    // Simulate form submission
    await wrapper.find('form').trigger('submit.prevent');

    // Wait for all asynchronous operations in handleLogin to finish
    await flushPromises();

    // Assert that login was called with a user object containing a role property
    expect(loginMock).toHaveBeenCalled();

    // Assert that router.push was called with "/" after a successful login
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it('displays a toast error when login fails', async () => {
    // Make login reject by updating the mock
    loginMock.mockRejectedValueOnce(new Error("Login failed"));

    const wrapper = mount(LoginForm, {
      global: {
        plugins: [createPinia()],
        stubs: {
          Select: true,
          Button: true
        }
      }
    });

    await flushPromises();

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    // Check that the toast was shown with the error message
    expect(toastAddMock).toHaveBeenCalledWith({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong!"
    });

    // And router.push should not be called
    expect(pushMock).not.toHaveBeenCalled();
  });
});
