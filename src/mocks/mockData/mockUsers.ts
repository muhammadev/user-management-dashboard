function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const mockUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: i % 2 === 0 ? 'Admin' : 'Manager',
  status: i % 3 === 0 ? 'Active' : 'Inactive',
  created_at: getRandomDate(new Date('2025-01-01'), new Date()),
}));