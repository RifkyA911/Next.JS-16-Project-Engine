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
}

export interface UserDto {
  id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}
