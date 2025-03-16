import { delay, http, HttpResponse } from 'msw';

const users = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: i % 2 === 0 ? 'Admin' : 'Manager',
  status: i % 3 === 0 ? 'Active' : 'Inactive',
}));

const delayInRange = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

export const handlers = [
  http.get('/api/users', async () => {
    await delay(delayInRange)
    return HttpResponse.json(users);
  }),
  http.get('/api/users/:id', ({ params }) => {
    const user = users.find((u) => u.id === Number(params.id));
    return user ? HttpResponse.json(user) : new HttpResponse(null, {
      status: 404,
      statusText: 'Out Of Apples'
    })
  }),
];