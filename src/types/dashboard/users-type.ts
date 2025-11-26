// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserDto {
  id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export type UsersResponse = User[];

export interface UsersApiResponse {
  data: User[];
  total: number;
}

export type UserId = string;
export type UserType = "admins" | "editors" | "users";
