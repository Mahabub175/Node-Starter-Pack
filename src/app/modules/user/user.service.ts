import { TCreateUser } from "./user.interface";
import { userModel } from "./user.model";

const createUserIntoDb = async (userData: TCreateUser) => {
  const result = await userModel.create(userData);

  const { _id, username, email, role, createdAt, updatedAt } = result;

  const userInfo = {
    _id,
    username,
    email,
    role,
    createdAt,
    updatedAt,
  };

  return userInfo;
};

export const userServices = {
  createUserIntoDb,
};
