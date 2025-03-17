import { delay, http, HttpResponse } from 'msw';
import { mockUsers } from "../mockData/mockUsers"

const delayInRange = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

export const handlers = [
  http.get('/api/users', async ({ request }) => {
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
  http.get('/api/users/:id', async ({ params }) => {
    await delay(delayInRange);

    const user = mockUsers.find((u) => u.id === Number(params.id));
    return user ? HttpResponse.json(user) : new HttpResponse(null, {
      status: 404,
      statusText: 'User Not Found'
    })
  }),
  http.put('/api/users/:id', async ({ params, request }) => {
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

  http.delete('/api/users/:id', ({ params }) => {
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