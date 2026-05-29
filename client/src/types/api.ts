export type ApiError = {
  status: number;
  message: string;
};

export type ConflictError = ApiError & {
  detail?: string;
  invalidAdventurers?: Array<{
    id: string;
    name: string;
    reason: string;
  }>;
};

export type UnprocessableEntityError = ApiError & {
  unmetPrerequisite: {
    type: string;
    detail: string;
  };
};

export type PaginatedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};
