export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Inactive" | "Suspended";
  created_at: string;
}
