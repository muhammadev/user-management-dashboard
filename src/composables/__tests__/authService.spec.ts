import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/authStore.js'
import { useAuthService } from '../useAuthService.js'
import { mockUsers } from '@/mocks/mockData/mockUsers'

describe('useAuthService composable', () => {
  setActivePinia(createPinia())

  it('logs in successfully and updates the auth store', async () => {
    const authStore = useAuthStore()
    const authService = useAuthService()

    const testUser = mockUsers[0]

    await authService.login(testUser)

    // Verify that the store's loggedInUser is updated with the token
    expect(authStore.loggedInUser).toBeDefined()
    expect(authStore.loggedInUser?.sessionToken).toBeDefined()
    expect(authStore.sessionExpiresAt).not.toBeNull()
  })

  it('logs out successfully and clears the auth store', async () => {
    const authStore = useAuthStore()
    const { login, logout } = useAuthService()

    // First, log in a user so the store is populated
    const testUser = mockUsers[0]
    await login(testUser)
    expect(authStore.loggedInUser).toBeDefined()

    // Now logout...
    await logout()

    expect(authStore.loggedInUser).toBeNull()
    expect(authStore.sessionExpiresAt).toBeNull()
  })
})
