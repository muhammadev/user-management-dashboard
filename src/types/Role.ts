export type RoleType = {
  id: number;
  name: "Admin" | "Manager" | "Viewer";
  permissions: ("read" | "write" | "delete")[]
}
