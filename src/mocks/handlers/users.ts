import { delay, http, HttpResponse, type PathParams } from 'msw';
import { mockUsers } from "../mockData/mockUsers"
import { RolesEnum } from '../../types/Role';
import { StatusEnum } from '@/types/Status';

const delayInRange = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

type BulkUpdateRoleRequestBody = {
  ids: number[],
  role: Role
}

type BulkUpdateStatusRequestBody = {
  ids: number[],
  status: Status
}

type BulkDeleteUsersRequestBody = {
  ids: number[],
}

export const handlers = [
  http.get('/api/users', async ({ request }) => { // fetch all users
    await delay(delayInRange)

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const filters = JSON.parse(url.searchParams.get("filters") || "");

    // filter the total users first
    const filteredUsers = mockUsers.filter(user => {
      const { name, role, status } = filters;

      return (!name || user.name === name) &&
        (!role || user.role === role) &&
        (!status || user.status === status)
    })

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedUsers,
      total: filteredUsers.length,
      page,
      pageSize,
      filters: JSON.stringify(filters),
    });
  }),
  http.get('/api/users/:id', async ({ params }) => { // fetch single user
    await delay(delayInRange);

    const user = mockUsers.find((u) => u.id === Number(params.id));
    return user ? HttpResponse.json(user) : new HttpResponse(null, {
      status: 404,
      statusText: 'User Not Found'
    })
  }),
  http.put<PathParams, BulkUpdateRoleRequestBody>('/api/users/bulk-update-role', async ({ request }) => { // bulk update users role
    await delay(delayInRange);

    const { ids, role } = await request.json();

    const usersToEdit = mockUsers.filter((u) => ids?.includes(u.id));

    if (usersToEdit.length === 0) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'No Users Found'
      });
    }

    if (!RolesEnum.includes(role)) {
      return new HttpResponse(null, {
        status: 400,
      })
    }

    mockUsers.forEach((user, i) => {
      if (ids.includes(user.id)) {
        mockUsers[i].role = role;
      }
    })

    return new HttpResponse();
  }),
  http.put<PathParams, BulkUpdateStatusRequestBody>('/api/users/bulk-update-status', async ({ request }) => { // bulk update users status
    await delay(delayInRange);

    const { ids, status } = await request.json();

    const usersToEdit = mockUsers.filter((u) => ids?.includes(u.id));

    if (usersToEdit.length === 0) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'No Users Found'
      });
    }

    if (!StatusEnum.includes(status)) {
      return new HttpResponse(null, {
        status: 400,
      })
    }

    mockUsers.forEach((user, i) => {
      if (ids.includes(user.id)) {
        mockUsers[i].status = status;
      }
    })

    return new HttpResponse();
  }),
  http.put('/api/users/:id', async ({ params, request }) => { // update single user
    await delay(delayInRange);

    const userIndex = mockUsers.findIndex((u) => u.id === Number(params.id));

    if (userIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'User Not Found'
      });
    }

    const updatedData = await request.json();
    if (typeof updatedData === 'object' && updatedData !== null) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedData };
    }

    return HttpResponse.json(mockUsers[userIndex]);
  }),
  http.post<PathParams, BulkDeleteUsersRequestBody>('/api/users/bulk-delete-users', async ({ request }) => { // bulk delete users
    await delay(delayInRange);

    const { ids } = await request.json();

    const usersToDelete = mockUsers.filter((u) => ids?.includes(u.id));

    if (usersToDelete.length === 0) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'No Users Found'
      });
    }

    // remove users from the list
    usersToDelete.forEach((userToDelete) => {
      const userIndex = mockUsers.findIndex(u => u.id === userToDelete.id)
      mockUsers.splice(userIndex, 1);
    })

    return new HttpResponse(null, {
      status: 204,
    });
  }),
  http.delete('/api/users/:id', async ({ params }) => { // delete single user
    await delay(delayInRange);

    const userIndex = mockUsers.findIndex((u) => u.id === Number(params.id));

    if (userIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'User Not Found'
      });
    }

    // remove user from the list
    mockUsers.splice(userIndex, 1);

    return new HttpResponse(null, {
      status: 204,
    });
  }),
];
