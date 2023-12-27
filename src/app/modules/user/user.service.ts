import mongoose from "mongoose";
import config from "../../config";
import {
  compareHashPassword,
  getPreviousPasswords,
} from "../../utils/passwordUtils";
import { TCreateUser } from "./user.interface";
import { userModel } from "./user.model";
import jwt from "jsonwebtoken";
import hashPassword from "../../middlewares/passwordHash";

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

const changeUserPassword = async (
  userId: string,
  userData: { currentPass: string; newPass: string }
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await userModel
      .findById(userId)
      .select("password previousPasswords")
      .session(session);

    const matchPassword = await compareHashPassword(
      userData.currentPass,
      user?.password as string
    );

    if (!matchPassword) {
      throw new Error("Passwords didn't match! Please try again.");
    }

    const previousPasswords: any = user?.previousPasswords || [];

    const matchingCurrentAndPreviousPasswords = previousPasswords.some(
      (prevPassword: any) =>
        compareHashPassword(userData.newPass, prevPassword.password)
    );

    if (matchingCurrentAndPreviousPasswords) {
      throw new Error(
        "Password change failed. Ensure the new password is unique and not among the last 2 used."
      );
    }

    const hashedPassword = await hashPassword(userData.newPass);

    if (previousPasswords.length > 0) {
      const crossMatch = previousPasswords.some((prevPassword: any) =>
        compareHashPassword(userData.newPass, prevPassword.password)
      );

      if (crossMatch) {
        throw new Error(
          "Password change failed. Ensure the new password is unique and not among the last 2 used."
        );
      }
    }

    if (previousPasswords.length >= 2) {
      const lastUsedPassword = previousPasswords[previousPasswords.length - 1];

      const deletePreviousPassword = await userModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            previousPasswords: {
              password: lastUsedPassword.password,
            },
          },
        },
        {
          session,
          runValidators: true,
        }
      );

      if (!deletePreviousPassword) {
        throw new Error("Failed to change password");
      }
    }

    const changedPassword = await userModel.findByIdAndUpdate(
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
        new: true,
      }
    );

    if (!changedPassword) {
      throw new Error("Failed to change password");
    }

    await session.commitTransaction();
    return changedPassword;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const userServices = {
  createUserIntoDb,
  loginUser,
  changeUserPassword,
};
