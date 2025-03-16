export const mockUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: i % 2 === 0 ? 'Admin' : 'Manager',
  status: i % 3 === 0 ? 'Active' : 'Inactive',
}));