import type { LoginData, UserCredentials, RegisterCredentials } from "@/types"
import { getMockUser } from "../data/user"

export const login = async (_credentials: UserCredentials): Promise<LoginData> => {
  const mockUser = getMockUser()
  localStorage.setItem("token", mockUser.token)
  localStorage.setItem("role", mockUser.role)
  localStorage.setItem("username", mockUser.username)
  return { token: mockUser.token, role: mockUser.role }
}

export const register = async (_credentials: RegisterCredentials): Promise<LoginData> => {
  const mockUser = getMockUser()
  localStorage.setItem("token", mockUser.token)
  localStorage.setItem("role", mockUser.role)
  localStorage.setItem("username", mockUser.username)
  return { token: mockUser.token, role: mockUser.role }
}

export const logout = (): void => {
  localStorage.removeItem("token")
  localStorage.removeItem("role")
  localStorage.removeItem("username")
}
