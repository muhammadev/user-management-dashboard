export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
