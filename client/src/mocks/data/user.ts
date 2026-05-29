import type { LoginData, UserRole } from "@/types"

export const mockUser: LoginData & { username: string } = {
  token: "mock-jwt-token-for-testing-purposes-only",
  username: "MockAdmin",
  role: "ADMIN" as UserRole,
}

export const getMockUser = () => ({ ...mockUser })
