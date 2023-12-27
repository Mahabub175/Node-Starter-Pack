import { userRoleValue } from "./user.constants";

export type TPreviousPasswords = {
  password: string;
  createdAt: Date;
};

export type TCreateUser = {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  previousPasswords: TPreviousPasswords[];
  createdAt: string;
  updatedAt: string;
};

export type TUserRole = keyof typeof userRoleValue;
