import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../authStore.js';

describe('Auth Store', () => {
  setActivePinia(createPinia());

  it('initializes loggedInUser and sessionExpiresAt with null values', () => {
    const store = useAuthStore();
    expect(store.loggedInUser).toBeNull();
    expect(store.sessionExpiresAt).toBeNull();
  });
});
