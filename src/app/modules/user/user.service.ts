import mongoose from "mongoose";
import config from "../../config";
import {
  checkCurrentPasswordToPreviousPassword,
  compareHashPassword,
  getPreviousPasswords,
  hashPassword,
} from "../../utils/passwordUtils";
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
      role: user?.role,
    },
    token,
  };
};

const changeUserPassword = async (
  userId: string,
  userData: { currentPassword: string; newPassword: string }
) => {
  const user = await userModel
    .findById(userId)
    .select("password previousPasswords");

  const matchPassword = await compareHashPassword(
    userData?.currentPassword,
    user?.password as string
  );

  if (!matchPassword) {
    throw new Error("Passwords do not match! Please try again!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const previousPasswords = user?.previousPasswords;
    const compareCurrentAndPreviousPasswords = await compareHashPassword(
      userData?.newPassword,
      user?.password as string
    );

    if (compareCurrentAndPreviousPasswords) {
      throw new Error(
        "Password Change Failed! Please Ensure that new password in unique from the previous used 2 passwords!"
      );
    }

    const hashedPassword = await hashPassword(userData?.newPassword);
    if (previousPasswords && previousPasswords.length > 0) {
      const crossCheck = await checkCurrentPasswordToPreviousPassword(
        userData?.newPassword,
        previousPasswords
      );
      if (crossCheck) {
        throw new Error(
          "Password Change Failed! Please Ensure that new password in unique from the previous used 2 passwords!"
        );
      }
      if (previousPasswords.length >= 2) {
        const lastPreviousPassword = await getPreviousPasswords(
          previousPasswords
        );

        const deletePreviousPassword = await userModel.findByIdAndUpdate(
          userId,
          {
            $pull: {
              previousPasswords: {
                password: lastPreviousPassword.password,
              },
            },
          },
          {
            session,
            runValidators: true,
          }
        );
        if (!deletePreviousPassword) {
          throw new Error("Failed to change password!");
        }
        const changePassword = await userModel.findByIdAndUpdate(
          userId,
          {
            password: hashedPassword,
            $addToSet: {
              previousPasswords: {
                password: hashedPassword,
                createdAt: new Date(),
              },
            },
          },
          {
            session,
            runValidators: true,
          }
        );
        if (!changePassword) {
          throw new Error("Failed to change password!");
        } else {
          const changePassword = await userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
            $addToSet: {
              previousPasswords: {
                password: hashedPassword,
                createdAt: new Date(),
              },
            },
          });
          if (!changePassword) {
            throw new Error("Failed to change password!");
          }
        }
        await session.commitTransaction();
        await session.endSession();

        const updatedUser = await userModel.findById(userId);
        return updatedUser;
      }
    }
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const userServices = {
  createUserIntoDb,
  loginUser,
  changeUserPassword,
};
