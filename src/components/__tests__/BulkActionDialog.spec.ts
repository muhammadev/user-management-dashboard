import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import BulkActionDialog from '@/components/users/BulkActionDialog.vue'
import { Action } from '@/types/enums'
import { useUserStore } from '@/stores/userStore'
import { useRoleStore } from '@/stores/roleStore'
import { StatusEnum } from '@/types/Status'
import { mockRoles } from '@/mocks/mockData/mockRoles'
import { mockUsers } from '@/mocks/mockData/mockUsers'

// Dummy data for testing
const dummyRole = mockRoles[0]
const dummyUsers = mockUsers;

// Since our component uses PrimeVue components, we can stub them
const stubs = {
  Dialog: {
    template: '<div><slot /></div>'
  },
  Select: true,
  Button: true,
  RouterLink: true
}

// We'll also spy on toast messages by mocking useToast from PrimeVue
const toastAddMock = vi.fn()
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: toastAddMock })
}))

describe('BulkActionDialog.vue', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance before each test
    setActivePinia(createPinia())

    // Prepopulate the role store
    const roleStore = useRoleStore()
    roleStore.roles = mockRoles

    const userStore = useUserStore();
    userStore.users = mockUsers;


    // Replace store actions with mocks
    userStore.updateUserRolesBulk = vi.fn().mockResolvedValue(undefined)
    userStore.updateUserStatusBulk = vi.fn().mockResolvedValue(undefined)
    userStore.deleteUsersBulk = vi.fn().mockResolvedValue(undefined)

    // Clear toast mocks
    toastAddMock.mockClear()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('calls updateUserRolesBulk on form submission when action is EditRole', async () => {
    const wrapper = mount(BulkActionDialog, {
      props: {
        action: Action.EditRole,
        selectedUsers: dummyUsers,
        toggleVisibility: true
      },
      global: { stubs }
    })

    // Wait for onMounted
    await flushPromises()

    wrapper.vm.role = dummyRole;

    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)

    // Simulate form submission
    await form.trigger('submit.prevent')
    await flushPromises()
    const userStore = useUserStore()
    expect(userStore.updateUserRolesBulk).toHaveBeenCalledWith(
      dummyUsers.map(u => u.id),
      dummyRole
    )
  })

  it('calls updateUserStatusBulk on form submission when action is EditStatus', async () => {
    const wrapper = mount(BulkActionDialog, {
      props: {
        action: Action.EditStatus,
        selectedUsers: dummyUsers,
        toggleVisibility: true
      },
      global: { stubs }
    })

    // Wait for onMounted and watchers
    await flushPromises()

    // Assume the default status is StatusEnum[0]
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const userStore = useUserStore()
    expect(userStore.updateUserStatusBulk).toHaveBeenCalledWith(
      dummyUsers.map(u => u.id),
      StatusEnum[0]
    )
  })

  it('calls deleteUsersBulk on form submission when action is Delete', async () => {
    const wrapper = mount(BulkActionDialog, {
      props: {
        action: Action.Delete,
        selectedUsers: dummyUsers,
        toggleVisibility: true
      },
      global: { stubs }
    })

    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    const userStore = useUserStore()
    expect(userStore.deleteUsersBulk).toHaveBeenCalledWith(
      dummyUsers.map(u => u.id)
    )
  })
})
