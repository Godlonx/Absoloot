export type ApiError = {
  status: number;
  message: string;
};

export type ConflictError = ApiError & {
  detail?: string;
  aventuriersInvalides?: Array<{
    id: string;
    nom: string;
    raison: string;
  }>;
};

export type UnprocessableEntityError = ApiError & {
  prerequisNonSatisfait: {
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
