import { userRoleValue } from "./user.constants";

export type TPreviousPasswords = {
  password: string;
  createdAt: Date;
};

export type TUser = {
  username: string;
  email: string;
  password: string;
  status: "active" | "inactive";
  name: string;
  profile_image: string;
  role: "user" | "admin";
  previousPasswords: TPreviousPasswords[];
  createdAt: string;
  updatedAt: string;
  total_amount: number;
};

export type TUserRole = keyof typeof userRoleValue;
