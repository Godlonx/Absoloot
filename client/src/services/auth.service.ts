import type { LoginData, RegisterCredentials, UserCredentials } from "@/types";
import { api } from "./api";

export const login = async (credentials: UserCredentials): Promise<LoginData> => {
  const data = await api.post<LoginData>("/auth/login", credentials);
  localStorage.setItem("token", data.token);
  return data;
};

export const register = async (credentials: RegisterCredentials): Promise<LoginData> => {
  const data = await api.post<LoginData>("/auth/register", credentials);
  localStorage.setItem("token", data.token);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
};
