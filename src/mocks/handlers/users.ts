import { delay, http, HttpResponse } from 'msw';
import { mockUsers } from "../mockData/mockUsers"

const delayInRange = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

// interface UserParams {
//   page?: string;
//   pageSize?: string;
//   id?: string;
// }

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

      return (name ? user.name === name : true) && (role ? user.role === role : true) && (status ? user.status === status : true)
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
  http.get('/api/users/:id', ({ params }) => {
    const user = mockUsers.find((u) => u.id === Number(params.id));
    return user ? HttpResponse.json(user) : new HttpResponse(null, {
      status: 404,
      statusText: 'Out Of Apples'
    })
  }),
];