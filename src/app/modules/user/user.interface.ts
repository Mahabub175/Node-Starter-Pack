import { userRoleValue } from "./user.constants";

export type TPreviousPasswords = {
  password: string;
  createdAt: Date;
};

export type TUser = {
  email: string;
  password: string;
  name: string;
  profile_image: string;
  address: string;
  phone_number: string;
  role: string;
  previous_passwords: TPreviousPasswords[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type TUserRole = keyof typeof userRoleValue;
