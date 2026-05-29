import type { LoginData, RegisterCredentials, UserCredentials } from "@/types";
import { api } from "./api";
import { isMockEnabled, mockAuthService } from "@/mocks";

export const login = async (credentials: UserCredentials): Promise<LoginData> => {
  if (isMockEnabled()) {
    return mockAuthService.login(credentials);
  }
  const data = await api.post<LoginData>("/auth/login", credentials);
  localStorage.setItem("token", data.token);
  return data;
};

export const register = async (credentials: RegisterCredentials): Promise<LoginData> => {
  if (isMockEnabled()) {
    return mockAuthService.register(credentials);
  }
  const data = await api.post<LoginData>("/auth/register", credentials);
  localStorage.setItem("token", data.token);
  return data;
};

export const logout = async (): Promise<void> => {
  if (isMockEnabled()) {
    mockAuthService.logout();
    return;
  }
  await api.post("/auth/logout");
  localStorage.removeItem("token");
};
