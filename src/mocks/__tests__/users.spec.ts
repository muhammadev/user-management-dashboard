import { describe, it, expect } from 'vitest';
import { mockRoles } from '../mockData/mockRoles.js';
import { StatusEnum } from '@/types/Status';

describe('User Endpoints', () => {
  it('fetches users with pagination and filters', async () => {
    // prepare query parameters...
    const filters = { name: "", role: null, status: null };
    const response = await fetch(
      `/api/users?page=1&pageSize=10&filters=${JSON.stringify(filters)}`
    );

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('page', 1);
    expect(data).toHaveProperty('pageSize', 10);
    expect(data).toHaveProperty('filters');
  });

  it('fetches a single user by id', async () => {
    const response = await fetch('/api/users/1');
    expect(response.status).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id', 1);
  });

  it('returns 404 when fetching a non-existent user', async () => {
    const response = await fetch('/api/users/9999');
    expect(response.status).toBe(404);
  });

  it('bulk updates users roles', async () => {
    const payload = {
      ids: [1, 2],
      role: mockRoles[0]
    };
    const response = await fetch('/api/users/bulk-update-role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    expect(response.status).toBe(200);
  });

  it('bulk updates users status', async () => {
    const payload = {
      ids: [1, 2],
      status: StatusEnum[0]
    };

    const response = await fetch('/api/users/bulk-update-status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    expect(response.status).toBe(200);
  });

  it('updates a single user', async () => {
    const payload = { name: 'Updated Name' };
    const response = await fetch('/api/users/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    expect(response.status).toBe(200);
    const updatedUser = await response.json();
    expect(updatedUser).toHaveProperty('name', 'Updated Name');
  });

  it('bulk deletes users', async () => {
    const payload = { ids: [1, 2] };
    const response = await fetch('/api/users/bulk-delete-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    expect(response.status).toBe(204);
  });

  it('deletes a single user', async () => {
    const response = await fetch('/api/users/3', { method: 'DELETE' });
    expect(response.status).toBe(204);
  });
});
