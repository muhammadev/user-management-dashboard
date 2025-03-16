import { User } from "./User";
import { PaginatedResponse, ApiResponse } from "./ApiResponse";
import { UserStoreState } from "./Store";
import { CreateUserRequest, UpdateUserRequest, DeleteUserRequest } from "./ApiRequests";
import { UserDetailParams } from "./Router";

declare global {
  type UserType = User;
  type PaginatedApiResponse<T> = PaginatedResponse<T>;
  type ApiResponseType<T> = ApiResponse<T>;
  type UserStore = UserStoreState;
  type CreateUserPayload = CreateUserRequest;
  type UpdateUserPayload = UpdateUserRequest;
  type DeleteUserPayload = DeleteUserRequest;
  type UserParams = UserDetailParams;
}

export { };
