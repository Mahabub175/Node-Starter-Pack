export type TPreviousPasswords = {
  password: string;
  createdAt: Date;
};

export type TCreateUser = {
  username: string;
  email: string;
  password: string;
  role: string;
  previousPasswords: TPreviousPasswords[];
};
