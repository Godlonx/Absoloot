export type UserRole = "ADMIN" | "VIEWER";

export type UserCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  password: string;
};

export type LoginData = {
  token: string;
  role: UserRole;
};
