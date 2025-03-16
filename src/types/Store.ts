import type { User } from "./User";

export interface UserStoreState {
  users: User[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  currentPage: number;
  perPage: number;
}
