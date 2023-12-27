import config from "../../config";
import { compareHashPassword } from "../../utils/passwordUtils";
import { TCreateUser } from "./user.interface";
import { userModel } from "./user.model";
import jwt from "jsonwebtoken";

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

const loginUser = async (userData: { username: string; password: string }) => {
  const user = await userModel
    .findOne({ username: userData?.username })
    .select("_id username email password role");

  if (!user) {
    throw new Error("User not found!");
  }
  if (!(await compareHashPassword(userData?.password, user?.password))) {
    throw new Error("Wrong password! Please try again with a valid password!");
  }
  const jwtPayload = {
    userId: user?._id,
    email: user?.email,
    role: user?.role,
  };
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expiration,
  });

  return {
    user: {
      _id: user?._id,
      username: user?.username,
      email: user?.email,
      role: user.role,
    },
    token,
  };
};

export const userServices = {
  createUserIntoDb,
  loginUser,
};
