export type Role = "user" | "admin";

export type User = {
  id: string;
  userName: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type AuthStatus = "unknown" | "authenticated" | "anonymous";

export type AuthState = {
  user: User | null;
  status: AuthStatus;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  userName: string;
};

export type AuthResponse = { user: User };
