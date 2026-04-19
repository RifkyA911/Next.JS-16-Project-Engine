// types/user.ts

export type UserRoleType =
  | "superadmin"
  | "admin"
  | "manager"
  | "developer"
  | "member"
  | "moderator"
  | "editor"
  | "intern"
  | "guest"
  | "all";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  avatar?: string;
  department?: string;
  status?: "active" | "inactive" | "pending";
  joinDate?: string;
  lastLogin?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserDto {
  id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}
