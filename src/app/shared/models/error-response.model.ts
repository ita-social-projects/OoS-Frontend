export interface ErrorResponse {
  apiErrorResponse?: ApiErrorResponse;
  message?: string;
}

export interface ApiErrorResponse {
  apiErrors?: ApiError[];
}

export interface ApiError {
  group: string;
  code: string;
  message: string;
}
