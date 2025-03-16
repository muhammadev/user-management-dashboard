export interface CreateUserRequest {
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Viewer";
  status: "Active" | "Inactive" | "Suspended";
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> { }

export interface DeleteUserRequest {
  id: number;
}
