import { useState, useCallback } from "react";

import type { ApiError, ConflictError, UnprocessableEntityError } from "@/types";

type UseApiErrorReturn = {
  error: ApiError | null;
  conflictError: ConflictError | null;
  unprocessableError: UnprocessableEntityError | null;
  setError: (error: ApiError | null) => void;
  clearError: () => void;
  handleError: (err: unknown) => void;
};

const useApiError = (): UseApiErrorReturn => {
  const [error, setError] = useState<ApiError | null>(null);
  const [conflictError, setConflictError] = useState<ConflictError | null>(null);
  const [unprocessableError, setUnprocessableError] =
    useState<UnprocessableEntityError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    setConflictError(null);
    setUnprocessableError(null);
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (err && typeof err === "object" && "status" in err && "message" in err) {
      const apiError = err as ApiError;
      setError(apiError);

      if (apiError.status === 409) {
        setConflictError(err as ConflictError);
        setUnprocessableError(null);
      } else if (apiError.status === 422) {
        setConflictError(null);
        setUnprocessableError(err as UnprocessableEntityError);
      } else {
        setConflictError(null);
        setUnprocessableError(null);
      }
    } else if (err instanceof Error) {
      setError({
        status: 0,
        message: err.message,
      });
      setConflictError(null);
      setUnprocessableError(null);
    } else {
      setError({
        status: 0,
        message: "Une erreur inattendue s'est produite",
      });
      setConflictError(null);
      setUnprocessableError(null);
    }
  }, []);

  return {
    error,
    conflictError,
    unprocessableError,
    setError,
    clearError,
    handleError,
  };
};

export { useApiError };
