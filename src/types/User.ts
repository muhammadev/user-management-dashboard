export interface UserType {
  id: number;
  name: string;
  role: Role;
  status: "Active" | "Inactive";
  created_at: Date;
  sessionToken?: string | null;
}
