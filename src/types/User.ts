export interface UserType {
  id: number;
  name: string;
  role: Role['id'];
  status: "Active" | "Inactive";
  created_at: Date;
  sessionToken?: string | null;
}
