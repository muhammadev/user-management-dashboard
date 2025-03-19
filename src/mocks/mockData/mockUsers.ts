import { mockRoles } from "./mockRoles";

function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function assignRandomRole() {
  const randomIndex = Math.floor(Math.random() * (2 - 0 + 1)) + 0;

  return mockRoles[randomIndex];
}

export const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: assignRandomRole(),
  status: i % 3 === 0 ? 'Active' : 'Inactive',
  created_at: getRandomDate(new Date('2025-01-01'), new Date()),
}));
