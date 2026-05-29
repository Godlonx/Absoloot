export type UserRole = "ADMIN" | "VIEWER"

export type UserCredentials = {
  username: string
  password: string
}

export type Roles = "VIEWER" | "ADMIN"

export type RegisterCredentials = {
  username: string
  password: string
  role: Roles
}

export type LoginData = {
  token: string
  role: UserRole
}
