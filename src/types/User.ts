export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Viewer";
  status: "Active" | "Inactive" | "Suspended";
  dateJoined: string;
}
