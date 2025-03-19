import { UserType } from './User';
import { PaginatedResponse, ApiResponse } from "./ApiResponse";
import { UserStoreState } from "./Store";
import { CreateUserRequest, UpdateUserRequest, DeleteUserRequest } from "./ApiRequests";
import { UserDetailParams } from "./Router";
import { RoleType } from "./Role"
import { StatusType } from "./Status"

declare global {
  type User = UserType;
  type Role = RoleType;
  type Status = StatusType;
  type PaginatedApiResponse<T> = PaginatedResponse<T>;
  type ApiResponseType<T> = ApiResponse<T>;
  type UserStore = UserStoreState;
  type CreateUserPayload = CreateUserRequest;
  type UpdateUserPayload = UpdateUserRequest;
  type DeleteUserPayload = DeleteUserRequest;
  type UserParams = UserDetailParams;
}

export { };
