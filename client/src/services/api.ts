import type { ConflictError, UnprocessableEntityError } from "@/types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }));

    if (response.status === 409) {
      const conflictError: ConflictError = {
        status: 409,
        message: error.message || "Conflit detecte",
        detail: error.detail,
        invalidAdventurers: error.invalidAdventurers,
      };
      throw conflictError;
    }

    if (response.status === 422 && error.unmetPrerequisite) {
      const unprocessableError: UnprocessableEntityError = {
        status: 422,
        message: error.message || "Les prerequis ne sont pas satisfaits",
        unmetPrerequisite: error.unmetPrerequisite,
      };
      throw unprocessableError;
    }

    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  delete: async (endpoint: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },
};
