import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import Header from '@/components/layout/HeaderComponent.vue'

// --- Mocks ---
// Mock PrimeVue's useToast to spy on toast calls
const toastAddMock = vi.fn();
vi.mock('primevue', () => ({
  useToast: () => ({ add: toastAddMock })
}));

// Mock useAuthService to override logout (and optionally login if needed)
const logoutMock = vi.fn().mockResolvedValue(undefined);
vi.mock('@/composables/useAuthService', () => ({
  useAuthService: () => ({
    logout: logoutMock,
    login: vi.fn().mockResolvedValue(undefined),
  }),
}));

// Mock vue-router's useRouter to spy on navigation
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
  RouterLink: {
    template: '<a><slot /></a>'
  }
}));

// Optionally, if your component uses role store, ensure it's set up
import { useRoleStore } from '@/stores/roleStore';
import { useAuthStore } from '@/stores/authStore';

describe('Header Component', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance before each test
    setActivePinia(createPinia());

    // Set up authStore with a logged in user
    const authStore = useAuthStore();
    authStore.loggedInUser = {
      id: '1',
      name: 'John Doe',
      role: { id: 1, name: 'Admin', permissions: ['edit', 'delete', 'view'] }
    };

    // Set up roleStore with at least one role
    const roleStore = useRoleStore();
    roleStore.roles = [{
      id: 1,
      name: 'Admin',
      permissions: ['edit', 'delete', 'view']
    }];

    // Clear previous mocks
    toastAddMock.mockClear();
    logoutMock.mockClear();
    pushMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });

  it('renders header with user menu when logged in', async () => {
    const wrapper = mount(Header, {
      global: {
        stubs: { Menu: true, Avatar: true, RouterLink: true }
      }
    });

    // Wait for onMounted (which fetches roles) to complete
    await flushPromises();

    // Check that the header renders the logo, navigation, and the user menu (by checking for user's name)
    expect(wrapper.html()).toContain('John Doe');

    wrapper.unmount();
  });

  it('toggles dark mode when dark mode button is clicked', async () => {
    // Ensure dark mode is off initially
    document.documentElement.classList.remove('dark');

    const wrapper = mount(Header, {
      global: {
        stubs: { Menu: true, Avatar: true, RouterLink: true }
      }
    });

    // Find the dark mode toggle button
    const toggleButton = wrapper.find('#toggle-button');
    await toggleButton.trigger('click');

    // Expect that the document's classList now includes "dark"
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    wrapper.unmount();
  });

  it('calls logout and navigates to "/login" when logout command is executed', async () => {
    const wrapper = mount(Header, {
      global: {
        stubs: { Menu: true, Avatar: true, RouterLink: true }
      }
    });

    // Wait for onMounted and any async logic to finish
    await flushPromises();

    // Access the exposed computed property userMenuItems
    const { userMenuItems } = wrapper.vm as unknown as { userMenuItems: Array<{ label: string; command: () => void }> };

    // Find the logout menu item (assuming it is the first item)
    const logoutMenuItem = userMenuItems.find(item => item.label === "Logout");
    expect(logoutMenuItem).toBeDefined();

    // Simulate clicking the logout command
    logoutMenuItem!.command();
    await flushPromises();

    // Expect that authService.logout (mocked by logoutMock) has been called
    expect(logoutMock).toHaveBeenCalled();

    // Expect that router.push was called with "/login"
    expect(pushMock).toHaveBeenCalledWith("/login");

    wrapper.unmount();
  });
});
