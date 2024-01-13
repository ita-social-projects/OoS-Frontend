export interface ErrorResponse {
  apiErrorResponse?: ApiErrorResponse;
  message?: string;
}

export interface ApiErrorResponse {
  apiErrors?: ApiError[];
}

export interface ApiError {
  message: string;
  code: string;
  group: string;
}
